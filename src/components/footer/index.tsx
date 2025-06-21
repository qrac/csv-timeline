import "./index.css"

export function ComponentFooter({
  runSetting,
  runGenerate,
}: {
  runSetting: () => void
  runGenerate: () => void
}) {
  return (
    <footer className="footer">
      <div className="footer-buttons">
        <button
          type="button"
          className="button is-outline"
          onClick={runSetting}
        >
          設定
        </button>
        <button
          type="button"
          className="button is-plain is-secondary"
          onClick={runGenerate}
        >
          画像に変換
        </button>
      </div>
    </footer>
  )
}
