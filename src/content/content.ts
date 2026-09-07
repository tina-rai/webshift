import type {
  AnalyzePageMessage,
  AnalyzePageResponse,
  PageAnalysis,
} from '../shared/messages'

function detectFramework(): string {
  if (document.querySelector('[data-reactroot]')) {
    return 'React'
  }

  if (document.querySelector('[ng-version]')) {
    return 'Angular'
  }

  if (document.querySelector('[data-v-app]')) {
    return 'Vue'
  }

  return 'Unknown'
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