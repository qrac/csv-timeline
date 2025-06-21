import html2canvas from "html2canvas"
import Papa from "papaparse"

import type { Item, Tag, Column, Row, Color } from "./types"

export function splitCondition(str: string): string[][] {
  return str
    .split("|")
    .map((str) => str.trim())
    .filter((str) => str !== "")
    .map((str) => {
      return str.split(",").map((tag) => tag.trim())
    })
}

export async function htmlToPng(element: HTMLElement): Promise<string | null> {
  try {
    await new Promise(requestAnimationFrame)
    const canvas = await html2canvas(element)
    const dataUrl = canvas.toDataURL("image/png")
    return dataUrl
  } catch (error) {
    console.error("Error capturing image:", error)
    return null
  }
}

export async function parseCsv(url: string): Promise<string[][]> {
  try {
    const response = await fetch(url)
    const text = await response.text()
    const parsedCsv = Papa.parse(text, {
      skipEmptyLines: true,
    }).data as string[][]

    if (!parsedCsv) {
      console.error("Failed to parse CSV file.")
      return []
    }
    if (!parsedCsv.length) {
      console.error("No data found in the CSV file.")
      return []
    }
    return parsedCsv
  } catch (error) {
    console.error("Error fetching CSV file:", error)
    return []
  }
}

export function csvToItemList(parsedCsv: string[][]): Item[] {
  return parsedCsv.map((row) => {
    const name = row[0].trim() || ""
    const tags = row[1]
      .split(",")
      .map((tag) => tag.trim())
      .filter((condition) => condition !== "")
    const date = new Date(row[2])
    const visible = row[3] ? Boolean(row[3]) : true
    return {
      name,
      year: date.getFullYear(),
      timestamp: date.getTime(),
      tags,
      visible,
    }
  })
}

export function csvToTagList(parsedCsv: string[][]): Tag[] {
  return parsedCsv
    .map((row) => {
      const name = row[0].trim() || ""
      const id = row[1].trim() || ""
      return {
        name,
        id,
      }
    })
    .filter((tag) => tag.name !== "" && tag.id !== "")
}

export function csvToColorList(parsedCsv: string[][]): Color[] {
  return parsedCsv.map((row) => {
    const value = row[0].trim() || ""
    const include = row[1] ? splitCondition(row[1]) : []
    const ignore = row[2] ? splitCondition(row[2]) : []
    return {
      value,
      include,
      ignore,
    }
  })
}

export function csvToColumnList(parsedCsv: string[][]): Column[] {
  return parsedCsv.map((row) => {
    const title = row[0].trim() || ""
    const include = row[1] ? splitCondition(row[1]) : []
    const ignore = row[2] ? splitCondition(row[2]) : []
    const visible = row[3] ? Boolean(row[3]) : true
    return {
      title,
      include,
      ignore,
      visible,
    }
  })
}

export function getYearList(itemList: Item[]): number[] {
  return [...new Set(itemList.map((item) => item.year))].sort((a, b) => a - b)
}

export function getRowList(itemList: Item[], yearList: number[]): Row[] {
  return yearList.map((year) => {
    const yearItemList = itemList.filter((item) => item.year === year)
    const timestamps = [
      ...new Set(yearItemList.map((item) => item.timestamp)),
    ].sort((a, b) => a - b)
    return {
      year,
      timestamps,
    }
  })
}

export function getYearLength(startYear: number, endYear: number): number {
  return Math.max(0, endYear - startYear + 1)
}

export function getRowLength(rowList: Row[], yearLength: number): number {
  const timestamLength = rowList
    .map((row) => row.timestamps.length)
    .reduce((acc, curr) => acc + curr, 0)
  return timestamLength + yearLength - rowList.length
}

export function getVariableColors(colorList: Color[]): string {
  return colorList
    .map((color) => {
      const rules: string[] = []

      color.include.forEach((includeSet) => {
        const includeSelector = includeSet.map((tag) => `.is-${tag}`).join("")
        const ignoreSelectors = color.ignore.map((ignoreSet) =>
          ignoreSet.map((tag) => `:not(.is-${tag})`).join("")
        )
        if (ignoreSelectors.length > 0) {
          ignoreSelectors.forEach((ignoreSel) => {
            rules.push(
              `${includeSelector}${ignoreSel} {\n  --theme-ac: ${color.value};\n}`
            )
          })
        } else {
          rules.push(`${includeSelector} {\n  --theme-ac: ${color.value};\n}`)
        }
      })
      return rules.join("\n")
    })
    .join("\n")
}

export function filterItemList(
  itemList: Item[],
  timestamp: number,
  include: string[][],
  ignore: string[][]
): Item[] {
  const filteredItemList = itemList.filter(
    (item) => item.timestamp === timestamp && item.visible
  )
  if (filteredItemList.length === 0) return []

  return filteredItemList.filter((item) => {
    const isIncluded =
      include.length === 0 ||
      include.some((tags) => tags.every((tag) => item.tags.includes(tag)))
    const isIgnored = ignore.some((tags) =>
      tags.every((tag) => item.tags.includes(tag))
    )
    return isIncluded && !isIgnored
  })
}
