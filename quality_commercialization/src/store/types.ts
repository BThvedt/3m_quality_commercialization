export type RoleName =
  | "quality"
  | "marketing"
  | "manufacturing"
  | "legal"
  | "lab"
  | "product"

export type QuestionResult = {
  correct: boolean
  id: number
  feedback: {
    title: string
    text: string
  }
}

export interface RootState {
  initialized: boolean
  errorConnecting: boolean | undefined
  isDev: boolean
  builtWithoutLms: boolean
  noLms: boolean | undefined
  muted: boolean
  volume: number
  commercializationPhaseIndex: number
  commercializeQResults: Record<RoleName, (QuestionResult | null)[][]>
  commercializeAResults: Record<RoleName, (boolean | null)[][]>

  badgesShowing: boolean[]
}
