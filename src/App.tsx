import { useState } from 'react'
import type { PageAnalysis } from './shared/messages'

function App() {
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzePage = async () => {
    setLoading(true)
    setError(null)

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        throw new Error('Could not find the active tab.')
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'ANALYZE_PAGE',
      })

      setAnalysis(response.data)
    } catch {
      setError('Unable to analyze this page.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-80 p-5">
      <h1 className="text-2xl font-bold">
        WebShift
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Understand and transform the web.
      </p>

      <button
        onClick={analyzePage}
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Page'}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

{analysis && (
  <section className="mt-5 space-y-4 text-sm">
    <div>
      <h2 className="font-semibold">Basic</h2>

      <div className="mt-2 space-y-1">
        <p><strong>Title:</strong> {analysis.title}</p>
        <p><strong>DOM nodes:</strong> {analysis.domNodes}</p>
        <p><strong>Images:</strong> {analysis.images}</p>
        <p><strong>Links:</strong> {analysis.links}</p>
        <p><strong>Scripts:</strong> {analysis.scripts}</p>
      </div>
    </div>

    <div>
      <h2 className="font-semibold">Structure</h2>

      <div className="mt-2 space-y-1">
        <p><strong>Headings:</strong> {analysis.headings}</p>
        <p><strong>Buttons:</strong> {analysis.buttons}</p>
        <p><strong>Forms:</strong> {analysis.forms}</p>
        <p><strong>Inputs:</strong> {analysis.inputs}</p>
      </div>
    </div>

    <div>
      <h2 className="font-semibold">Links</h2>

      <p className="mt-2">
        <strong>External links:</strong> {analysis.externalLinks}
      </p>
    </div>

    <div>
      <h2 className="font-semibold">Accessibility</h2>

      <p className="mt-2">
        <strong>Images without alt:</strong> {analysis.imagesWithoutAlt}
      </p>
    </div>

    <div>
  <h2 className="font-semibold">Technology</h2>

  <div className="mt-2 space-y-1">
    <p>
      <strong>Framework:</strong> {analysis.framework}
    </p>

    <p>
      <strong>Meta-framework:</strong> {analysis.metaFramework}
    </p>
  </div>
</div>
  </section>
)}
    </main>
  )
}

export default App