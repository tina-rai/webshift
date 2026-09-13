import type {
  AnalyzePageMessage,
  AnalyzePageResponse,
  PageAnalysis,
  TechnologyDiagnostics,
  ToggleAmoledMessage,
  GetAmoledStateMessage,
  AmoledStateResponse,
  ToggleDarkMessage,
  GetDarkStateMessage,
  DarkStateResponse,
  SetFontMessage,
  SetTextSizeMessage,
  ToggleWideContentMessage,
  GetWideContentStateMessage,
WideContentStateResponse,
ToggleSidebarMessage,
GetSidebarStateMessage,
SidebarStateResponse,
ToggleAdsMessage,
GetAdsStateMessage,
AdsStateResponse,
WebShiftSettings,

} from '../shared/messages'

interface DetectionResult {
  name: string
  confidence: string
  evidence: string[]
}
function detectFramework(): DetectionResult {
  const technologies = {
    React: { score: 0, evidence: [] as string[] },
    Vue: { score: 0, evidence: [] as string[] },
    Angular: { score: 0, evidence: [] as string[] },
    Svelte: { score: 0, evidence: [] as string[] },
    Solid: { score: 0, evidence: [] as string[] },
    Preact: { score: 0, evidence: [] as string[] },
    'Alpine.js': { score: 0, evidence: [] as string[] },
    Lit: { score: 0, evidence: [] as string[] },
    Ember: { score: 0, evidence: [] as string[] },
    jQuery: { score: 0, evidence: [] as string[] },
  }

  const addEvidence = (
    framework: keyof typeof technologies,
    score: number,
    message: string
  ) => {
    technologies[framework].score += score
    technologies[framework].evidence.push(message)
  }

  const elements = Array.from(document.querySelectorAll('*'))

  /*
   * --------------------------------------------------
   * React
   * --------------------------------------------------
   */

  const reactInternalElements = elements.filter((element) =>
    Object.keys(element).some(
      (key) =>
        key.startsWith('__reactFiber$') ||
        key.startsWith('__reactProps$')
    )
  )

  if (reactInternalElements.length > 0) {
    addEvidence(
      'React',
      4,
      'React internal DOM properties detected'
    )
  }

  if (document.querySelector('[data-reactroot]')) {
    addEvidence(
      'React',
      3,
      'React root marker detected'
    )
  }

  if (document.querySelector('[data-react-profiling]')) {
    addEvidence(
      'React',
      3,
      'React profiling attribute detected'
    )
  }

  /*
   * --------------------------------------------------
   * Vue
   * --------------------------------------------------
   */

  if (document.querySelector('[data-v-app]')) {
    addEvidence(
      'Vue',
      4,
      'Vue application marker detected'
    )
  }

  const vueInternalElements = elements.filter((element) =>
    Object.keys(element).some((key) =>
      key.startsWith('__vue')
    )
  )

  if (vueInternalElements.length > 0) {
    addEvidence(
      'Vue',
      4,
      'Vue internal DOM property detected'
    )
  }

  const vueGeneratedAttributes = elements.some((element) =>
    Array.from(element.attributes).some((attribute) =>
      attribute.name.startsWith('data-v-')
    )
  )

  if (vueGeneratedAttributes) {
    addEvidence(
      'Vue',
      2,
      'Vue-generated data attribute detected'
    )
  }

  /*
   * --------------------------------------------------
   * Angular
   * --------------------------------------------------
   */

  if (document.querySelector('[ng-version]')) {
    addEvidence(
      'Angular',
      4,
      'Angular version marker detected'
    )
  }

  const angularAttributes = elements.some((element) =>
    Array.from(element.attributes).some(
      (attribute) =>
        attribute.name.startsWith('_ng') ||
        attribute.name.startsWith('ng-')
    )
  )

  if (angularAttributes) {
    addEvidence(
      'Angular',
      3,
      'Angular DOM attributes detected'
    )
  }

  /*
   * --------------------------------------------------
   * Svelte
   * --------------------------------------------------
   */

  if (document.querySelector('[class*="svelte-"]')) {
    addEvidence(
      'Svelte',
      3,
      'Svelte-generated class detected'
    )
  }

  /*
   * --------------------------------------------------
   * Solid
   * --------------------------------------------------
   */

  const solidMarkers = elements.some((element) =>
    Object.keys(element).some(
      (key) =>
        key.startsWith('_$') ||
        key.startsWith('__solid')
    )
  )

  if (solidMarkers) {
    addEvidence(
      'Solid',
      4,
      'Solid.js internal DOM markers detected'
    )
  }

  /*
   * --------------------------------------------------
   * Preact
   * --------------------------------------------------
   */

  const preactMarkers = elements.some((element) =>
    Object.keys(element).some(
      (key) =>
        key.startsWith('__k') ||
        key.startsWith('__v')
    )
  )

  if (preactMarkers) {
    addEvidence(
      'Preact',
      3,
      'Preact internal DOM properties detected'
    )
  }

  /*
   * --------------------------------------------------
   * Alpine.js
   * --------------------------------------------------
   */

  const alpineAttributes = elements.some((element) =>
    Array.from(element.attributes).some((attribute) => {
      const name = attribute.name.toLowerCase()

      return (
        name.startsWith('x-') ||
        name.startsWith('x:')
      )
    })
  )

  if (alpineAttributes) {
    addEvidence(
      'Alpine.js',
      3,
      'Alpine.js directives detected'
    )
  }

  /*
   * --------------------------------------------------
   * Lit
   * --------------------------------------------------
   */

  const customElements = Array.from(
    document.querySelectorAll('*')
  ).some((element) =>
    element.tagName.includes('-')
  )

  if (customElements) {
    addEvidence(
      'Lit',
      1,
      'Custom elements detected'
    )
  }

  /*
   * --------------------------------------------------
   * Ember
   * --------------------------------------------------
   */

  if (
    document.querySelector(
      '[id^="ember"], [class*="ember"]'
    )
  ) {
    addEvidence(
      'Ember',
      2,
      'Ember-related DOM markers detected'
    )
  }

  /*
   * --------------------------------------------------
   * jQuery
   * --------------------------------------------------
   */

  const globalWindow = window as unknown as {
    jQuery?: unknown
    $?: unknown
  }

  if (globalWindow.jQuery) {
    addEvidence(
      'jQuery',
      5,
      'jQuery global object detected'
    )
  }

  /*
   * --------------------------------------------------
   * Script/resource signals
   * --------------------------------------------------
   */

  const scripts = Array.from(document.scripts)
    .map((script) => script.src.toLowerCase())
    .filter(Boolean)

  const scriptText = scripts.join(' ')

  if (scriptText.includes('react')) {
    addEvidence(
      'React',
      2,
      'React-related script resource detected'
    )
  }

  if (scriptText.includes('vue')) {
    addEvidence(
      'Vue',
      2,
      'Vue-related script resource detected'
    )
  }

  if (scriptText.includes('angular')) {
    addEvidence(
      'Angular',
      2,
      'Angular-related script resource detected'
    )
  }

  if (scriptText.includes('svelte')) {
    addEvidence(
      'Svelte',
      2,
      'Svelte-related script resource detected'
    )
  }

  if (scriptText.includes('preact')) {
    addEvidence(
      'Preact',
      2,
      'Preact-related script resource detected'
    )
  }

  if (scriptText.includes('solid')) {
    addEvidence(
      'Solid',
      2,
      'Solid-related script resource detected'
    )
  }

  /*
   * --------------------------------------------------
   * Select strongest framework
   * --------------------------------------------------
   */

  const detected = Object.entries(technologies)
    .sort(([, a], [, b]) => b.score - a.score)[0]

  const [name, result] = detected

  if (result.score < 3) {
    return {
      name: 'Not detected',
      confidence: 'None',
      evidence: [],
    }
  }

  const confidence =
    result.score >= 7
      ? 'High'
      : result.score >= 4
        ? 'Medium'
        : 'Low'

  return {
    name,
    confidence,
    evidence: result.evidence,
  }
}
function detectPlatform(): DetectionResult {
  const platforms = {
    MediaWiki: { score: 0, evidence: [] as string[] },
    WordPress: { score: 0, evidence: [] as string[] },
    Drupal: { score: 0, evidence: [] as string[] },
  }

  const addEvidence = (
    platform: keyof typeof platforms,
    score: number,
    message: string
  ) => {
    platforms[platform].score += score
    platforms[platform].evidence.push(message)
  }

  /*
   * MediaWiki
   */

  if (
    document.querySelector(
      'meta[name="generator"][content*="MediaWiki"]'
    )
  ) {
    addEvidence(
      'MediaWiki',
      5,
      'MediaWiki generator metadata detected'
    )
  }

  if (
    document.querySelector(
      '#mw-page-base, #mw-head, #content.mw-body'
    )
  ) {
    addEvidence(
      'MediaWiki',
      4,
      'MediaWiki page structure detected'
    )
  }

  if (
    document.querySelector(
      'link[href*="load.php"]'
    )
  ) {
    addEvidence(
      'MediaWiki',
      2,
      'MediaWiki resource loader detected'
    )
  }

  /*
   * WordPress
   */

  if (
    document.querySelector(
      'meta[name="generator"][content*="WordPress"]'
    )
  ) {
    addEvidence(
      'WordPress',
      5,
      'WordPress generator metadata detected'
    )
  }

  if (
    document.querySelector(
      'link[href*="/wp-content/"], script[src*="/wp-content/"]'
    )
  ) {
    addEvidence(
      'WordPress',
      4,
      'WordPress content directory detected'
    )
  }

  if (
    document.querySelector(
      'link[href*="/wp-includes/"], script[src*="/wp-includes/"]'
    )
  ) {
    addEvidence(
      'WordPress',
      3,
      'WordPress includes directory detected'
    )
  }

  /*
   * Drupal
   */

  if (
    document.querySelector(
      'meta[name="Generator"][content*="Drupal"], meta[name="generator"][content*="Drupal"]'
    )
  ) {
    addEvidence(
      'Drupal',
      5,
      'Drupal generator metadata detected'
    )
  }

  if (
    document.querySelector(
      '[class*="drupal"], [id*="drupal"]'
    )
  ) {
    addEvidence(
      'Drupal',
      2,
      'Drupal-related DOM marker detected'
    )
  }

  /*
   * Select strongest platform
   */

  const detected = Object.entries(platforms)
    .sort(([, a], [, b]) => b.score - a.score)[0]

  const [name, result] = detected

  if (result.score < 3) {
    return {
      name: 'Not detected',
      confidence: 'None',
      evidence: [],
    }
  }

  const confidence =
    result.score >= 7
      ? 'High'
      : result.score >= 4
        ? 'Medium'
        : 'Low'

  return {
    name,
    confidence,
    evidence: result.evidence,
  }
}

