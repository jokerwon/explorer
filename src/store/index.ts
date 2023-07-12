import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './global'

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
