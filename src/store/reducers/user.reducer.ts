import { StoredKeys, UserStore } from "@/helpers/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserStore = {
	isAuth: localStorage.getItem(StoredKeys.accessToken) ? true : false,
	userData: null,
	accessToken: localStorage.getItem(StoredKeys.accessToken) || null,
	refreshToken: localStorage.getItem(StoredKeys.refreshToken) || null,
	allUsers: null,
	events: null,
	classes: null,
	activities: null,
	faqs: null,
	innerFaqs: null,
};

export const UserSlice = createSlice({
	name: "User",
	initialState,
	reducers: {
		setTokens(state, action) {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.isAuth = true;
			localStorage.setItem(StoredKeys.accessToken, action.payload.accessToken);
			localStorage.setItem(
				StoredKeys.refreshToken,
				action.payload.refreshToken
			);
		},
		setUserData(state, action) {
			state.userData = action.payload.userData;
		},
		setEventsData(state, action) {
			state.events = action.payload;
		},
		setActivities(state, action) {
			state.activities = action.payload;
		},
		setFaqs(state, action) {
			state.faqs = action.payload;
		},
		setInnerFaqs(state, action) {
			console.log("Action", action.payload);
			state.innerFaqs = action.payload;
		},
		setClassesData(state, action) {
			state.classes = action.payload;
		},
		setLogOut(state) {
			state.userData = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuth = false;

			localStorage.removeItem(StoredKeys.accessToken);
			localStorage.removeItem(StoredKeys.refreshToken);
		},
		setAllUsers(state, action) {
			state.allUsers = action.payload;
		},
	},
});

export const {
	setUserData,
	setTokens,
	setLogOut,
	setAllUsers,
	setEventsData,
	setClassesData,
	setActivities,
	setFaqs,
	setInnerFaqs,
} = UserSlice.actions;

export const UserReducer = UserSlice.reducer;
