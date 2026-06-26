import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconSortArrowDown = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      stroke="#757575"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="m9.1 12.775-3.5 3.5-3.5-3.5M5.6 16.275V3.15m12.25 10.5h-4.375m4.375-4.375h-6.125M17.85 4.9H9.1"
    />
  </Svg>
)
export default IconSortArrowDown;