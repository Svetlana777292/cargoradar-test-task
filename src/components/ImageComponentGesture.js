import React, { useState, useRef, createRef } from 'react';
import { View, Text, Image, Animated, Dimensions, Pressable } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import { height } from '../util/helperConst';

const ImageComponentGesture = (props) => {
  const {path, index, stylesImage, safeInsets} = props;
  // console.log('path', path)
  const [panEnabled, setPanEnabled] = useState(false);
  const [pinchEnded, setPinchEnded] = useState(true);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  // console.log('qwe', scale,translateX,translateY)

  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event([{
    nativeEvent: { scale }
  }],
    { useNativeDriver: true });

  const onPanEvent = Animated.event([{
    nativeEvent: {
      translationX: translateX,
      translationY: translateY
    }
  }],
    { useNativeDriver: true });

  const handlePinchStateChange = ({ nativeEvent }) => {
    // enabled pan only after pinch-zoom
    // {"ACTIVE": 4, "BEGAN": 2, "CANCELLED": 3, "END": 5, "FAILED": 1, "UNDETERMINED": 0}
    console.log('nativeEvent.state', nativeEvent.state)
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
      setPinchEnded(false);
    }
    if (nativeEvent.oldState === State.ACTIVE) {
      setPinchEnded(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    console.log('nScale', nScale)
    if (nativeEvent.state === State.END ) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true
        }).start();

        setPanEnabled(false);
        // setPinchEnded(true)
      }
    } else if (nativeEvent.state === State.FAILED || nativeEvent.state === State.CANCELLED) {
      //если картинка увеличина и пользователь пытается листать слайдер то сбросить зум
      if (nScale == 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true
        }).start();

        setPanEnabled(false);
        setPinchEnded(true)
      }
    }
  };

  return (
    <View style={{ width: '100%', backgroundColor: 'transparent',paddingTop: height < 700 ? safeInsets?.top : 0,}} key={index+'qwe'}>
      {/* <Image source={{uri: path}} style={{width: '95%', height: height < 700 ? '90%': '100%',}} resizeMode='contain'/> */}
      <PanGestureHandler
        onGestureEvent={onPanEvent}
        ref={panRef}
        simultaneousHandlers={[pinchRef]}
        enabled={panEnabled && pinchEnded}
        // enabled={panEnabled}
        // failOffsetX={[-1000, 1000]}
        // shouldCancelWhenOutside
      >
        <Animated.View>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            simultaneousHandlers={[panRef]}
            onHandlerStateChange={handlePinchStateChange}
          >
            <Animated.Image
              source={{ uri: path }}
              style={[stylesImage,{
                
                alignSelf: 'center',
                // width: '100%',
                // height: '100%',
                transform: [{ scale }, { translateX }, { translateY }]
              }]}
              resizeMode="contain"
            />

          </PinchGestureHandler>
        </Animated.View>

      </PanGestureHandler>
    </View>
  );
};


export default ImageComponentGesture;