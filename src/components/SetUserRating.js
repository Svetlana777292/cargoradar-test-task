import React from 'react';
import { View } from 'react-native';
import { Rating } from 'react-native-ratings';


export const SetUserRating = ({value, onPress}) => {
// console.log('SetUserRating ', value)

  return (
    <View>
      <Rating
        type='star'
        // showRating
        startingValue={value}
        minValue={1}
        // ratingImage={require('../../assets/image/iconstrt.png')}
        // ratingColor='red'
        // ratingBackgroundColor='rgba(43, 50, 178, 1)'
        ratingCount={5}
        // readonly={true}
        imageSize={30}
        jumpValue={0.5}
        fractions={1}
        onFinishRating={onPress}
        style={{ paddingVertical: 10 }}
      />
    </View>
  )
}