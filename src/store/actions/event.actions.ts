import { apiRequest } from "@/helpers/apiRequest";
import { AuthSuccessResponse, Events, EventStatus, GenericData, User } from "@/helpers/interfaces";
import { AppThunkPromise } from "@/helpers/reduxHooks";
import FuseMessage from "@fuse/core/FuseMessage";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import * as ReducerActions from "../reducers";


export const getAllEvents = (): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try {
      const res = await apiRequest<GenericData<Events[]>>({
        url: `/admin/events`,
        method: "GET",
      });

      dispatch(ReducerActions.setEventsData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};


export const UpdateEvent = (id : string , body: Partial<Events>): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try { 
      await apiRequest<GenericData<Events[]>>({
        url: `/admin/event/${id}`,
        method: "PUT",
        data: body,
      });
      
      getAllEvents()
      // dispatch(ReducerActions.setEventsData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};


export const CreateEvent = (body: Partial<Events>): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try { 
      await apiRequest<GenericData<Events[]>>({
        url: `/admin/event`,
        method: "POST",
        data: body,
      });
      
      getAllEvents()
      // dispatch(ReducerActions.setEventsData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};

export const UpdateClass = (id : string , status: EventStatus): AppThunkPromise<string | void> => {
  return async (dispatch) => {
    try { 
      const res = await apiRequest<GenericData<Events[]>>({
        url: `/admin/class/${id}`,
        method: "PUT",
        data: {eventStatus:status},
      });

      dispatch(ReducerActions.setEventsData(res.data));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        return error.message;
      }
    }
  };
};
