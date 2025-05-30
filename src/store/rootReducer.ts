import { combineSlices } from '@reduxjs/toolkit';
import apiService from './apiService';
import { navigationSlice } from '@/components/theme-layouts/components/navigation/store/navigationSlice';
import { UserSlice } from './reducers/user.reducer';

// @ts-ignore-next-line
export interface LazyLoadedSlices {}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	navigationSlice,
	UserSlice,
	/**
	 * Lazy loaded slices
	 */
	{
		[apiService.reducerPath]: apiService.reducer
	}
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;
