import { apiRequest } from "@/helpers/apiRequest";
import { AuthSuccessResponse, Classes, CreateClassInterface, CustomPackage, EventStatus, GenericData, UpdateClassInterface, User } from "@/helpers/interfaces";
import { AppThunkPromise } from "@/helpers/reduxHooks";
import FuseMessage from "@fuse/core/FuseMessage";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import * as ReducerActions from "../reducers";


export const getAllClasses = (): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try {
      const res = await apiRequest<GenericData<Classes[]>>({
        url: `/admin/classes`,
        method: "GET",
      });

      dispatch(ReducerActions.setClassesData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};


export const UpdateClass = (id : string , body: Partial<UpdateClassInterface>): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try { 
      const res = await apiRequest<GenericData<Classes[]>>({
        url: `/admin/class/${id}`,
        method: "PUT",
        data:body,
      });

      dispatch(ReducerActions.setClassesData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};

export const UpdateCustomPackages = (id : string , body: Partial<CustomPackage[]>): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try { 
      const res = await apiRequest<GenericData<Classes[]>>({
        url: `/admin/class-package/${id}`,
        method: "PUT",
        data:body,
      });

      dispatch(ReducerActions.setClassesData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};


export const CreateClass = (body: Partial<CreateClassInterface>): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try { 
      await apiRequest<GenericData<void>>({
        url: `/admin/class`,
        method: "POST",
        data: body,
      });
      
      getAllClasses()
      // dispatch(ReducerActions.setEventsData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};
