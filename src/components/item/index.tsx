import { clsx } from "clsx"
import { format } from "date-fns"

import type { Item } from "../../types"
import "./index.css"

export function ComponentItem({ item }: { item: Item }) {
  const tagClasses = item.tags.map((tag) => `is-${tag}`).join(" ")
  return (
    <div className={clsx("item", tagClasses)}>
      <div className={clsx("item-name", tagClasses)}>{item.name}</div>
      <div className={clsx("item-date", tagClasses)}>
        {format(item.timestamp, "yyyy/MM/dd")}
      </div>
    </div>
  )
}
