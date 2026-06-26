import React  from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView  } from 'react-native';

//packages

//functions && features && slice
import { width } from '../../util/helperConst';

//components

//styles
import { THEME, mainstyles } from '../../theme';
import { normalize } from '../../util/UI/fontsUI';

export const CarsList = (props) => {
  const {data, onOpenGallery} = props;
  console.log('CarsList data',data);
  
  const handleShowGallery = (index, item) => {
    // console.log('item', item)
    onOpenGallery(index,item)
  }

  return (
    <View style={[styles.container]}>
      {
        data && data?.length > 0 ? data.map((item,index)=>(

        <View key={index+'cr'} style={[styles.inner]}>
          <View style={[mainstyles.rowalC,{justifyContent: 'flex-start', flexWrap: 'wrap', }]}>
            <View style={[styles.itemBox]}>
              <Text style={[mainstyles.text10R,styles.textTitle]}>Марка и модель</Text>
              <Text style={[mainstyles.text14M,styles.descr]}>{item?.modelVehicle}</Text>
            </View>
            <View style={[styles.itemBox]}>
              <Text style={[mainstyles.text10R,styles.textTitle]}>Тип авто</Text>
              <Text style={[mainstyles.text14M,styles.descr]}>{item?.typeVehicle}</Text>
            </View>
            {
             item?.numVehicle && item?.numVehicle?.length > 0 ? 
              <View style={[styles.itemBox]}>
                <Text style={[mainstyles.text10R,styles.textTitle]}>Госномер</Text>
                <Text style={[mainstyles.text14M,styles.descr]}>{item?.numVehicle}</Text>
              </View>
              : null
            }
            <View style={[styles.itemBox]}>
              <Text style={[mainstyles.text10R,styles.textTitle]}>Год выпуска</Text>
              <Text style={[mainstyles.text14M,styles.descr]}>{item?.yearVehicle}</Text>
            </View>
            <View style={[styles.itemBox]}>
              <Text style={[mainstyles.text10R,styles.textTitle]}>Грузоподъемность (т.)</Text>
              <Text style={[mainstyles.text14M,styles.descr]}>{item?.weight}</Text>
            </View>
            {
             item?.volume && item?.volume?.length > 0 ? 
              <View style={[styles.itemBox]}>
                <Text style={[mainstyles.text10R,styles.textTitle]}>Объем (м3)</Text>
                <Text style={[mainstyles.text14M,styles.descr]}>{item?.volume}</Text>
              </View>
              : null
            }
          </View>

          <ScrollView style={[styles.imgArrContainer]} contentContainerStyle={[{flexDirection: 'row'}]} horizontal>
            {
              item?.photos && item?.photos?.length > 0  ?
              item?.photos.map((elem,index)=>(
                <TouchableOpacity key={index+'imgm'} style={[styles.rowItem]} onPress={()=>handleShowGallery(index,item?.photos)}>
                  <Image source={{uri: elem}} style={[styles.img]} />
                </TouchableOpacity>
              ))

              : null
            }
          </ScrollView>

        </View>
        ))

        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: 'orange',
    marginHorizontal: 10,
    // paddingTop: 15,
    borderTopColor: '#fff',
    borderTopWidth: 1
  },
  inner: {
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomColor: '#ffffff',
    borderBottomWidth:1,
    // backgroundColor: 'pink',
  },
  itemBox: {
    width: '33%',
    // backgroundColor: 'pink',
    paddingBottom: 8
  },
  textTitle: {
    fontSize: normalize(12),
    fontWeight: '300',
    color: '#ffffff',
    paddingBottom: 5
  },
  descr: {
    color: '#ffffff',
  },
  imgArrContainer: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    paddingTop: 10,
  },
  rowItem: {
    // backgroundColor: 'blue',
    marginHorizontal: 3
  },
  img: {
    borderRadius: 10,
    height: width/4,
    width:  width/4-15,
  },
  close: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    // alignItems: 'flex-end',
    // justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    right: 15,
    top: 15,
  },
  qwe: {},
})