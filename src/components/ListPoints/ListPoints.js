import React,{ useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

//packages
import { useNavigation } from '@react-navigation/native';
import DraggableFlatList, {OpacityDecorator, } from 'react-native-draggable-flatlist'
import Icon from '@react-native-vector-icons/entypo';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from 'react-redux';

//functions && features && slice
import { askDelPoint, height, width } from '../../util/helperConst';
import {findJsonObj} from './../../util/tools'

//components
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import { BtnIconTrs } from '../Buttons/BtnIconTrs';
import IconBurgerMenu from '../Svg/IconBurgerMenu';
import { DefaultBtn } from '../Buttons/DefaultBtn';
import IconPinSmallFill from '../Svg/IconPinSmallFill';
import { HeaderTitleComponent } from '../Headers/HeaderTitleComponent';
import InfoAskWindow from '../Modal/InfoAskWindow'
import IconEdit from '../Svg/IconEdit';

//styles
import { THEME, mainstyles } from '../../theme';

const ListPoints = (props) => {
  console.log('ListPoints', )
  const {
    point,
    data,
    onClose,
    onEdit,
    onDelete,
    onChangeIndex,
    nav
  } = props
  console.log('nav', nav,'point',point)
  // console.log('data',data)
  const safeInsets = useSafeAreaInsets();
  // const dataTender = nav ==='createTender' ? useSelector(state=> state.addTender.tender) : ( nav ==='createRoute' ? useSelector(state=> state.addRoute.tender) : ( nav ==='editTender' ? useSelector(state=> state.editTender.tender) : useSelector(state=> state.editRoute.tender)))
  // console.log('dataTender', dataTender)
  
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const [dataPoints, setDatapoints] = useState([])
  const [delIndex, setDelIndex] = useState(null)
  const [isDisable, setIsDisable] = useState(false)
  const [isDelAskVisible, setIsDelAskVisible] = useState(false)
  const navigation = useNavigation()

  const handlePress = () => {
    //let nav = 'CreateStartPoint'
    switch (nav) {
      case 'createTender':
        point==='start'? navigation.navigate('CreateStartPoint'): navigation.navigate('CreateEndPoint')
        break;
      case 'editTender':
        point==='start'? navigation.navigate('EditStartPoint',{firstOpen: false}): navigation.navigate('EditEndPoint',{firstOpen: false}) //добавить объект {data: {item: item, index: index, type: point, action: 'edit'}}
        break;
      case 'createRoute':
        navigation.navigate('CreateRoutePoint',{firstOpen: false,type: point})
        break;
      case 'editRoute':
        navigation.navigate('EditRoutePoint',{firstOpen: false,type: point})
        break;
    
      default:
        break;
    }
    onClose()
  }

  const handleDeletePoint = (index,point) => {
    console.log('index', index)
    let arr = dataPoints.slice()
    arr.splice(index,1)
    setDatapoints(arr) 
    onDelete(index,point)
    setIsDelAskVisible(false)
  }

  const handleChangeIndex = (value) => {
    setDatapoints(value)
    onChangeIndex({type: point,data: value})
  }

  useEffect(()=>{
    // console.log('data.startPoints?.length+data.endPoints?.length', data.startPoints?.length+data.endPoints?.length)
    // console.log('data.startPoints?.length+data.endPoints?.length === 10&&data.startPoints?.length<=9', data.startPoints?.length+data.endPoints?.length === 10&&data.startPoints?.length<=9)
    console.log('useEffect show data',data)
    if(point==='start') {
      setDatapoints(data.startPoints)

      if(data.startPoints?.length+data.endPoints?.length === 10) {
        setIsDisable(true)

      } else if (data.startPoints?.length === 9) {
        setIsDisable(true)
      } else  {
        setIsDisable(false)
      }

    } else if(point==='end') {
      setDatapoints(data.endPoints)
      
      if(data.startPoints?.length+data.endPoints?.length === 10) {
        setIsDisable(true)

      } else if (data.endPoints?.length === 9) {
        setIsDisable(true)
      } else  {
        setIsDisable(false)
      }
    }
  },[nav,data,point])

  const renderItem = (props) => {
    const {item, getIndex,drag,isActive} = props
    const index = getIndex()
    console.log('renderItem item', index)
    // item, index,drag,isActive
    return (
      <OpacityDecorator>
        <View style={[styles.wrapper,{backgroundColor: isActive? THEME.GREY100: '#fff'}]}>
          <View style={styles.left}>
            {
              point=='start'?
                <IconPinSmallOt />
                :
                <IconPinSmallFill/>
            }
          </View>
          <View style={styles.mid}>
            <Text>{item.address}</Text>
          </View>
          <View style={styles.right}>
            <BtnIconTrs onPress={()=>{onEdit(item,index,point)}}>
              <IconEdit color={THEME.GREY400} size={20}/>
              {/* <Image source={require('../../../assets/image/icon016.png')} style={{width:20,height: 20}}/> */}
            </BtnIconTrs>
            <BtnIconTrs onPress={()=>{setIsDelAskVisible(true),setDelIndex(index)}}>
              <Icon name={'cross'} size={20} color={'#fff'} style={styles.close}/>
            </BtnIconTrs>
            <TouchableOpacity onLongPress={drag} style={styles.btnMenu}>
              <IconBurgerMenu color={THEME.GREY400} />
            </TouchableOpacity>
          </View>
        </View>
      </OpacityDecorator>
    )
  }

  return (               
    <View style={[styles.bottomWrapper,{paddingTop: safeInsets.top,}]}>
      <HeaderTitleComponent  title={point=='start'? 'Список точек загрузки':'Список точек разгрузки'} onPress={onClose} customStyle={{}}/>
      <View style={styles.inner}>
        <View style={{flex:1}}>
          <DraggableFlatList
            style={[styles.flatList, ]}
            data={dataPoints}
            keyExtractor={(item, index) => index+'keyItem'}
            // onDragBegin={() => setOuterScrollEnabled(false)}
            // onDragEnd={({ data }) => {
            //   setData(data);
            //   setOuterScrollEnabled(true);
            // }}
            // simultaneousHandlers={scrollView}
            activationDistance={20}
            onDragEnd={({ data }) => {handleChangeIndex(data) }} //setOuterScrollEnabled(true)
            renderItem={({item, getIndex,drag,isActive}) => renderItem({item, getIndex,drag,isActive})}
          />

        </View>
        <View style={styles.btn}>
          <DefaultBtn title={point=='start'?'Добавить точку загрузки':'Добавить точку разгрузки'} disabled={isDisable} onPress={handlePress}/>
        </View>
      </View>
      {
        isDelAskVisible ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height}]}>
          <InfoAskWindow data={findJsonObj(jsonDataPrompt,'askDelPoint', askDelPoint)
            } onPress={()=>handleDeletePoint(delIndex,point)} onClose={()=>{setIsDelAskVisible(false),setDelIndex(null)}}/>
        </View>
        :null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  
  bottomWrapper: {
    position: 'absolute',
    bottom: 0,
    // flex: height,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    // alignItems: 'center',
    // borderTopRightRadius:25,
    // borderTopLeftRadius:25,
    // paddingHorizontal: 30,
    zIndex: 999
  },
  inner: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'pink'
  },
  flatList: {
    backgroundColor: '#fff',
    width: '100%'
  },
  wrapper: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  left: {
    // backgroundColor: 'red',
    width: '10%',
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mid: {
    // backgroundColor: 'pink',
    width: '60%',
    paddingLeft: 5
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  right: {
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    backgroundColor: THEME.GREY400,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  btn: {
    marginBottom: 20,
    alignSelf: 'center', 
    alignContent: 'flex-end',
  },
  btnMenu: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },


  //!!!!!!
  container: {
    flex: 1,
    position: 'relative',
    width: width,
    backgroundColor: '#fff',
    justifyContent: 'flex-end'
  },
  topBar: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  whiteComponent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 7,
  },
  midWrapperContent: {
    backgroundColor: 'pink',
    paddingVertical: 20,
    marginBottom: 20,
  },
  midTopInner: {
    backgroundColor: 'yellow',
    width: '100%',
    flexDirection: 'row',
  },
  leftContainer: {
    backgroundColor: 'red',
    paddingLeft: 23,
    paddingRight: 13,
    width: '15%',
    // paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vertLine: {
    width: 1.7,
    height: 35,
    backgroundColor: THEME.PRIMARY,
    marginVertical: 6
  },
  rightContainer: {
    backgroundColor: 'blue',
    width: '85%',
  },
  addressItem: {
    backgroundColor: 'yellow',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    paddingRight: 20
  },
  addressItemBottom: {
    backgroundColor: 'green',
    borderBottomWidth: 0,
  },
  btnAddressContainer: {
    backgroundColor: 'blue', 
    width: '30%', 
    alignItems: 'center',
    justifyContent: 'flex-end', 
    flexDirection: 'row'
  },
  textAddress: {
    width: '70%',
    color: THEME.GREY900, 
    paddingHorizontal: 5,
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth:1,
    borderTopColor: THEME.GREY300,    
  },
  btnRow: {
    // backgroundColor: 'red',
    width: width-60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  btnCustomStyle: {
    height: 55, 
    borderRadius: 50,
    // paddingHorizontal: 40,
    // paddingVertical: 16
  },
  titleSection: {
    padding: 20,
    marginBottom: 20
  },
  titleWrapper: {
    backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 12,
  },
  inputTitle: {
    padding: 0,
    backgroundColor: 'red',
    width: '85%',
  },
  discrWrapper: {
    backgroundColor: 'purple',
    paddingTop: 12,
  },
  desctInput: {
    color: THEME.GREY800,
    alignItems: 'center',
  },
  inputCounterStr: {
    color: THEME.GREY300,
    position: 'absolute',
    top: 12,
    right: 0
  },
})
export default ListPoints