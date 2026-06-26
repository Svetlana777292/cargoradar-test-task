import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, Platform,FlatList } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice
import { width } from '../../util/helperConst';

//components

//styles
import { THEME, mainstyles } from '../../theme';

const AddPhotoTender = (props) => {
  const {
    images,
    setImages,
    onOpenAskModal,
    onDelete,
    flag,
    setDelItem
  } = props;
  // console.log('AddPhotoTender', images)

  const _renderItem = ({item,index}) => {
    return (
      <View style={[styles.rowItem,mainstyles.shadowG5r5]}>
        <TouchableOpacity onPress={()=>onDelete(index,images,setImages,item,flag,setDelItem)} style={[styles.closeRound,mainstyles.shadowG5r5]}>
          <Icon name={'cross'} size={20} color={'red'} />
        </TouchableOpacity>
        <Image source={{uri: item}} style={[styles.img,]} />
      </View>
    )
  }
  return (
    <View style={styles.photoContainer}>
      {
        images&&images?.length<=9?
        <TouchableOpacity style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.emptyItem]} activeOpacity={0.9} onPress={onOpenAskModal}>
          <View style={[styles.roundIcon,mainstyles.shadowG5r5,]}><Text style={[mainstyles.text32SB, {color: THEME.GREY500, lineHeight: 37}]}>+</Text></View>
        </TouchableOpacity>
        :null
      }
      {
        images?.length > 0 ?
        <FlatList
          data={images}
          style={{}}
          keyExtractor={(item, index) => index+1}
          renderItem={_renderItem}
          horizontal
          extraData={images}
        />
        : null
      }
      {
        (images?.length===0) ?
        <View style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.emptyItem,]}/>
        :null
      }
      {
        (images?.length===0||images?.length<2) ?
        <View style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.emptyItem,]}/>
        :null
      }
      {
       (images?.length===0||images?.length<3) ?
       <View style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.emptyItem,]}/>
       :null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  photoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingVertical: 5,
    // backgroundColor: 'purple'
  },
  whiteBlock: {
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,    
  },
  emptyItem: {
    borderRadius: 10,
    height: width/4,
    width:  width/4-15,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    backgroundColor: '#fff',
    // backgroundColor: 'pink'
  },
  rowItem: {
    // backgroundColor: 'orange',
    position: 'relative',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
  },
  img: {
    borderRadius: 10,
    height: width/4,
    width:  width/4-15,
  },
  roundIcon: {
    width: 40,
    height: 40,
    borderRadius: 30,
    elevation: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeRound: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderColor: '#ccc',
    borderWidth:1
  },
})
export default AddPhotoTender;