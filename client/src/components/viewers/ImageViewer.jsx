import { useState } from 'react'

function ImageViewer({ file, onLoad, onError }) {
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    onLoad()
  }

  const handleImageError = () => {
    setImageError(true)
    onError('Failed to load image')
  }

  if (imageError) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Failed to load image</p>
        <a
          href={`/api/files/${file.id}/download`}
          download
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Download Image
        </a>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="max-w-full">
        <img
          src={`/api/files/${file.id}/download`}
          alt={file.originalName}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="max-w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '70vh' }}
        />
      </div>
    </div>
  )
}

export default ImageViewer

