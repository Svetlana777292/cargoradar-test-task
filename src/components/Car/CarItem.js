import React  from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { useNavigation } from '@react-navigation/core';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import { useDispatch } from 'react-redux';

//functions && features && slice
import { updateDataTransport } from '../../store/features/transportSlice';

//components
import IconCarSmOt from '../Svg/IconCarSmOt';

//styles
import { THEME, SIZE } from '../../theme';
import { normalize } from '../../util/UI/fontsUI';

export const CarItem = (props) => {
  const { data } = props
  // console.log('data', data.length);
  // console.log('data', data);
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const handlePress = (item) => {
    navigation.navigate('Transport', {item: item})
  }

  const deleteTransport = (id, item) => {
    // console.log('deleteTransport', id);
    // // console.log('deleteTransport', item);

    // const firbaseRef = firestore().collection('cars').doc(id)

    // if(item.hasOwnProperty('photos') && item.photos.length > 0) {
    //   const arrPhotos = item.photos
    //   arrPhotos.forEach(element => {
    //     let imageRef
    //     imageRef = storage().refFromURL(element)
    //     console.log('imageRef', imageRef);
    //     // let imageRef = storage.ref(element)
    //     imageRef.delete().then(() => {
    //       console.log("Deleted")
    //     }).catch(err => {
    //       // console.log('imageRef catch', imageRef);
    //       console.log(err)
    //     })
    //   })
    //   try {
    //     firbaseRef.update({
    //       photos: firestore.FieldValue.arrayRemove(...arrPhotos)
    //     })
    //   } catch (error) {
    //     console.log('error firestore.FieldValue.arrayRemove',error);
    //   }      
    // }

    // try {
    //   firbaseRef
    //   .delete()
    //   .then(() => {
    //     dispatch(updateDataTransport(true))
    //     Alert.alert(
    //       "Tрансорт удален",
    //       "",
    //       [
    //         { text: "Ок",
    //           // onPress: () => ,
    //         },
    //       ],
    //     )
    //     console.log('Tрансорт удален')
    //   });
    // } catch (error) {
    //   Alert.alert(
    //     "Ошибка удаления",
    //     "Попробуйте еще раз",
    //     [
    //       { text: "Ок",
    //         // onPress: () => ,
    //       },
    //     ],
    //   )
    //   console.log('Ошибка удаления', error)
    // }
  }

  const handleDeleteTransport = (id, item) => {
    // console.log('item.id', id)
    // console.log('item.data', id)
    //вместо этой функции открывать модалку и передавать в нее id для удаления
    Alert.alert(
      "Вы уверены что хотите удалить трансорт?",
      "",
      [
        { text: "Да",
          onPress: () => deleteTransport(id, item),
          style: 'cancel'
        },
        { text: "Нет",
        },
      ],
    )
  }

  function renderItem(item, index) {
    // console.log('--renderItem item', item);
    // console.log('--renderItem item', item.id);

    return (
      <View style={[]} key={index+'a'}>

        <TouchableOpacity style={[styles.trtItem]} onPress={()=> handlePress(item)}>
          {
            item?.photos && item.photos.length > 0 ?
              <Image source={{uri: item.photos[0]}} style={styles.trtImg}/>
            :
              <View style={styles.trtImg}>
                <IconCarSmOt/>
              </View>
          }
          <View style={[styles.iconEdit]}>
            <Icon name='edit' size={12} color={THEME.GREY400}/>
          </View>
        </TouchableOpacity>

      </View>
    )
  }

  return (
    <View style={[styles.container,{flexDirection: 'row',}]}>
      {
        data.length > 0 ? 
        data.map((item, index) => renderItem(item, index))
        :
        null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },
  iconEdit: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth:1,
    borderColor: THEME.GREY400,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: "center"
  },
  row: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  wrapper: {
    // backgroundColor: 'red',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: THEME.MAIN_COLOR,
    paddingVertical: 10
  },
  trtItem: {
    // backgroundColor: 'blue',
    // width: '90%',
    // flexDirection: 'row',
    // alignItems: 'center',
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  trtImg: {
    width: 50,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
    // overflow: 'hidden',
  },
  trtName: {
    paddingLeft: 15
  },
  textRow: {
    width: '85%',
    // backgroundColor: 'green',
  },
  icon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: THEME.MAIN_COLOR,
    borderRadius: 4,
    backgroundColor: THEME.MAIN_COLOR,
    // borderRadius: 35,
    // width: 60,
    // height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    color: '#fff',
    fontSize: normalize(10)
  },
  iconClose: {
    // backgroundColor: 'blue',
    width: '10%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E45E44',
    borderRadius: 4,
    // borderColor: THEME.BLUE_COLOR,
    borderWidth: 1,
    marginRight: 2
},



trtTitle: {
  fontSize: SIZE.normal_m,
  color: THEME.MAIN_COLOR,
  fontWeight: '900',
  paddingVertical: 10
},
});