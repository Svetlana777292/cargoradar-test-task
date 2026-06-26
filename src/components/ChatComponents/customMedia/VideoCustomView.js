import React, { useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator } from "react-native";
import Video from "react-native-video";
import { mainstyles } from "../../../theme";

export const VideoCustomView = (props) => {
  const {src, thumb, setSrc, onOpenModal} = props;
  console.log('VideoCustomView src', src)
  const [videoAspectRatio, setVideoAspectRatio] = useState(1); // default to square
  const [isLoading, setIsLoading] = useState(true); // default to square

  const handleVideoLoad = (data) => {
    console.log('data', data)
    try {
      const { width, height } = data.naturalSize;
        if (width && height) {
          const ratio = width / height;
          setVideoAspectRatio(ratio);
          // console.log("Video aspect ratio:", ratio);
        }
      setIsLoading(false)
    } catch (error) {
      console.log('handleVideoLoad error', error)
      setIsLoading(false)
    }
  };

  return (
    <TouchableOpacity 
      onPress={()=>{setSrc(src),onOpenModal(true)}}
      style={{
        // backgroundColor: "#eee",
        padding: 5,
        borderRadius: 15,
        overflow: "hidden",
        alignSelf: "center",
        width: 210,
        }}>
          {src !== null && isLoading && <View style={[StyleSheet.absoluteFill,{backgroundColor: 'rgba(0,0,0,0.1)',justifyContent: 'center'}]}><ActivityIndicator color={'blue'}/></View>}
      {/* <Image
        style={{
          position: 'relative',
          // left: 0,
          // top: 0,
          // height: 140,
          width: 200,
          aspectRatio: 1,
          borderRadius: 20,
          // margin: 5
        }}
        resizeMode='contain'
        source={{ uri: thumb }} /> */}
        {
          src !== null ?
          <Video
            style={{
              // backgroundColor: 'red',
              aspectRatio: videoAspectRatio,
              borderRadius: 15,
              overflow: 'hidden',
            }}
            resizeMode='cover'
            muted={true}
            paused={false} //не отображается видео true
            rate={0.0}
            repeat={false}
            source={{ uri: src }}
            allowsExternalPlayback={false}
            onBuffer={() => {
              console.log("Buffering");
            }}
            onLoad={handleVideoLoad}
            onError={(error) => {
              setIsLoading(false)
              console.log("Video error => ", error);
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