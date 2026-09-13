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
          adsHidden: DEFAULT_SETTINGS.adsHidden,
        })
  
        const settings = stored as unknown as WebShiftSettings
  
        setAmoledEnabled(settings.amoledEnabled)
        setDarkEnabled(settings.darkEnabled)
        setWideContentEnabled(settings.wideContentEnabled)
        setSidebarEnabled(settings.sidebarHidden)
        setAdsEnabled(settings.adsHidden)
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
<main className="w-[360px] max-h-[600px] overflow-y-auto bg-white p-5 font-sans text-gray-900">     
<div>
  <h1 className="text-2xl font-bold tracking-tight">
    WebShift
  </h1>

  <p className="mt-1 text-sm text-gray-500">
    Understand and transform the web.
  </p>
</div>
      <div className="mt-5">
      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
  Appearance
</h2>

  <button
className={`mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
  amoledEnabled
    ? 'border-black bg-black text-white'
    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
}`}    onClick={async () => {
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
<span>AMOLED</span>
<span className="text-xs opacity-70">
  {amoledEnabled ? 'ON' : 'OFF'}
</span>  </button>
  <button
className={`mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
  darkEnabled
    ? 'border-black bg-black text-white'
    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
}`}  onClick={async () => {
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
<span>Dark Mode</span>
<span className="text-xs opacity-70">
  {darkEnabled ? 'ON' : 'OFF'}
</span></button>

<h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
  Typography
</h2>
<div className="mt-4">
<label
  htmlFor="text-size"
  className="mt-4 block text-sm font-medium"
>
  Text size
</label>

  <select
    id="font-select"
    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black"    defaultValue="system-ui"
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
<h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
  Layout
</h2>

  <button
className={`mt-3 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
  wideContentEnabled
    ? 'border-black bg-black text-white'
    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
}`}    onClick={async () => {
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
<span>Wide Content</span>
<span className="text-xs opacity-70">
  {wideContentEnabled ? 'ON' : 'OFF'}
</span>
  </button>

  <button
className={`mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
  sidebarEnabled
    ? 'border-black bg-black text-white'
    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
}`}    onClick={async () => {
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
<span>Hide Sidebar</span>
<span className="text-xs opacity-70">
  {sidebarEnabled ? 'ON' : 'OFF'}
</span>
  </button>

  <button
className={`mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
  adsEnabled
    ? 'border-black bg-black text-white'
    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
}`}  onClick={async () => {
    const enabled = !adsEnabled

    setAdsEnabled(enabled)
    await chrome.storage.sync.set({
      adsHidden: enabled,
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
<span>Hide Ads</span>
<span className="text-xs opacity-70">
  {adsEnabled ? 'ON' : 'OFF'}
</span>
</button>
</div>
      <button
        onClick={analyzePage}
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"      >
        {loading ? 'Analyzing...' : 'Analyze Page'}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

{analysis && (
  <section className="mt-6 border-t border-gray-200 pt-5">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      Page Analysis
    </h2>

    <div className="mt-4 space-y-5 text-sm">  
    <div>
  <h3 className="font-semibold">Basic</h3>

  <p className="mt-2 truncate text-xs text-gray-500" title={analysis.title}>
    {analysis.title}
  </p>

  <div className="mt-3 grid grid-cols-2 gap-2">
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.domNodes}</p>
      <p className="mt-1 text-xs text-gray-500">DOM nodes</p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.images}</p>
      <p className="mt-1 text-xs text-gray-500">Images</p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.links}</p>
      <p className="mt-1 text-xs text-gray-500">Links</p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.scripts}</p>
      <p className="mt-1 text-xs text-gray-500">Scripts</p>
    </div>
  </div>
</div>

<div>
  <h3 className="font-semibold">Structure</h3>

  <div className="mt-3 grid grid-cols-2 gap-2">
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.headings}</p>
      <p className="mt-1 text-xs text-gray-500">Headings</p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.buttons}</p>
      <p className="mt-1 text-xs text-gray-500">Buttons</p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.forms}</p>
      <p className="mt-1 text-xs text-gray-500">Forms</p>
    </div>

    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xl font-semibold">{analysis.inputs}</p>
      <p className="mt-1 text-xs text-gray-500">Inputs</p>
    </div>
  </div>
</div>

<div>
  <h3 className="font-semibold">Links</h3>

  <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
    <span className="text-sm text-gray-600">External links</span>
    <span className="font-semibold">{analysis.externalLinks}</span>
  </div>
</div>

<div>
  <h3 className="font-semibold">Accessibility</h3>

  <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
    <span className="text-sm text-gray-600">
      Images without alt
    </span>

    <span
      className={`font-semibold ${
        analysis.imagesWithoutAlt > 0
          ? 'text-red-600'
          : 'text-green-600'
      }`}
    >
      {analysis.imagesWithoutAlt}
    </span>
  </div>
</div>

<div>
  <h3 className="font-semibold">Technology</h3>

  <div className="mt-3 space-y-2">
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
      <div>
        <p className="text-sm text-gray-500">Framework</p>
        <p className="mt-1 font-medium">{analysis.framework}</p>
      </div>

      <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium">
        {analysis.frameworkConfidence}
      </span>
    </div>

    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
      <div>
        <p className="text-sm text-gray-500">Meta-framework</p>
        <p className="mt-1 font-medium">
          {analysis.metaFramework}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
  <div>
    <p className="text-sm text-gray-500">Platform</p>
    <p className="mt-1 font-medium">
      {analysis.platform}
    </p>
  </div>

  <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium">
    {analysis.platformConfidence}
  </span>
</div>

      <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium">
        {analysis.metaFrameworkConfidence}
      </span>
    </div>
  </div>

  {analysis.frameworkEvidence.length > 0 && (
    <div className="mt-3 rounded-lg border border-gray-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Framework evidence
      </p>

      <ul className="mt-2 space-y-1 text-xs text-gray-600">
        {analysis.frameworkEvidence.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )}

  {analysis.metaFrameworkEvidence.length > 0 && (
    <div className="mt-3 rounded-lg border border-gray-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Meta-framework evidence
      </p>

      <ul className="mt-2 space-y-1 text-xs text-gray-600">
        {analysis.metaFrameworkEvidence.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )}
  {analysis.platformEvidence.length > 0 && (
  <div className="mt-3 rounded-lg border border-gray-200 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      Platform evidence
    </p>

    <ul className="mt-2 space-y-1 text-xs text-gray-600">
      {analysis.platformEvidence.map((item) => (
        <li key={item}>• {item}</li>
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