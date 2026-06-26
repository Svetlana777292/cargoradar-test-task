import * as React from "react"
import Svg, { Path } from "react-native-svg"
const IconStarSmallFill = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width ? props?.width : 29}
    height={props?.height ? props?.height : 28}
    fill="none"
    viewBox="0 0 89 86"
    {...props}
  >
    <Path
      fill={props?.color? props?.color :"#205CBE"}
      d="M20.616 85.147c-.965 0-1.808-.362-2.652-.964-1.567-1.085-2.17-3.014-1.808-4.822l5.545-24.83L2.535 37.654C1.088 36.329.606 34.52 1.088 32.592c.603-1.808 2.05-3.013 3.978-3.255l25.313-2.29L40.505 3.663C41.228 1.975 42.915.89 44.844.89c1.808 0 3.496 1.206 4.34 2.773l10.004 23.505 25.313 2.29c1.808.12 3.375 1.447 3.978 3.255.603 1.808 0 3.736-1.446 5.062L67.867 54.41l5.545 24.83c.482 1.809-.362 3.737-1.808 4.822-1.567 1.085-3.496 1.206-5.183.241L44.723 71.406 22.786 84.424c-.482.482-1.326.723-2.17.723Z"
    />
  </Svg>
)
export default IconStarSmallFill;