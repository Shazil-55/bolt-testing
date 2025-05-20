import { apiRequest } from "@/helpers/apiRequest";
import {
	Faqs,
	AuthSuccessResponse,
	Events,
	EventStatus,
	GenericData,
	User,
	InnerFaq,
} from "@/helpers/interfaces";
import { AppThunkPromise } from "@/helpers/reduxHooks";
import FuseMessage from "@fuse/core/FuseMessage";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import * as ReducerActions from "../reducers";
import { AppThunk } from "../store";
import axios from "axios";
import { END_POINT } from "@/helpers/constants";

export const getAllFaqs = (): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<Faqs[]>>({
				url: `/admin/faqs`,
				method: "GET",
			});

			dispatch(ReducerActions.setFaqs(res.data));
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const getFaqWithParentId = (
	id: string
): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<InnerFaq>>({
				url: `/admin/faqs/${id}`,
				method: "GET",
			});

			dispatch(ReducerActions.setInnerFaqs(res.data.data));
			return res.data.parentName;
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const getFaqParentName = (id: string): AppThunkPromise<string> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<string>>({
				url: `/admin/faqs/parent-name/${id}`,
				method: "GET",
			});

			return res.data;
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const deleteFaq = (faqId: string): AppThunkPromise<string | void> => {
	return async (dispatch, getStore) => {
		try {
			const res = await apiRequest<GenericData<User[]>>({
				url: `/admin/faq/${faqId}`,
				method: "DELETE",
			});

			dispatch(
				showMessage({
					message: "Faq deleted successfully", //text or html
					anchorOrigin: {
						vertical: "top", //top bottom
						horizontal: "right", //left center right
					},
					variant: "success", //success error info warning null
				})
			);

			dispatch(
				ReducerActions.setFaqs(
					getStore().User.faqs.filter((item) => item.id !== faqId)
				)
			);
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				if (error.message.includes("foreign key")) {
					dispatch(
						showMessage({
							message:
								"This faq is being used in some Event/Class . Unable to delete it", //text or html
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

export const UpdateFaq = (
	id: string,
	faq: Partial<Faqs>
): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<Faqs[]>>({
				url: `/admin/faq/${id}`,
				method: "PUT",
				data: faq,
			});

			getAllFaqs();
		} catch (error) {
			if (error instanceof Error) {
				console.log("error", error);
				return error.message;
			}
		}
	};
};

export const CreateFaq = (
	faq: Partial<Faqs>
): AppThunkPromise<string | void> => {
	return async (dispatch) => {
		try {
			const res = await apiRequest<GenericData<Faqs[]>>({
				url: `/admin/faq`,
				method: "POST",
				data: faq,
			});

			if (faq.parentId) {
				getFaqWithParentId(faq.parentId);
			} else {
				getAllFaqs();
			}
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
