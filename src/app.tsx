import { useState, useRef, useEffect } from "react"

import type { Item, Tag, Column, Row, Color, Options } from "./types"
import "./app.css"
import { ComponentVariable } from "./components/variable"
import { ComponentHeader } from "./components/header"
import { ComponentMain } from "./components/main"
import { ComponentFooter } from "./components/footer"
import { ComponentTimeline } from "./components/timeline"
import { ComponentModal } from "./components/modal"
import { ComponentSetting } from "./components/setting"
import { ComponentViewer } from "./components/viewer"
import { ComponentLoading } from "./components/loading"
import {
  htmlToPng,
  parseCsv,
  csvToItemList,
  csvToTagList,
  csvToColumnList,
  csvToColorList,
  getYearList,
  getRowList,
} from "./utils"

const defaultOptions: Options = {
  columnSameWidth: false,
  startYear: 1983,
  endYear: 2025,
}

export default function App() {
  const [itemList, setItemList] = useState<Item[]>([])
  const [tagList, setTagList] = useState<Tag[]>([])
  const [columnList, setColumnList] = useState<Column[]>([])
  const [rowList, setRowList] = useState<Row[]>([])
  const [colorList, setColorList] = useState<Color[]>([])
  const [options, setOptions] = useState<Options>(defaultOptions)

  const [asideType, setAsideType] = useState("")
  const [activeTimeline, setActiveTimeline] = useState(false)
  const [activeModal, setActiveModal] = useState(false)
  const [activeLoading, setActiveLoading] = useState(false)
  const [activeGenerate, setActiveGenerate] = useState(false)

  const [imageData, setImageData] = useState<string | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const runSetting = () => {
    setAsideType("setting")
    setActiveModal(true)
  }
  const runGenerate = () => {
    if (!timelineRef.current) return
    setActiveGenerate(true)
    setActiveLoading(true)
  }
  const closeModal = () => {
    setAsideType("")
    setActiveModal(false)
    setActiveLoading(false)
    setActiveGenerate(false)
  }
  const changeOptions = (newOptions: Partial<Options>) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }))
  }

  useEffect(() => {
    const capture = async () => {
      if (!timelineRef.current) return
      const png = await htmlToPng(timelineRef.current)
      setImageData(png)
      setActiveGenerate(false)
      setAsideType("viewer")
      setActiveModal(true)
      setActiveLoading(false)
    }
    activeGenerate && capture()
  }, [activeGenerate])

  useEffect(() => {
    const setup = async () => {
      const parsedItems = await parseCsv("/assets/items.csv")
      const parsedTags = await parseCsv("/assets/tags.csv")
      const parsedColors = await parseCsv("/assets/colors.csv")
      const parsedColumns = await parseCsv("/assets/columns.csv")
      const defaultItemList = csvToItemList(parsedItems)
      const defaultTagList = csvToTagList(parsedTags)
      const defaultColorList = csvToColorList(parsedColors)
      const defaultColumnList = csvToColumnList(parsedColumns)
      const yearList = getYearList(defaultItemList)
      const defaultRowList = getRowList(defaultItemList, yearList)
      const defaultStartYear = Math.min(...yearList)
      const defaultEndYear = Math.max(...yearList)
      setItemList(defaultItemList)
      setTagList(defaultTagList)
      setColorList(defaultColorList)
      setColumnList(defaultColumnList)
      setRowList(defaultRowList)
      changeOptions({
        startYear: defaultStartYear,
        endYear: defaultEndYear,
      })
      setActiveTimeline(true)
    }
    setup()
  }, [])
  return (
    <div className="app">
      <ComponentVariable colorList={colorList} />
      <ComponentHeader />
      <ComponentMain>
        <ComponentTimeline
          itemList={itemList}
          columnList={columnList}
          rowList={rowList}
          options={options}
          activeTimeline={activeTimeline}
          activeGenerate={activeGenerate}
          ref={timelineRef}
        />
      </ComponentMain>
      <ComponentFooter
        runSetting={() => runSetting()}
        runGenerate={() => runGenerate()}
      />
      <ComponentModal acticeModal={activeModal} closeModal={() => closeModal()}>
        <ComponentSetting asideType={asideType} />
        <ComponentViewer asideType={asideType} imageData={imageData} />
      </ComponentModal>
      <ComponentLoading text="変換中..." activeLoading={activeLoading} />
    </div>
  )
}
