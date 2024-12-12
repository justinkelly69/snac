import { createSlice } from '@reduxjs/toolkit'

const snacSlice = createSlice({
    name: 'snac',
    initialState: [],
    reducers: {
        snacReplace(state, action) {

        },
    }
})

export const { snacReplace } = snacSlice.actions
export default snacSlice.reducer