function detectMetaFramework(): DetectionResult {
  const frameworks = {
    'Next.js': { score: 0, evidence: [] as string[] },
    Nuxt: { score: 0, evidence: [] as string[] },
    SvelteKit: { score: 0, evidence: [] as string[] },
    Astro: { score: 0, evidence: [] as string[] },
    Remix: { score: 0, evidence: [] as string[] },
    Gatsby: { score: 0, evidence: [] as string[] },
  }

  const addEvidence = (
    framework: keyof typeof frameworks,
    score: number,
    message: string
  ) => {
    frameworks[framework].score += score
    frameworks[framework].evidence.push(message)
  }

  const scripts = Array.from(document.scripts)
    .map((script) => script.src.toLowerCase())
    .filter(Boolean)

  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link')
  )
    .map((link) => link.href.toLowerCase())
    .filter(Boolean)

  const resources = [...scripts, ...links].join(' ')

  /*
   * Next.js
   */

  if (document.querySelector('#__next')) {
    addEvidence(
      'Next.js',
      5,
      'Next.js root element detected'
    )
  }

  if (resources.includes('/_next/')) {
    addEvidence(
      'Next.js',
      5,
      'Next.js assets detected'
    )
  }

  if (
    document.querySelector(
      'script#__NEXT_DATA__'
    )
  ) {
    addEvidence(
      'Next.js',
      5,
      'Next.js data script detected'
    )
  }

  /*
   * Nuxt
   */

  if (
    document.querySelector(
      '#__nuxt, #__NUXT__'
    )
  ) {
    addEvidence(
      'Nuxt',
      5,
      'Nuxt root element detected'
    )
  }

  if (resources.includes('/_nuxt/')) {
    addEvidence(
      'Nuxt',
      5,
      'Nuxt assets detected'
    )
  }

  /*
   * SvelteKit
   */

  if (
    document.querySelector(
      '[data-sveltekit-preload-data]'
    )
  ) {
    addEvidence(
      'SvelteKit',
      5,
      'SvelteKit preload marker detected'
    )
  }

  if (resources.includes('/_app/')) {
    addEvidence(
      'SvelteKit',
      1,
      'SvelteKit-style application assets detected'
    )
  }

  /*
   * Astro
   */

  if (
    document.querySelector(
      '[data-astro-cid]'
    )
  ) {
    addEvidence(
      'Astro',
      5,
      'Astro component marker detected'
    )
  }

  if (
    document.querySelector(
      'astro-island'
    )
  ) {
    addEvidence(
      'Astro',
      5,
      'Astro island detected'
    )
  }

  /*
   * Remix
   */

  if (
    document.querySelector(
      '#__remixContext'
    )
  ) {
    addEvidence(
      'Remix',
      5,
      'Remix runtime context detected'
    )
  }

  /*
   * Gatsby
   */

  if (
    document.querySelector(
      '#___gatsby'
    )
  ) {
    addEvidence(
      'Gatsby',
      5,
      'Gatsby root element detected'
    )
  }

  const detected = Object.entries(frameworks)
    .sort(([, a], [, b]) => b.score - a.score)[0]

  const [name, result] = detected

  if (result.score < 3) {
    return {
      name: 'Not detected',
      confidence: 'None',
      evidence: [],
    }
  }

  const confidence =
    result.score >= 7
      ? 'High'
      : result.score >= 4
        ? 'Medium'
        : 'Low'

  return {
    name,
    confidence,
    evidence: result.evidence,
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
  const platformDetection = detectPlatform()
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
  
      platform: platformDetection.name,
      platformConfidence: platformDetection.confidence,
      platformEvidence: platformDetection.evidence,
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
  let darkEnabled = false
  let wideContentEnabled = false
  let sidebarEnabled = false
  let adsEnabled = false
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
      color-scheme: dark !important;
    }
  
    body {
      background: #000 !important;
      color: #fff !important;
    }
  
    body * {
      border-color: #333 !important;
    }
  
    body *:not(img):not(video):not(svg):not(canvas):not(iframe) {
      background-color: #000 !important;
      color: #fff !important;
    }
  
    body a {
      color: #66b3ff !important;
    }
  
    body input,
    body textarea,
    body select,
    body button {
      background-color: #111 !important;
      color: #fff !important;
      border-color: #444 !important;
    }
  
    img,
    video,
    canvas,
    iframe,
    svg {
      background-color: transparent !important;
    }
  
    ::placeholder {
      color: #888 !important;
    }
  `
  
    document.head.appendChild(style)
  
    amoledEnabled = true
  }
  function toggleDark(enabled: boolean) {
    const styleId = 'webshift-dark'
  
    const existingStyle = document.getElementById(styleId)
  
    if (!enabled) {
      existingStyle?.remove()
      darkEnabled = false
      return
    }
  
    if (existingStyle) {
      darkEnabled = true
      return
    }
  
    const style = document.createElement('style')
  
    style.id = styleId
  
    style.textContent = `
  html {
    background: #121212 !important;
    color-scheme: dark !important;
  }

  body {
    background: #121212 !important;
    color: #e8e8e8 !important;
  }

  body * {
    border-color: #3a3a3a !important;
  }

  body *:not(img):not(video):not(svg):not(canvas):not(iframe) {
    background-color: #1e1e1e !important;
    color: #e8e8e8 !important;
  }

  body a {
    color: #8ab4f8 !important;
  }

  body input,
  body textarea,
  body select,
  body button {
    background-color: #2a2a2a !important;
    color: #f5f5f5 !important;
    border-color: #555 !important;
  }

  img,
  video,
  canvas,
  iframe,
  svg {
    background-color: transparent !important;
  }

  ::placeholder {
    color: #999 !important;
  }
