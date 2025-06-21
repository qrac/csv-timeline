import { clsx } from "clsx"

import "./index.css"

export function ComponentSetting({ asideType }: { asideType: string }) {
  return (
    <div className={clsx("setting", asideType === "setting" && "is-active")}>
      <p>設定</p>
    </div>
  )
}
