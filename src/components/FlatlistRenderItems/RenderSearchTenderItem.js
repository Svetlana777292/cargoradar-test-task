import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { renderItemsStyles } from '../../../styles/renderItemsStyles';
import { THEME, mainstyles } from '../../theme';
import { AddressPointsView } from '../AddressPointsView';

export const RenderSearchTenderItem = (props) => {

  const { indexItem,isActiveTab,bgWithIndex,itemTender,dataLength,isShowInformer,earliestDate,latestDate,onPress } = props;

  return (
    <TouchableOpacity style={[renderItemsStyles.itemContainer, 
      {backgroundColor: isActiveTab!==2 ?(bgWithIndex ==0 ? '#fff': THEME.GREY100):(bgWithIndex ==0 ? '#fff': '#FCF0E0'), marginBottom: indexItem === dataLength-1 ? 60:0},
      // {backgroundColor: 'pink'}
    ]}
     onPress={() => onPress(itemTender)}
     >
      {
        isShowInformer === true ?
        <View style={renderItemsStyles.infoMarker}/>
        :
        null
      }
      <View style={[renderItemsStyles.inner]} >
        {__DEV__&&<>
            <Text style={[mainstyles.text16M,{color: THEME.GREY900}]}>id: {itemTender.id} </Text>
            <Text style={[mainstyles.text16M,{color: THEME.GREY900}]}>userId: {itemTender.userId} </Text>
          </>}
        <View style={[mainstyles.row, renderItemsStyles.titleItemContainer,]} >
          <Text style={[mainstyles.text16M,renderItemsStyles.textColorD,renderItemsStyles.titleTextTender]}>{itemTender?.name}</Text>
          <View style={[renderItemsStyles.priceTextTender]}>
            <Text style={[mainstyles.text16M,{color: THEME.GREY900}]}>{itemTender?.price} руб.</Text>
          </View>
        </View>
        <View style={[{}]} >
          <AddressPointsView disable={true} type={'start'} data={itemTender.startPoints} length={itemTender.startPoints.length} onPress={()=>{}}/>
          <AddressPointsView disable={true} type={'end'} data={itemTender.endPoints} length={itemTender.endPoints.length} onPress={()=>{}}/>
        </View>        
        <View style={[mainstyles.rowalCjcSb,{ backgroundColor: 'transparent'}]} >
          <View style={[renderItemsStyles.buttonDatail, mainstyles.rowalCjcC]} >
          <Text style={[mainstyles.text14R]}>{earliestDate}-{latestDate}</Text>
          </View>
          <Text style={[mainstyles.text16M]}>{itemTender.route.distance} км</Text>
        </View>
      </View>     
    </TouchableOpacity>      
  )
}