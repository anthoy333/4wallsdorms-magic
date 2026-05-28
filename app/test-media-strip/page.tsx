"use client"

import { useState } from "react"
import { runAllTests } from "@/app/utils/__tests__/mediaStripLogic.test"

/**
 * Test Page for MediaStrip Logic
 * 
 * Visit this page in your browser to see the test results.
 * URL: http://localhost:3000/test-media-strip
 */
export default function TestMediaStripPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [allPassed, setAllPassed] = useState<boolean | null>(null)

  const runTests = () => {
    setIsRunning(true)
    setTestResults([])
    setAllPassed(null)

    // Capture console output
    const logs: string[] = []
    const originalLog = console.log

    console.log = (...args: any[]) => {
      const message = args.map((arg) => {
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2)
          } catch {
            return String(arg)
          }
        }
        return String(arg)
      }).join(" ")
      logs.push(message)
      originalLog(...args)
    }

    try {
      const result = runAllTests()
      setAllPassed(result)
      // Wait a moment for all console.logs to be captured
      setTimeout(() => {
        setTestResults([...logs])
        console.log = originalLog
        setIsRunning(false)
      }, 100)
    } catch (error) {
      setTestResults([...logs, `Error: ${error instanceof Error ? error.message : String(error)}`])
      setAllPassed(false)
      console.log = originalLog
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4">MediaStrip Logic Tests</h1>
          <p className="text-gray-600 mb-6">
            Click the button below to run all MediaStrip logic tests.
          </p>

          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold mb-6"
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </button>

          {allPassed !== null && (
            <div className={`p-4 rounded-lg mb-6 ${
              allPassed ? "bg-green-50 border-2 border-green-500" : "bg-red-50 border-2 border-red-500"
            }`}>
              <h2 className={`text-xl font-bold mb-2 ${
                allPassed ? "text-green-800" : "text-red-800"
              }`}>
                {allPassed ? "✅ All Tests Passed!" : "❌ Some Tests Failed"}
              </h2>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {testResults.join("\n")}
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold mb-2">What's being tested:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Orientation Classification (LANDSCAPE, PORTRAIT, SQUAREISH)</li>
              <li>Cover Tile Selection (plaque priority)</li>
              <li>Tile Sorting (cover first, then priority)</li>
              <li>Size Determination (HERO, WIDE, TALL, SMALL)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

