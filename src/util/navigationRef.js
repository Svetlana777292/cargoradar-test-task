import { createNavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = createNavigationContainerRef()

export function navigateRef(name, params) {
  if (navigationRef.isReady()) {
    console.log('\x1b[43m%s %s\x1b[0m','nav is ready', navigationRef.isReady())
    // Perform navigation if the react navigation is ready to handle actions
    navigationRef.navigate(name, params);
  } else {
    console.log('\x1b[43m%s %s\x1b[0m', ' else navigationRef.isReady()', navigationRef.isReady(), navigationRef.current?.getRootState());
    
    // You can decide what to do if react navigation is not ready
    // You can ignore this, or add these actions to a queue you can call later
  }
}