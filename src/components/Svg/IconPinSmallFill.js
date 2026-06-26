import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconPinSmallFill = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      fill={props?.color ? props?.color : "#205CBE"}
      d="M6.956 15.612c.57 0 1.11-.23 1.485-.637l3.746-4.046c1.164-1.252 1.764-2.856 1.704-4.516-.059-1.66-.783-3.219-2.03-4.398-2.708-2.549-7.108-2.549-9.815 0C.799 3.188.08 4.748.016 6.413c-.06 1.66.545 3.264 1.703 4.516l3.753 4.046c.374.408.914.637 1.484.637Z"
    />
  </Svg>
)
export default IconPinSmallFill;