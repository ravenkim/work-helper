import createSagaMiddleware from 'redux-saga'
import { configureStore, Tuple } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { themeReducer } from '@/global/theme/themeReducer'

// import { routerSaga, routerSlice } from './router/routerReducer'
// import { themeSlice } from '../shared/components/theme/themeReducer'

const reducers = {
    // routerReducer: routerSlice.reducer,
    themeReducer: themeReducer,
}

export function* rootSaga() {
    yield all([])
}

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: reducers,
    middleware: () => new Tuple(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

sagaMiddleware.run(rootSaga)
export default store
