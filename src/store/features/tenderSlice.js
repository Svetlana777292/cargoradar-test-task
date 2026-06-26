import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  trackingRefresh: false,
  userReplies: [],
}

export const tenderSlice = createSlice({
  name: 'tender',
  initialState,
  reducers: {
    setTenderRefresh: (state, action) => {
      state.trackingRefresh = action.payload
    },
    setTenderReplyes: (state, action) => {
      // console.log('\x1b[36m%s %s\x1b[36m','Redux: setTenderReplyes ', state.userReplies.length, state.userReplies, '\n', action.payload)
      if(state.userReplies.length == 0) {
        state.userReplies = action.payload
      } else {

        let arr = []
        let arrUpd = []
        let arrUsRepl = state.userReplies.slice()
        action.payload.forEach((elem, index) => {
          if(elem == undefined || elem == null) return 

          let filteredObj = arrUsRepl.find((elemFind, index) => 
            elem.id == elemFind.id
          )
          // console.log('Redux filteredObj', filteredObj)
          if(filteredObj == undefined) {
            // console.log('Redux найден новый эл-т, добавляем его, filteredObj == undefined', 'elem:', elem)            
            arr.push(elem)
          }
          if(filteredObj !== undefined) {
            // console.log('Redux update эл-т, меняем его его, filteredObj !== undefined', 'elem:', elem)
            // arr.push(elem)
            arrUpd = arrUsRepl.filter(elem => elem.id == filteredObj.id)
            arr.push(elem)
            // console.log('1 arrUsRepl', arrUsRepl)
            // arrUsRepl.slice(index, 1, elem)
            // console.log('2 arrUsRepl', arrUsRepl)
          }
        })
        // console.log('Redux  arr, arrUpd:', arr, arrUpd)
        // console.log('\x1b[33m%s %s\x1b[33m', 'Redux  arrUsRepl:', arrUsRepl.length, arrUsRepl)
        state.userReplies = arrUpd.concat(arr)


        // let newArr = []
        // state.userReplies.forEach(elem => {
        //   let findItem = action.payload.find(item => {
        //     if(item.id !== elem.id) newArr.push(item)
        //   })
        // })
        // state.userReplies = state.userReplies.concat(newArr)

      }      
    },
    setTenderReplyesReset: (state, action) => {
      state.userReplies = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTenderRefresh, setTenderReplyes, setTenderReplyesReset} = tenderSlice.actions

export default tenderSlice.reducer