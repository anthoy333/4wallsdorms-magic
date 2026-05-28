"use client"

import { useState, useEffect } from "react"

export default function TestBackblazePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const folderPath = "Suffolk University Dorms/Miller/Floor 5/503 + 504/"
      const encodedPath = encodeURIComponent(folderPath)
      
      console.log("Testing folder path:", folderPath)
      console.log("Encoded path:", encodedPath)
      
      const response = await fetch(`/api/backblaze/list?folder=${encodedPath}`)
      const data = await response.json()
      
      console.log("API Response:", data)
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        setError(`API Error ${response.status}: ${data.error || 'Unknown error'}`)
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Backblaze API Test</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test API"}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Success!</h3>
          <p>Found {result.files?.length || 0} files</p>
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold">View Raw Response</summary>
            <pre className="mt-2 p-2 bg-gray-100 text-gray-800 text-xs overflow-auto rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
          
          {result.files && result.files.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Files Found:</h4>
              <ul className="list-disc list-inside">
                {result.files.map((file: any, index: number) => (
                  <li key={index} className="text-sm">
                    {file.fileName} ({file.type}) - {file.contentLength} bytes
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}