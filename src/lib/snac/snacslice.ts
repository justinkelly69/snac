import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { clone } from './snac'
import { SNACItem } from './types'

// Define a type for the slice state
export interface SNACState {
    value: SNACItem[]
}

// Define the initial state using that type
const initialState: SNACState = {
    value: []
}

export const snacSlice = createSlice({
    name: 'snac',
    initialState,
    reducers: {
        findReplaceSingle: (state, action: PayloadAction<number>) => {
            state.value = []
        },
        findReplaceMultiple: (state, action: PayloadAction<number>)  => {
            state.value = []
        },
    }
})

// Action creators are generated for each case reducer function
export const { findReplaceSingle, findReplaceMultiple } = snacSlice.actions
export const selectSNAC = (state: SNACState) => state.value

export default snacSlice.reducer

// Other code such as selectors can use the imported `RootState` type
