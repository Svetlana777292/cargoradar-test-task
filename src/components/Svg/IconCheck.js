import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IconCheck = (props) => (
  <Svg
    width={props?.width?props.width:12}
    height={props?.height?props.height:9}
    viewBox="0 0 12 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M4.316 5.335c.037-.073.061-.133.11-.182C5.99 3.577 7.554 2.013 9.118.45c.485-.485 1.091-.582 1.649-.267.679.376.873 1.322.388 1.928-.049.06-.097.121-.158.182L5.25 8.039c-.4.4-.873.546-1.406.352a1.492 1.492 0 01-.522-.34c-.97-.958-1.94-1.928-2.898-2.898-.678-.69-.52-1.734.316-2.146.485-.242.97-.194 1.382.158.352.29.655.63.97.946l1.224 1.224z"
      fill={props?.color?props.color:"#205CBE"}
    />
  </Svg>
)
export default IconCheck;