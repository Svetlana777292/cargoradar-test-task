import * as React from "react"
import Svg, { Path,Circle } from "react-native-svg"
const IconUserAvatar = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={80}
    height={81}
    fill="none"
    {...props}
  >
    <Path
      fill="#BDBDBD"
      stroke="#fff"
      strokeWidth={2}
      d="M79 40.527c0 21.54-17.46 39-39 39s-39-17.46-39-39c0-21.539 17.46-39 39-39s39 17.461 39 39Z"
    />
    <Path
      fill="#EEE"
      d="M40 39.547c7.894 0 14.293-6.4 14.293-14.293 0-7.894-6.4-14.294-14.293-14.294-7.894 0-14.293 6.4-14.293 14.293 0 7.894 6.4 14.294 14.293 14.294ZM40 78.638c10.445 0 19.9-4.27 26.717-11.159C64.738 54.505 53.523 44.555 40 44.555c-13.523 0-24.738 9.95-26.717 22.924C20.1 74.369 29.555 78.639 40 78.639Z"
    />
  </Svg>
)
export default IconUserAvatar;