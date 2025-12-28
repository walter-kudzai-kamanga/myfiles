import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import axios from 'axios'

function CSVViewer({ file, onLoad, onError }) {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCSV()
  }, [file])

  const loadCSV = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/files/${file.id}/download`)

      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing errors:', results.errors)
          }

          if (results.data && results.data.length > 0) {
            setHeaders(Object.keys(results.data[0]))
            setData(results.data.slice(0, 1000)) // Limit to 1000 rows for performance
            if (results.data.length > 1000) {
              console.warn('CSV truncated to 1000 rows for display')
            }
          } else {
            setData([])
            setHeaders([])
          }

          setLoading(false)
          onLoad()
        },
        error: (error) => {
          console.error('CSV parsing error:', error)
          setLoading(false)
          onError('Failed to parse CSV file')
        }
      })
    } catch (error) {
      console.error('Error loading CSV:', error)
      setLoading(false)
      onError('Failed to load CSV file')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading CSV file...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data found in CSV file</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-blue-700 text-sm">
            Showing {data.length} row{data.length !== 1 ? 's' : ''} • Read-only view
          </p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[header] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CSVViewer

