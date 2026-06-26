import * as React from "react"
import Svg, { Circle } from "react-native-svg"
const IconMenuDots = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={5}
    height={21}
    fill="none"
    {...props}
  >
    <Circle
      cx={2.5}
      cy={18.5}
      r={2.5}
      fill="#205CBE"
      transform="rotate(-90 2.5 18.5)"
    />
    <Circle
      cx={2.5}
      cy={2.5}
      r={2.5}
      fill="#205CBE"
      transform="rotate(-90 2.5 2.5)"
    />
    <Circle
      cx={2.5}
      cy={10.5}
      r={2.5}
      fill="#205CBE"
      transform="rotate(-90 2.5 10.5)"
    />
  </Svg>
)
export default IconMenuDots