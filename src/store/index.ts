import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import rootReducer, { type RootState } from "./rootReducer";
import rootEpic from "./rootEpic";


const epicMiddleware = createEpicMiddleware();

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, 
    }).concat(epicMiddleware), 
  devTools: import.meta.env.DEV, 
});


epicMiddleware.run(rootEpic);


export type AppDispatch = typeof store.dispatch;


export type { RootState };

