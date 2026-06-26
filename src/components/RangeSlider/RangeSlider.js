import React, { useCallback, useState } from "react";
import { View, Text, Dimensions,StyleSheet } from "react-native";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { THEME, mainstyles } from "../../theme";
import { useEffect } from "react";
import { normalize } from "../../util/UI/fontsUI";

const RangeSlider = (props) => {
  const { from, to, value, setValue, valueSuffix} = props
  // console.log('RangeSlider', value)
  const [low, setLow] = useState(from);
  const [high, setHigh] = useState(to);
  // console.log('RangeSlider appType', appType)

  const width = Dimensions.get('window').width-30

  const handleValueChange = useCallback(
    (value) => {
      setValue(value)
    }, [value]
  );


  const CustomMarker = ({
    currentValue,
    valueSuffix,
    valuePrefix,
  }) => {
    // console.log('CustomMarker', currentValue)
    return (
      <View hitSlop={{top: 15, left: 15, right:15, bottom:15}} style={{
        position: 'relative',
        // backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
      }}>
        <View style={styles.markerContainer}>            
            {/* <View style={styles.markerCallOut}>
              <Text style={styles.textCallOut}>{currentValue}</Text>
              <Text style={styles.textCallOut}> {valueSuffix}</Text>
            </View>  */}
        </View>
      </View>
    )
  }

  return (
    <View style={{marginTop: 5,alignSelf: 'center', backgroundColor: 'transparent'}}>
      <MultiSlider
        value={[value]}
        min={low}
        max={high}
        valueSuffix={valueSuffix}
        sliderLength={width}
        selectedStyle={{
          backgroundColor: THEME.PRIMARY,
        }}
        unselectedStyle={{
          backgroundColor: THEME.PRIMARY,
        }}
        containerStyle={{
          height: 40,
        }}
        trackStyle={{
          height: 3,
        }}
        touchDimensions={{
          height: 40,
          width: 40,
          borderRadius: 20,
          slipDisplacement: 40,
        }}
        onValuesChange={handleValueChange}
        customMarker={() => <CustomMarker currentValue={value} valueSuffix={valueSuffix}/>}
      />
       <View
        style={[mainstyles.rowalC,{justifyContent: 'space-between'}]}
      >
        <View>
          <Text style={[mainstyles.text12R,{color: THEME.GREY600}]}>{low} </Text>
        </View>
        <View>
          <Text style={[mainstyles.text12R,{color: THEME.GREY600}]}>{high/2} </Text>
        </View>
        <View>
          <Text style={[mainstyles.text12R,{color: THEME.GREY600}]}>{high} </Text>
        </View>
      </View>
    </View>
  );
};

export default RangeSlider;
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4
  },
  markerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderColor: THEME.GREY200,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000'
  },
  markerContainerH: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    borderWidth: 6,
    borderColor: '#000',
    elevation: 2
  },
  markerCallOut: {
    position: 'absolute',
    top: -20,
    right: -5,
    flexDirection: 'row',
    minWidth: 60,
    justifyContent: 'flex-end',
    // backgroundColor: 'red'
  },
  markerCallOutH: {
    position: 'absolute',
    top: -40,
    right: 0,
    flexDirection: 'row',
    minWidth: 60,
    justifyContent: 'flex-end',
    // backgroundColor: 'red'
  },
  textCallOut: {
    fontSize: normalize(14),
    color: '#000'
  },
  textSufDown: {
    fontSize: normalize(14), 
    color: "#C9C9C9",
  },
})
