import { clsx } from "clsx"

import "./index.css"

export function ComponentViewer({
  asideType,
  imageData,
}: {
  asideType: string
  imageData: string | null
}) {
  return (
    <div className={clsx("viewer", asideType === "viewer" && "is-active")}>
      <div className="viewer-box">
        {imageData && (
          <img className="viewer-image" src={imageData} alt="Game Timeline" />
        )}
      </div>
      <div className="viewer-buttons">
        <a
          href={imageData}
          download="game-timeline.png"
          className="button is-plain is-secondary"
        >
          画像を保存
        </a>
      </div>
    </div>
  )
}
