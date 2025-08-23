export default function TestSimple() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Simple Test Page</h1>
        <p className="text-gray-600 mb-4">
          This page should load without any Firebase dependencies.
        </p>
        <div className="space-y-2">
          <a 
            href="/" 
            className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
          <a 
            href="/debug-firebase" 
            className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Firebase
          </a>
        </div>
      </div>
    </div>
  )
}
