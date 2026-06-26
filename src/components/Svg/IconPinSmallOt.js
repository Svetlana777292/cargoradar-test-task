import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconPinSmallOt = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      fill={props?.color?props.color:"#205CBE"}
      d="M6.356 15.322c.499 0 .972-.213 1.3-.592l3.281-3.765a6.044 6.044 0 0 0 1.493-4.202A6.083 6.083 0 0 0 2.056 2.67a6.078 6.078 0 0 0-.287 8.295l3.287 3.765c.327.38.8.592 1.3.592Zm0-12.605c1.092 0 2.179.416 3.01 1.243a4.27 4.27 0 0 1 .198 5.809L6.356 13.45 3.147 9.77a4.27 4.27 0 0 1 .198-5.809 4.257 4.257 0 0 1 3.01-1.243Z"
    />
  </Svg>
)
export default IconPinSmallOt;