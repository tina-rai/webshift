export interface PageAnalysis {
    title: string
    url: string
    domNodes: number
    images: number
    links: number
    scripts: number
    framework: string
    headings: number
    buttons: number
    forms: number
    inputs: number
    externalLinks: number
    imagesWithoutAlt: number
  }
  
  export interface AnalyzePageMessage {
    type: 'ANALYZE_PAGE'
  }
  
  export interface AnalyzePageResponse {
    type: 'PAGE_ANALYSIS'
    data: PageAnalysis
  }