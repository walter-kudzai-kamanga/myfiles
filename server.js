import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Store file metadata
let fileMetadata = [];

const metadataFile = path.join(__dirname, 'file-metadata.json');

async function loadMetadata() {
  try {
    fileMetadata = JSON.parse(await fs.readFile(metadataFile, 'utf-8'));
  } catch {
    fileMetadata = [];
  }
}
async function saveMetadata() {
  await fs.writeFile(metadataFile, JSON.stringify(fileMetadata, null, 2));
}

loadMetadata();

// ----------------------------
// API ROUTES
// ----------------------------

// Get all files
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir);
    const currentFiles = new Set(files);

    fileMetadata = fileMetadata.filter(meta => currentFiles.has(meta.filename));

    for (const file of files) {
      if (!fileMetadata.find(m => m.filename === file)) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        const ext = path.extname(file).toLowerCase();

        fileMetadata.push({
          id: Date.now() + Math.random(),
          filename: file,
          originalName: file.split('-').slice(2).join('-') || file,
          size: stats.size,
          uploadDate: stats.birthtime.toISOString(),
          type: getFileType(ext),
          extension: ext
        });
      }
    }

    await saveMetadata();
    res.json(fileMetadata.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Upload file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const newFile = {
      id: Date.now() + Math.random(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      type: getFileType(ext),
      extension: ext
    };

    fileMetadata.push(newFile);
    await saveMetadata();

    res.json({ message: 'File uploaded successfully', file: newFile });
  } catch {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete file
app.delete('/api/files/:id', async (req, res) => {
  try {
    const file = fileMetadata.find(f => f.id.toString() === req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    await fs.unlink(path.join(uploadsDir, file.filename));
    fileMetadata = fileMetadata.filter(f => f.id.toString() !== req.params.id);
    await saveMetadata();

    res.json({ message: 'File deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

//Download file
app.get('/api/files/:id/download', (req, res) => {
  const file = fileMetadata.find(f => f.id.toString() === req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  res.sendFile(path.join(uploadsDir, file.filename));
});

// File type helper
function getFileType(ext) {
  const types = {
    '.pdf': 'pdf',
    '.doc': 'word',
    '.docx': 'word',
    '.csv': 'csv',
    '.xls': 'excel',
    '.xlsx': 'excel',
    '.txt': 'text',
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.gif': 'image',
    '.webp': 'image'
  };
  return types[ext] || 'other';
}

// ----------------------------
// FRONTEND PRODUCTION SERVE
// ----------------------------
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'client/dist/index.html'))
);

// ----------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
