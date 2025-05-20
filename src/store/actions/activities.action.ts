import { apiRequest } from "@/helpers/apiRequest";
import {
	Activities,
	AuthSuccessResponse,
	Events,
	EventStatus,
	GenericData,
	User,
} from "@/helpers/interfaces";
import { AppThunkPromise } from "@/helpers/reduxHooks";
import FuseMessage from "@fuse/core/FuseMessage";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import * as ReducerActions from "../reducers";
import { AppThunk } from "../store";
import axios from "axios";
import { END_POINT } from "@/helpers/constants";

export const getAllActivities = (): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<Events[]>>({
				url: `/admin/activities`,
				method: "GET",
			});

			dispatch(ReducerActions.setActivities(res.data));
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const deleteActivity = (
	activityId: string
): AppThunkPromise<string | void> => {
	return async (dispatch, getStore) => {
		try {
			const res = await apiRequest<GenericData<User[]>>({
				url: `/admin/activity/${activityId}`,
				method: "DELETE",
			});

			dispatch(
				showMessage({
					message: "Activity deleted successfully", //text or html
					anchorOrigin: {
						vertical: "top", //top bottom
						horizontal: "right", //left center right
					},
					variant: "success", //success error info warning null
				})
			);

			dispatch(
				ReducerActions.setActivities(
					getStore().User.activities.filter((item) => item.id !== activityId)
				)
			);
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				if (error.message.includes("foreign key")) {
					dispatch(
						showMessage({
							message:
								"This activity is being used in some Event/Class . Unable to delete it", //text or html
							anchorOrigin: {
								vertical: "top", //top bottom
								horizontal: "right", //left center right
							},
							variant: "error", //success error info warning null
						})
					);
				}
			}
		}
	};
};

export const UpdateActivity = (
	id: string,
	activity: Partial<Activities>
): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<Activities[]>>({
				url: `/admin/activity/${id}`,
				method: "PUT",
				data: activity,
			});

			getAllActivities();
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const CreateActivity = (
	activity: Partial<Activities>
): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<Activities[]>>({
				url: `/admin/activity`,
				method: "POST",
				data: activity,
			});

			getAllActivities();
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const uploadImageToAWSAndGetLink =
	(file: File): AppThunk<Promise<string>> =>
	async () => {
		try {
			const formData = new FormData();
			formData.append("fileToUpload", file);
			const res = await axios.post<{ data: string }>(
				`${END_POINT}/common/upload-file`,
				formData,
				{
					headers: {
						"access-token": localStorage.getItem("jwt_access_token"),
					},
				}
			);

			// console.log('-----------', res.data.data);
			if (!res.data.data) return "Error Uploading Image";

			return res.data.data;
		} catch (error) {
			return "Error Uploading Image";
		}
	};
