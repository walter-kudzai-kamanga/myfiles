import { useState, useEffect } from 'react'
import mammoth from 'mammoth'
import axios from 'axios'

function WordViewer({ file, onLoad, onError }) {
  const [htmlContent, setHtmlContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWordDocument()
  }, [file])

  const loadWordDocument = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/files/${file.id}/download`, {
        responseType: 'arraybuffer'
      })

      const result = await mammoth.convertToHtml({ arrayBuffer: response.data })
      setHtmlContent(result.value)

      if (result.messages.length > 0) {
        console.warn('Word conversion messages:', result.messages)
      }

      setLoading(false)
      onLoad()
    } catch (error) {
      console.error('Error loading Word document:', error)
      setLoading(false)
      onError('Failed to load Word document')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Word document...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-700 text-sm font-medium">Read-only view. This document cannot be edited.</p>
        </div>
      </div>
      <div
        className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto prose prose-lg max-w-none word-viewer"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          fontFamily: 'Georgia, serif',
          lineHeight: '1.8',
          color: '#333'
        }}
      />
      <style>{`
        .word-viewer h1, .word-viewer h2, .word-viewer h3, .word-viewer h4, .word-viewer h5, .word-viewer h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        .word-viewer p {
          margin-bottom: 1em;
        }
        .word-viewer ul, .word-viewer ol {
          margin-left: 2em;
          margin-bottom: 1em;
        }
        .word-viewer table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        .word-viewer table td, .word-viewer table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .word-viewer table th {
          background-color: #f2f2f2;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default WordViewer

