import { useState, useEffect } from 'react'
import axios from 'axios'

function TextViewer({ file, onLoad, onError }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTextFile()
  }, [file])

  const loadTextFile = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/files/${file.id}/download`)
      setContent(response.data)
      setLoading(false)
      onLoad()
    } catch (error) {
      console.error('Error loading text file:', error)
      setLoading(false)
      onError('Failed to load text file')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading text file...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <pre className="p-6 overflow-auto bg-gray-50 text-sm font-mono text-gray-900 whitespace-pre-wrap max-h-[70vh]">
          {content}
        </pre>
      </div>
    </div>
  )
}

export default TextViewer

