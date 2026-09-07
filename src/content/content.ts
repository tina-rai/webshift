import type {
  AnalyzePageMessage,
  AnalyzePageResponse,
  PageAnalysis,
} from '../shared/messages'

function detectFramework(): string {
  // React
  if (
    document.querySelector('[data-reactroot]') ||
    document.querySelector('[data-react-helmet]') ||
    document.querySelector('[id^="__next"]') ||
    document.querySelector('script[src*="react"]')
  ) {
    return 'React'
  }

  // Angular
  if (
    document.querySelector('[ng-version]') ||
    document.querySelector('[_nghost]') ||
    document.querySelector('[_ngcontent]')
  ) {
    return 'Angular'
  }

  // Vue
  if (
    document.querySelector('[data-v-app]') ||
    document.querySelector('[data-vue-meta]')
  ) {
    return 'Vue'
  }

  // Svelte
  if (
    document.querySelector('[class*="svelte-"]') ||
    document.querySelector('[data-svelte]')
  ) {
    return 'Svelte'
  }

  return 'Unknown'
}
function detectMetaFramework(): string {
  // Next.js
  if (
    document.querySelector('#__next') ||
    document.querySelector('script[src*="_next/"]')
  ) {
    return 'Next.js'
  }

  // Nuxt
  if (
    document.querySelector('#__nuxt') ||
    document.querySelector('#__NUXT__')
  ) {
    return 'Nuxt'
  }

  return 'None detected'
}
function analyzePage(): PageAnalysis {
  const images = document.images

  const imagesWithoutAlt = Array.from(images).filter(
    (image) => !image.hasAttribute('alt')
  ).length

  const externalLinks = Array.from(document.links).filter(
    (link) => link.origin !== window.location.origin
  ).length

  return {
    title: document.title,
    url: window.location.href,

    domNodes: document.querySelectorAll('*').length,
    images: images.length,
    links: document.links.length,
    scripts: document.scripts.length,

    framework: detectFramework(),
    metaFramework: detectMetaFramework(),
    headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
    buttons: document.querySelectorAll('button').length,
    forms: document.forms.length,
    inputs: document.querySelectorAll('input, textarea, select').length,

    externalLinks,

    imagesWithoutAlt,
  }
}

chrome.runtime.onMessage.addListener(
  (
    message: AnalyzePageMessage,
    _sender,
    sendResponse: (response: AnalyzePageResponse) => void
  ) => {
    if (message.type !== 'ANALYZE_PAGE') {
      return
    }

    sendResponse({
      type: 'PAGE_ANALYSIS',
      data: analyzePage(),
    })
  }
)