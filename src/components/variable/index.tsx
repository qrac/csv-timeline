import type { Color } from "../../types"

import { getVariableColors } from "../../utils"

export function ComponentVariable({ colorList }: { colorList: Color[] }) {
  const css = getVariableColors(colorList)
  return <style>{css}</style>
}
