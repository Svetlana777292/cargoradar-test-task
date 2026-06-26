import * as React from "react"
import Svg, { Path } from "react-native-svg"
const RoundCloseBtn = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      fill="#BDBDBD"
      d="M7 0c3.854 0 7 3.146 7 7s-3.146 7-7 7-7-3.146-7-7 3.146-7 7-7ZM3.835 9.309a.674.674 0 0 0 0 .949c.26.26.689.26.95 0l2.364-2.364 2.364 2.364c.26.26.69.26.95 0a.674.674 0 0 0 0-.95L8.098 6.945l2.365-2.364a.674.674 0 0 0 0-.95.674.674 0 0 0-.95 0L7.15 5.995 4.785 3.63a.674.674 0 0 0-.95 0 .674.674 0 0 0 0 .95L6.2 6.944 3.835 9.31Z"
    />
  </Svg>
)
export default RoundCloseBtn;