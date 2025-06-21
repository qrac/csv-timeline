import { clsx } from "clsx"

import "./index.css"

export function ComponentLoading({
  text = "loading...",
  activeLoading,
}: {
  text?: string
  activeLoading: boolean
}) {
  return (
    <aside className={clsx("loading", activeLoading && "is-active")}>
      {text}
    </aside>
  )
}
