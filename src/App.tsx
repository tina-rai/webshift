import { useState, useEffect } from 'react'
import type {
  PageAnalysis,
  AnalyzePageResponse,
  WebShiftSettings,
    
} from './shared/messages'

import { DEFAULT_SETTINGS } from './shared/messages'

function App() {
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [amoledEnabled, setAmoledEnabled] = useState(false)
  const [darkEnabled, setDarkEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wideContentEnabled, setWideContentEnabled] = useState(false)
  const [sidebarEnabled, setSidebarEnabled] = useState(false)
  const [adsEnabled, setAdsEnabled] = useState(false) 
  


  // Load saved settings when popup opens
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await chrome.storage.sync.get({
          amoledEnabled: DEFAULT_SETTINGS.amoledEnabled,
          darkEnabled: DEFAULT_SETTINGS.darkEnabled,
          wideContentEnabled: DEFAULT_SETTINGS.wideContentEnabled,
          sidebarHidden: DEFAULT_SETTINGS.sidebarHidden,
        })
  
        const settings = stored as unknown as WebShiftSettings
  
        setAmoledEnabled(settings.amoledEnabled)
        setDarkEnabled(settings.darkEnabled)
        setWideContentEnabled(settings.wideContentEnabled)
        setSidebarEnabled(settings.sidebarHidden)
      } catch (error) {
        console.error(
          'WebShift settings load error:',
          error
        )
      }
    }
  
    loadSettings()
  }, [])
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
  
      const response = await chrome.tabs.sendMessage(
        tab.id,
        {
          type: 'ANALYZE_PAGE',
        }
      ) as AnalyzePageResponse
  
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
      <div className="mt-5">
  <h2 className="font-semibold">
    Appearance
  </h2>

  <button
    className="mt-2 rounded border px-3 py-2 text-sm"
    onClick={async () => {
      const enabled = !amoledEnabled

      setAmoledEnabled(enabled)
      await chrome.storage.sync.set({
        amoledEnabled: enabled,
      })

      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })

        if (!tab.id) {
          return
        }

        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_AMOLED',
          enabled,
        })
      } catch (error) {
        console.error(
          'WebShift AMOLED error:',
          error
        )
      }
    }}
  >
    {amoledEnabled ? 'Disable AMOLED' : 'Enable AMOLED'}
  </button>
  <button
  className="mt-2 rounded border px-3 py-2 text-sm"
  onClick={async () => {
    const enabled = !darkEnabled

    setDarkEnabled(enabled)
    await chrome.storage.sync.set({
      darkEnabled: enabled,
    })

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        return
      }

      await chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_DARK',
        enabled,
      })
    } catch (error) {
      console.error(
        'WebShift dark mode error:',
        error
      )
    }
  }}
>
  {darkEnabled ? 'Disable Dark' : 'Enable Dark'}
</button>

<div className="mt-4">
  <label
    htmlFor="font-select"
    className="text-sm font-medium"
  >
    Font
  </label>

  <select
    id="font-select"
    className="mt-2 w-full rounded border px-3 py-2 text-sm"
    defaultValue="system-ui"
    onChange={async (event) => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        return
      }

      await chrome.tabs.sendMessage(tab.id, {
        type: 'SET_FONT',
        font: event.target.value,
      })
    }}
  >
    <option value="system-ui">
      System
    </option>

    <option value="Inter">
      Inter
    </option>

    <option value="Arial">
      Arial
    </option>

    <option value="Georgia">
      Georgia
    </option>

    <option value="monospace">
      Monospace
    </option>
  </select>
</div>
<div className="mt-4">
  <label
    htmlFor="text-size"
    className="text-sm font-medium"
  >
    Text size
  </label>

  <input
    id="text-size"
    type="range"
    min="12"
    max="24"
    defaultValue="16"
    className="mt-2 w-full"
    onChange={async (event) => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        return
      }

      await chrome.tabs.sendMessage(tab.id, {
        type: 'SET_TEXT_SIZE',
        size: Number(event.target.value),
      })
    }}
  />

  <div className="flex justify-between text-xs text-gray-500">
    <span>12px</span>
    <span>24px</span>
  </div>
</div>
</div> 
<div className="mt-5">
  <h2 className="font-semibold">
    Layout
  </h2>

  <button
    className="mt-2 w-full rounded border px-3 py-2 text-sm"
    onClick={async () => {
      const enabled = !wideContentEnabled

      setWideContentEnabled(enabled)
      await chrome.storage.sync.set({
        wideContentEnabled: enabled,
      })

      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })

        if (!tab.id) {
          return
        }

        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_WIDE_CONTENT',
          enabled,
        })
      } catch (error) {
        console.error(
          'WebShift wide content error:',
          error
        )
      }
    }}
  >
    {wideContentEnabled
      ? ' Disable Wide Content'
      : ' Enable Wide Content'}
  </button>

  <button
    className="mt-2 w-full rounded border px-3 py-2 text-sm"
    onClick={async () => {
      const enabled = !sidebarEnabled

      setSidebarEnabled(enabled)
      await chrome.storage.sync.set({
        sidebarHidden: enabled,
      })

      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })

        if (!tab.id) {
          return
        }

        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_SIDEBAR',
          enabled,
        })
      } catch (error) {
        console.error(
          'WebShift sidebar error:',
          error
        )
      }
    }}
  >
    {sidebarEnabled
      ? ' Show Sidebar'
      : ' Hide Sidebar'}
  </button>

  <button
  className="mt-2 w-full rounded border px-3 py-2 text-sm"
  onClick={async () => {
    const enabled = !adsEnabled

    setAdsEnabled(enabled)

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        return
      }

      await chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_ADS',
        enabled,
      })
    } catch (error) {
      console.error(
        'WebShift ads error:',
        error
      )
    }
  }}
>
  {adsEnabled
    ? ' Show Ads'
    : ' Hide Ads'}
</button>
</div>
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
      <strong>Confidence:</strong> {analysis.frameworkConfidence}
    </p>

    <p>
      <strong>Meta-framework:</strong> {analysis.metaFramework}
    </p>

    <p>
      <strong>Confidence:</strong> {analysis.metaFrameworkConfidence}
    </p>

    {analysis.frameworkEvidence.length > 0 && (
      <div className="mt-2">
        <p className="font-medium">Framework evidence:</p>

        <ul className="list-disc pl-5">
          {analysis.frameworkEvidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    {analysis.metaFrameworkEvidence.length > 0 && (
      <div className="mt-2">
        <p className="font-medium">Meta-framework evidence:</p>

        <ul className="list-disc pl-5">
          {analysis.metaFrameworkEvidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

  </section>
)}
    </main>
  )
}

export default App