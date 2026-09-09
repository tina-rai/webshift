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
export interface ToggleDarkMessage {
  type: 'TOGGLE_DARK'
  enabled: boolean
}

export interface GetDarkStateMessage {
  type: 'GET_DARK_STATE'
}

export interface DarkStateResponse {
  type: 'DARK_STATE'
  enabled: boolean
}

export interface SetFontMessage {
  type: 'SET_FONT'
  font: string
}

export interface SetTextSizeMessage {
  type: 'SET_TEXT_SIZE'
  size: number
}
export interface ToggleWideContentMessage {

  type: 'TOGGLE_WIDE_CONTENT'

  enabled: boolean

}
export interface GetWideContentStateMessage {

  type: 'GET_WIDE_CONTENT_STATE'

}

export interface WideContentStateResponse {

  type: 'WIDE_CONTENT_STATE'

  enabled: boolean

}
export interface ToggleSidebarMessage {

  type: 'TOGGLE_SIDEBAR'

  enabled: boolean

}

export interface GetSidebarStateMessage {

  type: 'GET_SIDEBAR_STATE'

}

export interface SidebarStateResponse {

  type: 'SIDEBAR_STATE'

  enabled: boolean

}

export interface ToggleDistractionsMessage {

  type: 'TOGGLE_DISTRACTIONS'

  enabled: boolean

}

export interface GetDistractionsStateMessage {

  type: 'GET_DISTRACTIONS_STATE'

}

export interface DistractionsStateResponse {

  type: 'DISTRACTIONS_STATE'

  enabled: boolean

}