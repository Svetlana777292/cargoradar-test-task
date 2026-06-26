import React, {useState} from "react";
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Platform } from "react-native";
import Video from "react-native-video";
import Icon from '@react-native-vector-icons/entypo';
import { mainstyles } from "../../../../theme";

export const VideoCustomModal = (props) => {
  const {currImage,onPlayVideo,isPaused,setIsPaused,onClose,custStylesPadding} = props;
  let [progress, setProgress] = useState(false)
  return (
    <View style={{ position: 'relative',width: Dimensions.get('window').width,height: Dimensions.get('window').height+custStylesPadding,
      backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignContent: 'center',}}>
    <TouchableOpacity onPress={()=>{onClose(false),setIsPaused(false)}}  
        style={{
        position: 'absolute', top: Platform.OS==='android'? 0 : custStylesPadding, right: 5, zIndex: 999,
        justifyContent: 'center', alignContent: 'center',
        width: 40, height:40 
    }}>
      <Icon name='cross' color={"#fff"} size={32} style={{alignSelf: 'center'}}/>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPlayVideo}  style={{backgroundColor: 'transparent', position: 'absolute', alignSelf: 'center', zIndex: 3}}>
      { isPaused && !progress
        ? <Icon name='controller-play' size={40} color={'#fff'} />
        : null
      }
    </TouchableOpacity>
    {
      progress ?
    <View style={{position: 'absolute',height: '100%',width: '100%', backgroundColor: 'rgba(0,0,0,0.2)',zIndex: 999,justifyContent: 'center'}}>
      <Text style={[mainstyles.text13R,{color: '#fff', alignSelf: 'center'}]}>Загрузка...</Text>
    </View>
    : null
    }
      <Video
        style={{
          // backgroundColor: 'red'
          height: '90%',
          // aspectRatio: 1,
          width: Dimensions.get('screen').width-10,
          alignSelf: 'center',
          zIndex: 2,
          padding: 0,margin: 0
        }}
        onEnd={()=>setIsPaused(true)}
        resizeMode="contain"
        muted={true}
        paused={isPaused}
        source={{ uri: currImage }}
        allowsExternalPlayback={false}
        onBuffer={() => {
          console.log("Buffering");
        }}
        onLoadStart={() => {
          setProgress(true)
            console.log("Loading video...", );
        }}
        onLoad={() => {
          setProgress(false)
            console.log("onload complete", );
        }}
        onError={(error) => {
          setProgress(false)
            console.log("Video error => ", error);
        }}
        
        >
      </Video>
    </View>
  )
}