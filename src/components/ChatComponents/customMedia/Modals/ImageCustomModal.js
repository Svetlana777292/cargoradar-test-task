import React from "react";
import { Image, Dimensions, TouchableOpacity} from "react-native";

export const ImageCustomModal = (props) => {
  const {currImage, onClose} = props;

  return (
    <TouchableOpacity onPress={()=>onClose(false)} 
    style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignContent: 'center'}}>
      <Image source={{uri: currImage}} style={{width: '90%', height: '100%', alignSelf: 'center'}} resizeMode={'contain'}/>
    </TouchableOpacity>
  )
}