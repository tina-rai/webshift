import type {
  AnalyzePageMessage,
  AnalyzePageResponse,
  PageAnalysis,
  TechnologyDiagnostics,
  ToggleAmoledMessage,
  GetAmoledStateMessage,
} from '../shared/messages'

interface DetectionResult {
  name: string
  confidence: string
  evidence: string[]
}

function detectFramework(): DetectionResult {
  const scores = {
    React: 0,
    Angular: 0,
    Vue: 0,
    Svelte: 0,
  }

  const evidence = {
    React: [] as string[],
    Angular: [] as string[],
    Vue: [] as string[],
    Svelte: [] as string[],
  }

  // React DOM fingerprints
  const reactElements = Array.from(document.querySelectorAll('*')).filter(
    (element) =>
      Object.keys(element).some(
        (key) =>
          key.startsWith('__reactFiber$') ||
          key.startsWith('__reactProps$')
      )
  )

  if (reactElements.length > 0) {
    scores.React += 3
    evidence.React.push('React internal DOM properties detected')
  }

  if (document.querySelector('[data-reactroot]')) {
    scores.React += 3
    evidence.React.push('React root marker detected')
  }
  if (document.querySelector('[data-react-profiling]')) {
    scores.React += 3
    evidence.React.push('React profiling attribute detected')
  }

  // Angular fingerprints
  if (document.querySelector('[ng-version]')) {
    scores.Angular += 3
    evidence.Angular.push('Angular version marker detected')
  }

  if (
    document.querySelector('[_nghost]') ||
    document.querySelector('[_ngcontent]')
  ) {
    scores.Angular += 2
    evidence.Angular.push('Angular DOM attributes detected')
  }

// Vue fingerprints
if (document.querySelector('[data-v-app]')) {
  scores.Vue += 3
  evidence.Vue.push('Vue application marker detected')
}

if (
  Array.from(document.querySelectorAll('*')).some((element) =>
    Object.keys(element).some((key) => key.startsWith('__vue'))
  )
) {
  scores.Vue += 3
  evidence.Vue.push('Vue internal DOM property detected')
}
const hasVueGeneratedAttribute = Array.from(
  document.querySelectorAll('*')
).some((element) =>
  Array.from(element.attributes).some((attribute) =>
    attribute.name.startsWith('data-v-')
  )
)

if (hasVueGeneratedAttribute) {
  scores.Vue += 2
  evidence.Vue.push('Vue-generated data attribute detected')
}


  // Svelte fingerprints
  const svelteElement = document.querySelector('[class*="svelte-"]')

  if (svelteElement) {
    scores.Svelte += 2
    evidence.Svelte.push('Svelte-generated class detected')
  }

  const detectedFramework = Object.entries(scores).sort(
    ([, scoreA], [, scoreB]) => scoreB - scoreA
  )[0]

  const [name, score] = detectedFramework

  if (score === 0) {
    return {
      name: 'Not detected',
      confidence: 'None',
      evidence: [],
    }
  }

  const confidence =
    score >= 5
      ? 'High'
      : score >= 3
        ? 'Medium'
        : 'Low'

  return {
    name,
    confidence,
    evidence: evidence[name as keyof typeof evidence],
  }
}

function detectMetaFramework(): DetectionResult {
  const evidence: string[] = []

  // Next.js
  if (
    document.querySelector('#__next') ||
    document.querySelector('script[src*="/_next/"]') ||
    document.querySelector('script[src*="_next/"]')
  ) {
    evidence.push('Next.js DOM or asset marker detected')

    return {
      name: 'Next.js',
      confidence: 'High',
      evidence,
    }
  }

  // Nuxt
  if (
    document.querySelector('#__nuxt') ||
    document.querySelector('#__NUXT__') ||
    document.querySelector('script[src*="/_nuxt/"]')
  ) {
    evidence.push('Nuxt DOM or asset marker detected')

    return {
      name: 'Nuxt',
      confidence: 'High',
      evidence,
    }
  }

  return {
    name: 'Not detected',
    confidence: 'None',
    evidence: [],
  }
}  
function collectTechnologyDiagnostics(): TechnologyDiagnostics {
  const scriptSources = Array.from(document.scripts)
    .map((script) => script.src)
    .filter(Boolean)

  const suspiciousScriptSources = scriptSources.filter((src) => {
    const lowerSrc = src.toLowerCase()

    return (
      lowerSrc.includes('/_next/') ||
      lowerSrc.includes('/_nuxt/') ||
      lowerSrc.includes('/svelte/') ||
      lowerSrc.includes('/angular/') ||
      lowerSrc.includes('/vue/')
    )
  })

  const frameworkPatterns = [
    'react',
    'next',
    'nuxt',
    'vue',
    'angular',
    'svelte',
  ]

  const suspiciousIds = Array.from(document.querySelectorAll('[id]'))
    .map((element) => element.id)
    .filter((id) => {
      const lowerId = id.toLowerCase()

      return frameworkPatterns.some((pattern) =>
        lowerId.includes(pattern)
      )
    })

  const suspiciousClasses = Array.from(
    document.querySelectorAll('[class]')
  )
    .flatMap((element) => Array.from(element.classList))
    .filter((className) => {
      const lowerClass = className.toLowerCase()

      return (
        lowerClass.includes('svelte') ||
        lowerClass.includes('vue') ||
        lowerClass.includes('react') ||
        lowerClass.includes('angular')
      )
    })
    .filter(
      (className, index, array) =>
        array.indexOf(className) === index
    )

  const suspiciousAttributes = Array.from(
    document.querySelectorAll('*')
  )
    .flatMap((element) => Array.from(element.attributes))
    .map((attribute) => attribute.name)
    .filter((attributeName) => {
      const lowerAttribute = attributeName.toLowerCase()

      return (
        lowerAttribute.startsWith('data-react') ||
        lowerAttribute.startsWith('data-v-') ||
        lowerAttribute.startsWith('ng-') ||
        lowerAttribute.startsWith('_ng') ||
        lowerAttribute.includes('svelte')
      )
    })
    .filter(
      (attributeName, index, array) =>
        array.indexOf(attributeName) === index
    )

  const frameworkProperties = Array.from(
    document.querySelectorAll('*')
  )
    .flatMap((element) =>
      Object.keys(element).filter(
        (key) =>
          key.startsWith('__react') ||
          key.startsWith('__vue') ||
          key.startsWith('__ng')
      )
    )
    .filter(
      (property, index, array) =>
        array.indexOf(property) === index
    )

  const metaHints = Array.from(
    document.querySelectorAll('meta')
  )
    .map((meta) => {
      const name = meta.getAttribute('name')
      const property = meta.getAttribute('property')
      const content = meta.getAttribute('content')

      return `${name ?? property ?? ''}: ${content ?? ''}`
    })
    .filter((value) => {
      const lowerValue = value.toLowerCase()

      return frameworkPatterns.some((pattern) =>
        lowerValue.includes(pattern)
      )
    })

  return {
    scriptSources,
    suspiciousScriptSources,
    suspiciousIds,
    suspiciousClasses,
    suspiciousAttributes,
    frameworkProperties,
    metaHints,
  }
}

