import React, { useEffect } from 'react';
import {FlatList, StyleSheet, Text, View,} from 'react-native';
import { THEME, mainstyles } from '../theme';

export function DescriptionComponent({
  points,
  description
}) {
  // console.log('color2', color2)

  return (
    <View style={[styles.container,mainstyles.shadowG5r8]}>
      {
        description!==undefined&&description!==null&&description?.trim().length > 0?
        <Text style={[mainstyles.text14R]}>{description}</Text>
        : null
      }
      {
        points?.length > 0?
        <FlatList 
          data={points}
          keyExtractor={(item, index) => index+'qq7'}
          renderItem={({item, index}) => {
            // console.log('item', item)
            return (
          <Text style={[mainstyles.text14R]}>{item}</Text>          
          )}}
        />
        : null
      }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    minHeight: 115,
    borderRadius: 27,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.3)',
    elevation: 5,
    marginBottom: 15
  },
  qwe: {
  },
});