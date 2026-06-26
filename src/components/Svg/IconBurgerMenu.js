import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconBurgerMenu = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      fill={props?.color?props.color:"#fff"}
      d="M17.485 3.339H1.67C.744 3.339 0 2.595 0 1.669 0 .744.744 0 1.67 0h15.815c.925 0 1.67.744 1.67 1.67 0 .925-.754 1.669-1.67 1.669ZM17.485 9.53H1.67C.744 9.53 0 8.786 0 7.86c0-.925.744-1.67 1.67-1.67h15.815c.925 0 1.67.745 1.67 1.67 0 .926-.754 1.67-1.67 1.67ZM17.485 15.73H1.67C.744 15.73 0 14.986 0 14.06c0-.925.744-1.669 1.67-1.669h15.815c.925 0 1.67.744 1.67 1.67 0 .925-.754 1.669-1.67 1.669Z"
    />
  </Svg>
)
export default IconBurgerMenu;