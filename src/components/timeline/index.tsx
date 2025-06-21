import { clsx } from "clsx"

import type { Item, Column, Row, Options } from "../../types"
import "./index.css"
import { ComponentItem } from "../item"
import { getYearLength, getRowLength, filterItemList } from "../../utils"

export function ComponentTimeline({
  itemList,
  columnList,
  rowList,
  options,
  activeTimeline,
  activeGenerate,
  ref,
}: {
  itemList: Item[]
  columnList: Column[]
  rowList: Row[]
  options: Options
  activeTimeline: boolean
  activeGenerate: boolean
  ref: React.Ref<HTMLDivElement>
}) {
  const { columnSameWidth, startYear, endYear } = options
  const columnWidth = columnSameWidth ? "1fr" : "auto"
  const columnLength = columnList.filter((column) => column.visible).length
  const yearLength = getYearLength(startYear, endYear)
  const rowLength = getRowLength(rowList, yearLength)
  return (
    <div className={clsx("timeline", activeTimeline && "is-active")}>
      <div
        className={clsx("timeline-container", activeGenerate && "is-generate")}
        ref={ref}
        style={{
          gridTemplateColumns: `auto repeat(${columnLength}, ${columnWidth})`,
        }}
      >
        <ComponentColumnYear
          rowList={rowList}
          startYear={startYear}
          yearLength={yearLength}
          rowLength={rowLength}
        />
        {columnList.map((column, columnIndex) =>
          column.visible ? (
            <ComponentColumnContent
              key={columnIndex}
              itemList={itemList}
              column={column}
              rowList={rowList}
              startYear={startYear}
              yearLength={yearLength}
              rowLength={rowLength}
            />
          ) : null
        )}
      </div>
    </div>
  )
}

function ComponentColumnYear({
  rowList,
  startYear,
  yearLength,
  rowLength,
}: {
  rowList: Row[]
  startYear: number
  yearLength: number
  rowLength: number
}) {
  return (
    <div
      className="timeline-column is-year"
      style={{ gridRow: `span ${rowLength + 1}` }}
    >
      <div className="timeline-head is-year"></div>
      {Array.from({ length: yearLength }, (_, yearIndex) => {
        const year = startYear + yearIndex
        const timestamps =
          rowList.find((row) => row.year === year)?.timestamps || []
        return (
          <div
            key={yearIndex}
            className="timeline-row is-year"
            style={{ gridRow: `span ${timestamps.length}` }}
          >
            <div className="timeline-year">{year}</div>
          </div>
        )
      })}
    </div>
  )
}

function ComponentColumnContent({
  itemList,
  column,
  rowList,
  startYear,
  yearLength,
  rowLength,
}: {
  itemList: Item[]
  column: Column
  rowList: Row[]
  startYear: number
  yearLength: number
  rowLength: number
}) {
  return (
    <div
      className="timeline-column is-content"
      style={{ gridRow: `span ${rowLength + 1}` }}
    >
      <div className="timeline-head is-content">
        <div className="timeline-title">
          <span className="timeline-title-main">{column.title}</span>
        </div>
      </div>
      {Array.from({ length: yearLength }, (_, rowIndex) => {
        const year = startYear + rowIndex
        const timestamps =
          rowList.find((row) => row.year === year)?.timestamps || []
        return (
          <div
            key={rowIndex}
            className="timeline-row is-content"
            style={{ gridRow: `span ${timestamps.length}` }}
          >
            {timestamps.map((timestamp, timestampIndex) => {
              const filterdItemList = filterItemList(
                itemList,
                timestamp,
                column.include,
                column.ignore
              )
              return (
                <div key={timestampIndex} className="timeline-date">
                  {filterdItemList.map((item, itemIndex) => (
                    <ComponentItem key={itemIndex} item={item} />
                  ))}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
