import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconChats = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={23}
    fill="none"
    {...props}
  >
    <Path
      fill="#205CBE"
      fillRule="evenodd"
      d="M21.563 15.652c0 1.006-1.098 2.062-2.157 2.062h-5.75l-2.156 2.75-2.156-2.75h-5.75c-1.059 0-2.156-1.056-2.156-2.062V3.965c0-1.006 1.097-2.063 2.156-2.063h15.812c1.059 0 2.157 1.057 2.157 2.063v11.687ZM19.166.527H3.833C1.716.527 0 2.157 0 4.17V15.78c0 2.01 1.477 3.31 3.594 3.31h4.772l3.134 3.437 3.134-3.438h4.772c2.117 0 3.594-1.298 3.594-3.309V4.17C23 2.157 21.284.527 19.167.527Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconChats;