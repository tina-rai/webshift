export interface TechnologyDiagnostics {
  scriptSources: string[]
  suspiciousScriptSources: string[]
  suspiciousIds: string[]
  suspiciousClasses: string[]
  suspiciousAttributes: string[]
  frameworkProperties: string[]
  metaHints: string[]
}

export interface PageAnalysis {
  title: string
  url: string

  domNodes: number
  images: number
  links: number
  scripts: number

  framework: string
  frameworkConfidence: string
  frameworkEvidence: string[]

  metaFramework: string
  metaFrameworkConfidence: string
  metaFrameworkEvidence: string[]

  headings: number
  buttons: number
  forms: number
  inputs: number
  externalLinks: number
  imagesWithoutAlt: number

  diagnostics: TechnologyDiagnostics
}

export interface AnalyzePageMessage {
  type: 'ANALYZE_PAGE'
}

export interface AnalyzePageResponse {
  type: 'PAGE_ANALYSIS'
  data: PageAnalysis
}
export interface ToggleAmoledMessage {
  type: 'TOGGLE_AMOLED'
  enabled: boolean
}

export interface GetAmoledStateMessage {
  type: 'GET_AMOLED_STATE'
}

export interface AmoledStateResponse {
  type: 'AMOLED_STATE'
  enabled: boolean
}