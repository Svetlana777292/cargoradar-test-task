import * as React from "react"
import Svg, { Path,G,ClipPath,Defs } from "react-native-svg"
const IconDocRecover = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <G fill={props?.color ? props?.color : "#BDBDBD"} clipPath="url(#a)">
      <Path d="M5.795 5.142A.469.469 0 0 0 6.127 5L9.53 1.6v12.618a.469.469 0 1 0 .938 0V1.6L13.873 5a.469.469 0 0 0 .658-.658l-4.2-4.205a.471.471 0 0 0-.072-.06L10.223.06a.463.463 0 0 0-.045-.023.465.465 0 0 0-.048-.016l-.038-.01a.469.469 0 0 0-.184 0l-.04.012a.458.458 0 0 0-.048.015.469.469 0 0 0-.045.024l-.034.017a.47.47 0 0 0-.072.06l-4.2 4.204a.469.469 0 0 0 .331.8h-.005Z" />
      <Path d="M19.531 13.75a.469.469 0 0 0-.468.469v3.437a1.406 1.406 0 0 1-1.407 1.407H2.344a1.406 1.406 0 0 1-1.406-1.407V14.22a.469.469 0 1 0-.938 0v3.437A2.344 2.344 0 0 0 2.344 20h15.312A2.343 2.343 0 0 0 20 17.656V14.22a.469.469 0 0 0-.469-.469Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconDocRecover;