import { useState, useEffect } from 'react'
import axios from 'axios'
import PDFViewer from './viewers/PDFViewer'
import WordViewer from './viewers/WordViewer'
import CSVViewer from './viewers/CSVViewer'
import ImageViewer from './viewers/ImageViewer'
import TextViewer from './viewers/TextViewer'

function FileViewer({ file, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
  }, [file])

  const renderViewer = () => {
    switch (file.type) {
      case 'pdf':
        return <PDFViewer file={file} onLoad={() => setLoading(false)} onError={setError} />
      case 'word':
        return <WordViewer file={file} onLoad={() => setLoading(false)} onError={setError} />
      case 'csv':
        return <CSVViewer file={file} onLoad={() => setLoading(false)} onError={setError} />
      case 'image':
        return <ImageViewer file={file} onLoad={() => setLoading(false)} onError={setError} />
      case 'text':
        return <TextViewer file={file} onLoad={() => setLoading(false)} onError={setError} />
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">This file type cannot be previewed.</p>
            <a
              href={`/api/files/${file.id}/download`}
              download
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Download File
            </a>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{file.originalName}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {file.type.toUpperCase()} • {formatFileSize(file.size)}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <a
              href={`/api/files/${file.id}/download`}
              download
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading file...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <a
                href={`/api/files/${file.id}/download`}
                download
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Download File Instead
              </a>
            </div>
          )}
          {!loading && !error && renderViewer()}
        </div>
      </div>
    </div>
  )
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export default FileViewer

