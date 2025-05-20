import { AppDispatch, RootState } from "@/store/store";
import { Action, ThunkAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useEnhancedDispatch: () => AppDispatch = useDispatch;
export const useEnhancedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;


export type AppThunkPromise<T> = AppThunk<Promise<T>>;
