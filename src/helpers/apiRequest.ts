import { setLogOut } from "@/store/reducers/user.reducer";
import store from "@/store/store";
import axios, { AxiosRequestConfig } from "axios";
import { END_POINT } from "./constants";
import { AuthSuccessResponse, GenericData, StoredKeys } from "./interfaces";

const instance = axios.create({
  baseURL: END_POINT,
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(StoredKeys.accessToken);
    if (token) {
      config.headers["access-token"] = token;
    }
    config.headers["u-f"] = "admin";
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Error in JWT");
    if (error.response.data.Msg === "jwt expired" && !originalRequest._retry) {
      console.log("JWT Expire");
      originalRequest._retry = true;

      try {
        console.log(`${END_POINT}/auth/login/refresh-token`);
        const refreshResponse = await axios.post<
          GenericData<AuthSuccessResponse>
        >(`${END_POINT}/auth/login/refresh-token`, {
          refreshToken: localStorage.getItem(StoredKeys.refreshToken),
        });

        // if token API returns new token
        if (refreshResponse.status === 200) {
          // save new token to localStorage
          localStorage.setItem(
            StoredKeys.accessToken,
            refreshResponse.data.data.accessToken
          );
          localStorage.setItem(
            StoredKeys.refreshToken,
            refreshResponse.data.data.refreshToken
          );

          // update authorization header with new token
          originalRequest.headers["access-token"] =
            refreshResponse.data.data.accessToken;

          // retry original request with new token
          return instance(originalRequest);
        } else {
          // token API failed to return new token
          store.dispatch(setLogOut());
          throw new Error("Failed to refresh token");
        }
      } catch (e) {
        store.dispatch(setLogOut());
        // token API call failed
        throw new Error("Failed to refresh token");
      }
    } else {
      console.log("Error in JWT response: ", error.response.data);
      console.log("Error in JWT message: ", error.response.data.Msg);
    }

    if (error.response.data.Msg === "invalid token") {
      console.log("Invalid Token, logging out");
      store.dispatch(setLogOut());
    }

    // for any other error, throw it
    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    console.log("****************************************");
    console.log(JSON.stringify(config));
    console.log(localStorage.getItem(StoredKeys.accessToken));
    console.log("****************************************");
    const response = await instance(config);
    return response.data;
  } catch (error) {
    const errorObj: any = error;
    console.log("Error in API Request: ", errorObj);
    throw new Error(
      errorObj.response?.data.message ||
        errorObj.response?.data.error ||
        "Something went wrong"
    );
  }
};
