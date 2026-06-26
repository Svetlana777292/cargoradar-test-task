import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconStarSmall = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width ? props?.width :28}
    height={props?.height ? props?.height :27}
    viewBox="0 0 28 27"
    fill="none"
    {...props}
  >
    <Path
      stroke={props?.color ? props?.color :"#9E9E9E"}
      strokeWidth={2}
      d="m25.55 10.004-7.605-1.106-3.4-6.892a.954.954 0 0 0-.435-.434.962.962 0 0 0-1.285.434l-3.4 6.892-7.605 1.106a.956.956 0 0 0-.53 1.635l5.503 5.365-1.3 7.575a.957.957 0 0 0 1.39 1.01l6.802-3.577 6.803 3.577a.957.957 0 0 0 1.39-1.01l-1.3-7.575 5.502-5.365a.957.957 0 0 0 .279-.548.955.955 0 0 0-.809-1.087Z"
    />
  </Svg>
)
export default IconStarSmall;