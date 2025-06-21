import { clsx } from "clsx"

import "./index.css"

export function ComponentModal({
  acticeModal,
  closeModal,
  children,
}: {
  acticeModal: boolean
  closeModal: () => void
  children: React.ReactNode
}) {
  return (
    <aside className={clsx("modal", acticeModal && "is-active")}>
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-container">{children}</div>
    </aside>
  )
}
