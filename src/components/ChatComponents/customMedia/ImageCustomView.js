import React, { useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from "react-native";
import { mainstyles } from "../../../theme";

export const ImageCustomView = (props) => {
  const {src, name, setSrc, onOpenModal} = props;
  const [aspectRatio, setAspectRatio] = useState(1); // default square

  const handleImageLoad = (e) => {
    try {
      const { width, height } = e.nativeEvent.source;
      if (width && height) {
        setAspectRatio(width / height);
      }
    } catch (error) {
      console.log('handleImageLoad error', error)
    }
  };

  return (
    <TouchableOpacity 
      onPress={()=>{setSrc(src),onOpenModal(true)}}
      style={{
        padding: 5,
        borderRadius: 20,
      }}>
      {
        src !== null ? 
        <Image
          style={{
            width: 200,
            aspectRatio: aspectRatio,
            borderRadius: 20,
            // margin: 5
          }}
          resizeMode='cover'
          source={{ uri: src }} 
          onLoad={handleImageLoad}
          onError={(error) => {
            alert(`img err ${error}`)
          }}
          />
          :
          <View style={{paddingTop: 10}}>
            <Text style={[mainstyles.text12M,{ color: '#222D49'}]}>Файл не найден</Text>
          </View> 
      }
        
    </TouchableOpacity>
  )
}