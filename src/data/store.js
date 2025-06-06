import { configureStore, createSlice } from '@reduxjs/toolkit'



let img = createSlice({
    name : 'img',
    initialState: 'https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800'
})

export default configureStore({
  reducer: { 
    img : img.reducer
  }
}) 