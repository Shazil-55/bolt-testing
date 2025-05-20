import { apiRequest } from "@/helpers/apiRequest";
import { AuthSuccessResponse, GenericData, User } from "@/helpers/interfaces";
import { AppThunkPromise } from "@/helpers/reduxHooks";
import FuseMessage from "@fuse/core/FuseMessage";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import * as ReducerActions from "../reducers";

export const loginOrSignup = (
  email: string,
  password: string
): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try {
      const body = {
        email: email.toLowerCase(),
        password,
      };
      const res = await apiRequest<GenericData<AuthSuccessResponse>>({
        url: `/auth/admin/login`,
        method: "POST",
        data: body,
      });

      dispatch(ReducerActions.setTokens(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};

export const getAllUsers = (): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try {
      const res = await apiRequest<GenericData<User[]>>({
        url: `/admin/users`,
        method: "GET",
      });

      dispatch(ReducerActions.setAllUsers(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};

export const deleteUser = (userId: string): AppThunkPromise<string | void> => {
  return async (dispatch, getStore) => {
    try {
      apiRequest<GenericData<User[]>>({
        url: `/admin/user/${userId}`,
        method: "DELETE",
      });

      dispatch(
        showMessage({
          message: "User deleted successfully", //text or html
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "right", //left center right
          },
          variant: "success", //success error info warning null
        })
      );

      dispatch(
        ReducerActions.setAllUsers(
          getStore().User.allUsers.filter((user) => user.id !== userId)
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
      }
    }
  };
};

export const blockUser = (
  userId: string,
  blockDevice: boolean
): AppThunkPromise<string | void> => {
  return async (dispatch, getStore) => {
    try {
      await apiRequest<GenericData<User[]>>({
        url: `/admin/customer/block`,
        method: "POST",
        data: {
          id: userId,
          blockDevice,
        },
      });

      dispatch(
        showMessage({
          message: "User blocked successfully", //text or html
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "right", //left center right
          },
          variant: "success", //success error info warning null
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
      }
    }
  };
};

export const unBlockUser = (userId: string): AppThunkPromise<string | void> => {
  return async (dispatch, getStore) => {
    try {
      await apiRequest<GenericData<User[]>>({
        url: `/admin/user/${userId}/unban`,
        method: "PUT",
      });

      dispatch(
        showMessage({
          message: "User unblocked successfully", //text or html
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "right", //left center right
          },
          variant: "success", //success error info warning null
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
      }
    }
  };
};
