import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const IconDate = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <G fill={props?.color ? props?.color : "#000"} clipPath="url(#a)">
      <Path d="M12 1.452V0h-1v1.452H4V0H3v1.452H0V15h15V1.452h-3ZM1 2.419h2v1.452h1V2.419h7v1.452h1V2.419h2V6.29H1V2.42Zm13 11.613H1V7.258h13v6.774Z" />
      <Path d="M2.5 11.13h7.793l-1.147 1.108.708.685 2.353-2.278-2.353-2.278-.708.685 1.147 1.11H2.5v.967Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h15v15H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconDate