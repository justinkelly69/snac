import { configureStore } from '@reduxjs/toolkit'
import snacSlice from './reducer'

const store = configureStore({
  reducer: {
    snac: snacSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export default store