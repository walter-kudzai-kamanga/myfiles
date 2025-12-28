# File Management System

A professional file management system with admin upload capabilities and client-side file viewing.

## Features

- **Admin Interface**: Upload and manage files (PDF, Word, CSV, Excel, Images, etc.)
- **Client Interface**: Browse and view files in-app (read-only mode)
- **Multiple File Types**: Supports PDF, Word, CSV, Excel, Images, Text files
- **Professional UI**: Modern, responsive design with enhanced user experience

## Installation

1. Navigate to the project directory:
```bash
cd file-management-system
```

2. Install all dependencies (both backend and frontend):
```bash
npm run install-all
```

3. Start the development server:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend client (port 5173).

You can access:
- **Client View**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin

## Usage

- **Admin Mode**: Access the admin panel to upload files
- **Client Mode**: Browse and view uploaded files (read-only)
- Files are stored in the `uploads/` directory
- All file metadata is saved in `file-metadata.json`

## File Types Supported

- **PDF**: View in PDF viewer with navigation controls
- **Word (.doc, .docx)**: Convert to HTML and display (read-only mode - cannot be edited)
- **CSV**: Display as interactive table with all rows and columns
- **Excel (.xls, .xlsx)**: Download option (preview coming soon)
- **Images** (PNG, JPG, JPEG, GIF, WEBP): Display directly in viewer
- **Text files**: Display with syntax-friendly formatting
- **Other file types**: Download option available

## Features Details

### Admin Panel
- Drag & drop file upload
- Multiple file upload support
- File deletion
- File metadata tracking (size, upload date, type)
- Real-time file list updates

### Client View
- Search and filter files
- View files in-app (read-only)
- Professional file viewer for each type
- Download option for all files
- Responsive design for mobile and desktop

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Styling**: Tailwind CSS
- **File Processing**: Multer (upload), Mammoth (Word), PapaParse (CSV), React-PDF (PDF)

