import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconTrash = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill={props?.color?props.color:"#BDBDBD"}
      d="m4.753.622-.253.503H1.125a1.124 1.124 0 1 0 0 2.25h13.5a1.124 1.124 0 1 0 0-2.25H11.25l-.253-.503A1.12 1.12 0 0 0 9.99 0H5.76c-.426 0-.816.24-1.006.622ZM14.625 4.5h-13.5l.745 11.918c.057.89.795 1.582 1.684 1.582h8.642c.89 0 1.627-.693 1.684-1.582L14.625 4.5Z"
    />
  </Svg>
)
export default IconTrash;