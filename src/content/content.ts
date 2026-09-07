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

chrome.runtime.onMessage.addListener(
  (
    message: AnalyzePageMessage,
    _sender,
    sendResponse: (response: AnalyzePageResponse) => void
  ) => {
    if (message.type !== 'ANALYZE_PAGE') {
      return
    }

    const analysis: PageAnalysis = {
      title: document.title,
      url: window.location.href,
      domNodes: document.querySelectorAll('*').length,
      images: document.images.length,
      links: document.links.length,
      scripts: document.scripts.length,
      framework: detectFramework(),
    }

    sendResponse({
      type: 'PAGE_ANALYSIS',
      data: analysis,
    })
  }
)