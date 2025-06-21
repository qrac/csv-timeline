export type Item = {
  name: string
  year: number
  timestamp: number
  tags: string[]
  visible: boolean
}

export type Tag = {
  name: string
  id: string
}

export type Column = {
  title: string
  include: string[][]
  ignore: string[][]
  visible: boolean
}

export type Row = {
  year: number
  timestamps: number[]
}

export type Color = {
  value: string
  include: string[][]
  ignore: string[][]
}

export type Options = {
  columnSameWidth: boolean
  startYear: number
  endYear: number
}
