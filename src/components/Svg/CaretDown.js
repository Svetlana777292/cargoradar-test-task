import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CaretDown = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={6}
    fill="none"
    {...props}
  >
    <Path fill="#D9D9D9" d="M5 6 .67 0h8.66L5 6Z" />
  </Svg>
)
export default CaretDown;