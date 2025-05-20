import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import AuthWrapper from "@/components/AuthWrapper";
import { Fragment, useEffect, useState } from "react";
import * as Actions from "../../../store/actions/activities.action";
import { useEnhancedDispatch, useEnhancedSelector } from "@/helpers/reduxHooks";
import {
	Avatar,
	Button,
	Chip,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	LinearProgress,
	Paper,
} from "@mui/material";
import {
	DataGrid,
	GridToolbarExport,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { PRIMARY_GREEN } from "@/helpers/constants";
import moment from "moment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BlockIcon from "@mui/icons-material/Block";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Activities } from "@/helpers/interfaces";
import { DialogWrapper } from "@/helpers/DialogWrapper";
import { useDevice } from "@/helpers/useDevice";
import InputField from "@/helpers/InputField";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function Activity() {
	const { IsMob, IsTab, IsWeb } = useDevice();

	const dispatch = useEnhancedDispatch();

	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState("");
	const [Icon, setIcon] = useState<string | File>("");
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAddingNewActivity, setIsAddingNewActivity] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState<Activities>(null);

	const allActivity = useEnhancedSelector((state) => state.User.activities);

	useEffect(() => {
		getActivityData();
	}, []);

	async function getActivityData() {
		setIsLoading(true);
		await dispatch(Actions.getAllActivities());
		setIsLoading(false);
	}

	async function deleteThisActivity(id: string) {
		// setIsLoading(true);
		dispatch(closeDialog());
		dispatch(Actions.deleteActivity(id));
		// setIsLoading(false);
	}

	function handleCreateActivity(): void {
		setIsAddingNewActivity(true);
		setName("");
		setIcon("");
		setIsEditDialogOpen(true);
	}

	function handleUpdateActivity(row: any): void {
		console.log(row);
		setName(row.name);
		setIcon(row.icon);
		setSelectedActivity(row);
		setIsEditDialogOpen(true);
	}

	async function updateActivity(): Promise<void> {
		const body: Partial<Activities> = {
			name,
			icon: Icon,
		};
		console.log("Working");
		await dispatch(Actions.UpdateActivity(selectedActivity.id, body));
		setIsLoading(true);
		dispatch(closeDialog());
		setIsEditDialogOpen(false);
		await dispatch(Actions.getAllActivities());
		setIsLoading(false);
	}

	async function savActivity(): Promise<void> {
		let image = "";
		if (Icon instanceof File) {
			image = await dispatch(Actions.uploadImageToAWSAndGetLink(Icon));
		} else {
			image = Icon;
		}
		const body: Partial<Activities> = {
			name,
			icon: image,
		};
		console.log("Working");
		await dispatch(Actions.CreateActivity(body));
		setIsLoading(true);
		dispatch(closeDialog());
		setIsEditDialogOpen(false);
		await dispatch(Actions.getAllActivities());
		setIsLoading(false);
	}

	return (
		<AuthWrapper>
			<div className="p-28">
				<div className="flex justify-between">
					<h1>Activities Management</h1>
					<Button
						onClick={() => {
							handleCreateActivity();
						}}
						className="text-white"
						style={{ backgroundColor: "#28a745" }}
					>
						Create Activity
					</Button>
				</div>

				<Paper className="w-full mt-20 p-10 ">
					{isLoading && <LinearProgress />}

					<DataGrid
						sx={{ width: "100%" }}
						density="comfortable"
						disableRowSelectionOnClick
						rows={allActivity ?? []}
						// getRowClassName={(params) => {
						// 	return params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-[#eee]' : '';
						// }}
						style={{ marginTop: "20px", padding: "20px", paddingTop: "40px" }}
						loading={isLoading}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 30,
								},
							},
						}}
						pageSizeOptions={[5, 10, 30, 50, 100]}
						columns={[
							{
								flex: 1,
								field: "icon",
								headerName: "Activity's Info",
								renderCell: ({ row }) => (
									<div className="flex flex-row items-center">
										<Avatar
											src={row.icon as string} // Adjust this to your image URL property
											alt={row.name}
											sx={{
												width: "30px",
												height: "30px",
												marginRight: "10px",
											}}
										/>
										<p className="ml-6">{row.name}</p>
									</div>
								),
							},
							{
								flex: 1,
								field: "name",
								headerName: "Name",
								renderCell: ({ row }) => <p>{row.name}</p>,
							},
							{
								flex: 1,
								field: "action",
								headerName: "Action",
								renderCell: ({ row }) => (
									<div className="flex gap-2 mt-[10px]">
										<IconButton
											onClick={() => handleUpdateActivity(row)}
											className="mt-4 mr-5"
										>
											<EditIcon color="secondary" />
										</IconButton>
										<IconButton
											onClick={() => deleteThisActivity(row.id)}
											className="mt-4 mr-5"
										>
											<DeleteForeverIcon color="error" />
										</IconButton>
									</div>
								),
							},
						]}
					/>
				</Paper>

				{isEditDialogOpen && (
					<DialogWrapper
						isOpen={isEditDialogOpen}
						onClose={() => setIsEditDialogOpen(false)}
						title={"Edit Activity"}
						maxWidth="lg"
						content={
							<div
								style={{
									width: IsWeb ? "100%" : "",
									height: IsWeb ? "75vh" : "",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<div
										onClick={() => {
											document.getElementById("files-uploader-v1").click();
										}}
										style={{
											marginTop: "20px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "200px",
											height: "200px",
											border: "1px solid black",
											borderRadius: "50%",
											background: "#f9f9f9",
											cursor: "pointer",
											overflow: "hidden",
										}}
									>
										{typeof Icon === "string" && Icon ? (
											// If Icon is a string, show it as an <img> tag
											<img
												src={Icon}
												alt="Uploaded Icon"
												style={{ maxWidth: "100%", maxHeight: "100%" }}
											/>
										) : Icon instanceof File ? (
											// If Icon is a File, create a URL and show it
											<img
												src={URL.createObjectURL(Icon)}
												alt="Uploaded Icon Preview"
												style={{ maxWidth: "100%", maxHeight: "100%" }}
												onLoad={(e) =>
													URL.revokeObjectURL(
														(e.target as HTMLImageElement).src
													)
												} // Revoke the URL after the image is loaded
											/>
										) : (
											// Placeholder if no image is uploaded
											<p style={{ color: "grey" }}>No image uploaded</p>
										)}
									</div>
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										flexWrap: "wrap",
									}}
								>
									<InputField
										label="Name"
										value={name}
										onChange={setName}
										type="text"
										width="100%"
									/>

									<input
										accept="image/*"
										id="files-uploader-v1"
										//   multiple
										hidden
										type="file"
										onChange={(e) => {
											if (!e.target.files || e.target.files.length === 0)
												return;
											setIcon(e.target.files[0] as File);
										}}
									/>
								</div>
							</div>
						}
						onSave={() => {
							isAddingNewActivity ? savActivity() : updateActivity();
						}}
						saveButtonText="Save"
					/>
				)}
			</div>
		</AuthWrapper>
	);
}

export default Activity;
