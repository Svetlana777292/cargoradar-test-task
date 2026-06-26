import * as React from "react"
import Svg, { Path } from "react-native-svg"
const BackArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={17}
    fill="none"
    {...props}
  >
    <Path
      fill="#205CBE"
      d="M20.446 7.266H4.1l4.647-4.648a1.201 1.201 0 0 0 0-1.696 1.201 1.201 0 0 0-1.696 0L.347 7.612A1.201 1.201 0 0 0 0 8.468c0 .321.12.628.347.855l6.704 6.704c.24.24.548.347.855.347.307 0 .614-.12.855-.347a1.201 1.201 0 0 0 0-1.696L4.1 9.67h16.346c.668 0 1.202-.535 1.202-1.203 0-.667-.534-1.201-1.202-1.201Z"
    />
  </Svg>
)
export default BackArrow;