`
  
    document.head.appendChild(style)
  
    darkEnabled = true
  }
  function setFont(font: string) {
    const styleId = 'webshift-font'
  
    let style = document.getElementById(styleId) as HTMLStyleElement | null
  
    if (!style) {
      style = document.createElement('style')
  
      style.id = styleId
  
      document.head.appendChild(style)
    }
  
    style.textContent = `
      html,
      body,
      body * {
        font-family: ${font} !important;
      }
    `
  }
  function setTextSize(size: number) {
    const styleId = 'webshift-text-size'
  
    let style = document.getElementById(styleId) as HTMLStyleElement | null
  
    if (!style) {
      style = document.createElement('style')
  
      style.id = styleId
  
      document.head.appendChild(style)
    }
  
    style.textContent = `
      html {
        font-size: ${size}px !important;
      }
  
      body {
        font-size: ${size}px !important;
      }
    `
  }
  function toggleWideContent(enabled: boolean) {
    const styleId = 'webshift-wide-content'
    const targetClass = 'webshift-wide-target'
  
    const existingStyle = document.getElementById(styleId)
  
    document
      .querySelectorAll(`.${targetClass}`)
      .forEach((element) => {
        element.classList.remove(targetClass)
      })
  
    if (!enabled) {
      existingStyle?.remove()
      wideContentEnabled = false
      return
    }
  
    if (existingStyle) {
      wideContentEnabled = true
      return
    }
  
    const viewportWidth = window.innerWidth
  
    const candidates = Array.from(
      document.querySelectorAll('main, article, section, div')
    )
  
    let bestCandidate: HTMLElement | null = null
    let bestScore = 0
  
    for (const element of candidates) {
      const htmlElement = element as HTMLElement
      const rect = htmlElement.getBoundingClientRect()
  
      if (
        rect.width < 400 ||
        rect.width > viewportWidth * 0.95 ||
        rect.height < 200
      ) {
        continue
      }
  
      const style = window.getComputedStyle(htmlElement)
  
      if (
        style.display === 'none' ||
        style.visibility === 'hidden'
      ) {
        continue
      }
  
      const textLength =
        htmlElement.innerText?.trim().length ?? 0
  
      if (textLength < 200) {
        continue
      }
  
      let score = 0
  
      // Prefer semantic content elements
      const tagName = htmlElement.tagName.toLowerCase()
  
      if (tagName === 'main') {
        score += 5
      }
  
      if (tagName === 'article') {
        score += 5
      }
  
      // Prefer elements that contain headings
      if (
        htmlElement.querySelector(
          'h1, h2, h3'
        )
      ) {
        score += 3
      }
  
      // Prefer content-rich elements
      if (
        htmlElement.querySelector(
          'p'
        )
      ) {
        score += 2
      }
  
      // Prefer elements that are noticeably narrower
      // than the viewport
      const widthRatio = rect.width / viewportWidth
  
      if (widthRatio < 0.75) {
        score += 4
      } else if (widthRatio < 0.85) {
        score += 2
      }
  
      // Penalize tiny containers
      if (rect.width < 500) {
        score -= 2
      }
  
      if (score > bestScore) {
        bestScore = score
        bestCandidate = htmlElement
      }
    }
  
    if (!bestCandidate) {
      return
    }
  
    bestCandidate.classList.add(targetClass)
  
    const style = document.createElement('style')
  
    style.id = styleId
  
    style.textContent = `
      .${targetClass} {
        width: 95vw !important;
        max-width: 1400px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    `
  
    document.head.appendChild(style)
    wideContentEnabled = true
  }
  function toggleSidebar(enabled: boolean) {
    const styleId = 'webshift-hide-sidebar'
    const className = 'webshift-sidebar-hidden'
  
    const existingStyle = document.getElementById(styleId)
  
    if (!enabled) {
      existingStyle?.remove()
  
      document
        .querySelectorAll(`.${className}`)
        .forEach((el) => el.classList.remove(className))
  
      return
    }
  
    // Remove any previous target before detecting again
    document
      .querySelectorAll(`.${className}`)
      .forEach((el) => el.classList.remove(className))
  
      const candidates = Array.from(
        document.querySelectorAll(
          'aside, nav, [role="complementary"], [role="navigation"]'
        )
      )
  
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
  
    let bestCandidate: HTMLElement | null = null
    let bestScore = 0
  
    for (const element of candidates) {
      const el = element as HTMLElement
  
      if (!el.offsetParent) continue

      const rect = el.getBoundingClientRect()
  
      const width = rect.width
      const height = rect.height
  
      if (width < 120 || width > viewportWidth * 0.4) continue
if (height < 180) continue
  
      const text = el.innerText?.trim() || ''
      const links = el.querySelectorAll('a').length
      const lists = el.querySelectorAll('ul, ol').length

      console.log(
        'WebShift sidebar candidate:',
        {
          tag: el.tagName,
          id: el.id,
          className: el.className,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          links,
          lists
        }
      )
  
      if (text.length < 50 && links < 3 && lists < 1) continue  
      
      let score = 0
  
      const tag = el.tagName.toLowerCase()
      const id = el.id.toLowerCase()
      const className = el.className.toString().toLowerCase()
  
      // Semantic clues
      if (tag === 'aside') score += 6
      if (tag === 'nav') score += 4
  
      if (
        el.getAttribute('role') === 'complementary'
      ) {
        score += 6
      }
  
      if (
        el.getAttribute('role') === 'navigation'
      ) {
        score += 4
      }
  
      // Naming clues
      if (
        id.includes('sidebar') ||
        className.includes('sidebar')
      ) {
        score += 5
      }
  
      if (
        id.includes('side-nav') ||
        className.includes('side-nav') ||
        id.includes('sidenav') ||
        className.includes('sidenav')
      ) {
        score += 5
      }
  
      // Link density
      if (links >= 5) score += 2
      if (links >= 10) score += 2

      // List structure
      if (lists >= 1) score += 2
      if (lists >= 3) score += 2
  
      // Narrow = more sidebar-like
      const widthRatio = width / viewportWidth
  
      if (widthRatio < 0.3) score += 3
      if (widthRatio < 0.2) score += 2
  
      // Position clues
      const distanceFromLeft = rect.left
      const distanceFromRight = viewportWidth - rect.right
  
      const nearLeft = distanceFromLeft < viewportWidth * 0.25
      const nearRight = distanceFromRight < viewportWidth * 0.25
  
      if (nearLeft || nearRight) {
        score += 3
      }
  
      // Tall side regions are more likely to be navigation/sidebar
      if (height > viewportHeight * 0.5) score += 2
      if (height > viewportHeight * 0.8) score += 2
  
      // Prefer elements that actually sit beside the page,
      // rather than small panels inside the article.
      if (rect.top < viewportHeight * 0.3) {
        score += 1
      }
  
      if (score > bestScore) {
        bestScore = score
        bestCandidate = el
      }
    }
    console.log(
      'WebShift sidebar winner:',
      bestCandidate,
      'score:',
      bestScore
    )
    if (!bestCandidate || bestScore < 7) {
      return
    }
    
    bestCandidate.classList.add(className)
    let style = document.getElementById(styleId) as HTMLStyleElement | null
  
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }
  
    style.textContent = `
      .${className} {
        display: none !important;
      }
    `
  }
  function toggleAds(enabled: boolean) {
    const styleId = 'webshift-hide-ads'
  
    const existingStyle = document.getElementById(styleId)
  
    if (!enabled) {
      existingStyle?.remove()
      adsEnabled = false
      return
    }
  
    if (existingStyle) {
      adsEnabled = true
      return
    }
  
    const adSelectors = [
      '[class*="ad-"]',
      '[class*="-ad"]',
      '[class*="ads-"]',
      '[class*="-ads"]',
      '[class*="advert"]',
      '[id*="advert"]',
      '[class*="sponsor"]',
      '[id*="sponsor"]',
      '[class*="promoted"]',
      '[id*="promoted"]',
      'iframe[src*="doubleclick"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="adservice"]',
    ]
  
    const style = document.createElement('style')
  
    style.id = styleId
  
    style.textContent = `
      ${adSelectors.join(',\n')} {
        display: none !important;
      }
    `
  
    document.head.appendChild(style)
  
    adsEnabled = true
  }
  chrome.storage.sync
  .get({
    amoledEnabled: false,
    darkEnabled: false,
    wideContentEnabled: false,
    sidebarHidden: false,
    adsHidden: false,

  })
  .then((stored) => {
    const settings = stored as unknown as WebShiftSettings

    toggleAmoled(settings.amoledEnabled)
    toggleDark(settings.darkEnabled)
    toggleWideContent(settings.wideContentEnabled)
    toggleSidebar(settings.sidebarHidden)
    toggleAds(settings.adsHidden)

  })
  .catch((error) => {
    console.error(
      'WebShift settings load error:',
      error
    )
  })
  chrome.runtime.onMessage.addListener(
    (
      message:
        | AnalyzePageMessage
        | ToggleAmoledMessage
        | GetAmoledStateMessage
        | ToggleDarkMessage
        | GetDarkStateMessage
        | SetFontMessage
        | SetTextSizeMessage
        | ToggleWideContentMessage
        | GetWideContentStateMessage
        | ToggleSidebarMessage
        | GetSidebarStateMessage
        | ToggleAdsMessage
        | GetAdsStateMessage,
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
        const response: AmoledStateResponse = {
          type: 'AMOLED_STATE',
          enabled: amoledEnabled,
        }
  
        sendResponse(response)
  
        return
      }
  
      if (message.type === 'TOGGLE_DARK') {
        toggleDark(message.enabled)
        return
      }
  
      if (message.type === 'GET_DARK_STATE') {
        const response: DarkStateResponse = {
          type: 'DARK_STATE',
          enabled: darkEnabled,
        }
  
        sendResponse(response)
  
        return
      }
  
      if (message.type === 'SET_FONT') {
        setFont(message.font)
        return
      }
  
      if (message.type === 'SET_TEXT_SIZE') {
        setTextSize(message.size)
      }
      if (message.type === 'TOGGLE_WIDE_CONTENT') {
        toggleWideContent(message.enabled)
      }
      if (message.type === 'GET_WIDE_CONTENT_STATE') {
        const response: WideContentStateResponse = {
          type: 'WIDE_CONTENT_STATE',
          enabled: wideContentEnabled,
        }
      
        sendResponse(response)
      
        return
      }
      if (message.type === 'TOGGLE_SIDEBAR') {
        toggleSidebar(message.enabled)
        return
      }
      if (message.type === 'GET_SIDEBAR_STATE') {
        const response: SidebarStateResponse = {
          type: 'SIDEBAR_STATE',
          enabled: sidebarEnabled,
        }
      
        sendResponse(response)
      
        return
      }
      if (message.type === 'TOGGLE_ADS') {
        toggleAds(message.enabled)
        return
      }
      
      if (message.type === 'GET_ADS_STATE') {
        const response: AdsStateResponse = {
          type: 'ADS_STATE',
          enabled: adsEnabled,
        }
      
        sendResponse(response)
      
        return
      }
      
    
      }
    
  )