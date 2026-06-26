

export function onPressZoom(region, setregion,setregionstate=null, ref, flag, srtr, rd) {
  // console.log('1 region', region.latitudeDelta, region.longitudeDelta )
  if(region !== null) {

    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: flag ? region.latitudeDelta / 2 : region.latitudeDelta * 2,
      longitudeDelta: flag ? region.longitudeDelta / 2 : region.longitudeDelta * 2,
    }
    // console.log('2 newRegion', newRegion.latitudeDelta, newRegion.longitudeDelta )
    setregion(newRegion)
    setregionstate!==null ? setregionstate(newRegion) :null
    // if(rd !== undefined && rd !==null) {
    //   let r = flag ? rd/2 : rd*2
    //   console.log('r', r)
    //   srtr(r)
    // }
    ref.current.animateToRegion(newRegion, 200)
  }
}

// export function onPressZoomOut(region, setregion, ref) {
//     let newRegion = {
//       latitude: region.latitude,
//       longitude: region.longitude,
//       latitudeDelta: region.latitudeDelta * 2,
//       longitudeDelta: region.longitudeDelta * 2,
//     }
//     setregion(newRegion)
//     ref.current.animateToRegion(newRegion, 200)
//   }