function analyzePage(): PageAnalysis {
    const frameworkDetection = detectFramework()
    const metaFrameworkDetection = detectMetaFramework()
    const diagnostics = collectTechnologyDiagnostics()
  
    const images = document.images
  
    return {
      title: document.title,
      url: window.location.href,
  
      domNodes: document.querySelectorAll('*').length,
      images: images.length,
      links: document.links.length,
      scripts: document.scripts.length,
  
      framework: frameworkDetection.name,
      frameworkConfidence: frameworkDetection.confidence,
      frameworkEvidence: frameworkDetection.evidence,
  
      metaFramework: metaFrameworkDetection.name,
      metaFrameworkConfidence: metaFrameworkDetection.confidence,
      metaFrameworkEvidence: metaFrameworkDetection.evidence,
  
      headings: document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      ).length,
  
      buttons: document.querySelectorAll('button').length,
      forms: document.forms.length,
      inputs: document.querySelectorAll(
        'input, textarea, select'
      ).length,
  
      externalLinks: Array.from(document.links).filter(
        (link) => link.origin !== window.location.origin
      ).length,
  
      imagesWithoutAlt: Array.from(images).filter(
        (image) => !image.hasAttribute('alt')
      ).length,
  
      diagnostics,
    }
  }
  let amoledEnabled = false

  function toggleAmoled(enabled: boolean) {
    const styleId = 'webshift-amoled'
  
    const existingStyle = document.getElementById(styleId)
  
    if (!enabled) {
      existingStyle?.remove()
      amoledEnabled = false
      return
    }
  
    if (existingStyle) {
      amoledEnabled = true
      return
    }
  
    const style = document.createElement('style')
  
    style.id = styleId
  
    style.textContent = `
    html {
      background: #000 !important;
    }
  
    body {
      background: #000 !important;
      color: #fff !important;
    }
  
    body,
    main,
    section,
    article,
    aside,
    header,
    footer,
    nav {
      background-color: #000 !important;
      color: #fff !important;
    }
  
    [role="dialog"],
    [role="menu"],
    [role="tooltip"],
    [role="listbox"] {
      background-color: #0a0a0a !important;
      color: #fff !important;
    }
  
    a {
      color: #66b3ff !important;
    }
  
    button,
    input,
    textarea,
    select {
      background-color: #111 !important;
      color: #fff !important;
      border-color: #333 !important;
    }
  
    ::placeholder {
      color: #888 !important;
    }
  `
  
    document.head.appendChild(style)
  
    amoledEnabled = true
  }
  chrome.runtime.onMessage.addListener(
    (
      message:
        | AnalyzePageMessage
        | ToggleAmoledMessage
        | GetAmoledStateMessage,
      _sender,
      sendResponse
    ) => {
      if (message.type === 'ANALYZE_PAGE') {
        const response: AnalyzePageResponse = {
          type: 'PAGE_ANALYSIS',
          data: analyzePage(),
        }
  
        sendResponse(response)
  
        return
      }
  
      if (message.type === 'TOGGLE_AMOLED') {
        toggleAmoled(message.enabled)
        return
      }
  
      if (message.type === 'GET_AMOLED_STATE') {
        sendResponse({
          type: 'AMOLED_STATE',
          enabled: amoledEnabled,
        })
      }
    }
  )