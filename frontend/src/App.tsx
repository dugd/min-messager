import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Tailwind + React
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
        <p className="text-lg">
          Count: <span className="font-mono text-blue-400">{count}</span>
        </p>

        <button
          onClick={() => setCount((n) => n + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          Increment
        </button>

        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-lg text-sm"
        >
          Reset
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Edit <code className="bg-gray-800 px-1 rounded">src/App.tsx</code> to experiment
      </p>
    </div>
  )
}

export default App
