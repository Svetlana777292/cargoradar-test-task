import * as React from "react"
import { View } from "react-native"
import Svg, { Path, Circle, Text } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent(props) {
  // console.log('props', props)
  const text = props?.type === 'start' ? "#205CBE" : "#fff"
  
  return (
    <View style={{position: 'relative',}}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 77 100"
        height={26}
        width={25}
        style={{
          enableBackground: "new 0 0 77 100",
        }}
        xmlSpace="preserve"
        // preserveAspectRatio=
        {...props}
      >
        {/* <Path
          d="M38.5 0C17.2 0 0 17.1 0 38.3 0 71.4 38.5 100 38.5 100S77 71.4 77 38.3C77 17.1 59.8 0 38.5 0zm0 99S1 71 1 38.5C1 17.8 17.8 1 38.5 1S76 17.8 76 38.5C76 71 38.5 99 38.5 99z"
          style={{
            fill: "#fff",
          }}
        /> */}
        <Path
          d="M38.5 1C17.8 1 1 17.8 1 38.5 1 71 38.5 99 38.5 99S76 71 76 38.5C76 17.8 59.2 1 38.5 1z"
          style={{
            fill: props?.type === 'start' ? '#ffffff': "#205CBE",
            stroke: "#205CBE",
            strokeWidth: 4,
          }}
        />
        {/* <Circle
          cx={38.5}
          cy={38.5}
          r={31.5}
          style={{
            fill: "#fff",
          }}
        /> */}
        {props?.children}
        {/* {
          props && props.indexPin+1 ?
          <Text
            // transform="translate(-20 40)"
            fill={'#fff'}
            // stroke="purple"
            fontSize="48"
            fontWeight="bold"
            x="38.5"
            y="57"
            textAnchor="middle"
            style={{
              position: 'absolute',
              top: 0,
              zIndex: 999,
              color: 'red',
              // fontSize: 58,
              // fontFamily: "'MyriadPro-Regular'",
            }}
          >
            {props.indexPin+1}
          </Text>
          :
          null
        } */}
      </Svg>
    </View>
  )
}

export default SvgComponent
