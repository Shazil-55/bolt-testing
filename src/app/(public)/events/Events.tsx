import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import AuthWrapper from "@/components/AuthWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import { Fragment, useEffect, useState } from "react";
import * as Actions from "../../../store/actions/event.actions";
import * as ActivitiesAction from "../../../store/actions/activities.action";
import * as UserAction from "../../../store/actions/user.actions";
import { useEnhancedDispatch, useEnhancedSelector } from "@/helpers/reduxHooks";
import {
	Autocomplete,
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
	Stack,
	TextField,
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
import type {
	Activities,
	Events,
	RecurringType,
	User,
} from "@/helpers/interfaces";
import { EventStatus, EventType } from "@/helpers/interfaces";
import ReplayIcon from "@mui/icons-material/Replay";
import { DialogWrapper } from "@/helpers/DialogWrapper";
import InputField from "@/helpers/InputField";
import { useDevice } from "@/helpers/useDevice";
import StatusSelect from "@/helpers/StatusSelect";
import {
	BoolValue,
	EventsUpdate,
	RecurringTypeMenu,
} from "@/helpers/menuItems";
import PlaceSearch from "@/helpers/PlaceSearch";
function Events() {
	const { IsMob, IsTab, IsWeb } = useDevice();

	const dispatch = useEnhancedDispatch();

	const [isLoading, setIsLoading] = useState(true);

	const allEvent = useEnhancedSelector((state) => state.User.events);
	const allActivities = useEnhancedSelector((state) => state.User.activities);
	const allUsers = useEnhancedSelector((state) => state.User.allUsers);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAddingNewEvent, setIsAddingNewEvent] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const [selectedActivity, setSelectedActivity] = useState<Activities>(null);
	const [host, setHost] = useState<User>(null);
	const [eventId, setEventId] = useState<string>("");
	const [eventDate, setEventDate] = useState<string>("");
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [lat, setLat] = useState<number>(0);
	const [long, setLong] = useState<number>(0);
	const [price, setPrice] = useState<number | null>(null);
	const [donation, setDonation] = useState<boolean | null>(null);
	const [recurring, setRecurring] = useState<boolean | null>(false);
	const [recurringType, setRecurringType] = useState<RecurringType | null>(
		null
	);
	const [isPrivateEvent, setIsPrivateEvent] = useState<boolean>(false);
	const [maximum, setMaximum] = useState<number | null>(null);
	const [minimum, setMinimum] = useState<number | null>(null);
	const [updateThisEvent, setUpdateThisEvent] = useState<boolean>(true);

	const [placeDetails, setPlaceDetails] = useState(null);

	const handlePlaceSelected = (place) => {
		console.log("Selected Place:", place);
		setLat(place.lat);
		setLong(place.lng);
		setPlaceDetails(place);
	};

	useEffect(() => {
		getEventData();
	}, []);

	useEffect(() => {
		if (donation) setPrice(0);
	}, [donation]);

	async function getEventData() {
		setIsLoading(true);
		await dispatch(Actions.getAllEvents());
		if (!allActivities) await dispatch(ActivitiesAction.getAllActivities());
		if (!allActivities) await dispatch(UserAction.getAllUsers());
		setIsLoading(false);
	}

	async function updateEventStatus(id: string, status: EventStatus) {
		setIsLoading(true);
		dispatch(closeDialog());
		await dispatch(
			Actions.UpdateEvent(id, { eventStatus: status, updateThisEvent: true })
		);
		await dispatch(Actions.getAllEvents());
		setIsLoading(false);
	}

	async function updateEvent(): Promise<void> {
		const body: Partial<Events> = {
			eventId,
			eventDate,
			startTime,
			endTime,
			lat,
			long,
			price,
			donation,
			isPrivateEvent,
			maximum,
			minimum,
			updateThisEvent,
		};
		await dispatch(Actions.UpdateEvent(selectedEvent.id, body));
		setIsLoading(true);
		dispatch(closeDialog());
		setIsEditDialogOpen(false);
		await dispatch(Actions.getAllEvents());
		setIsLoading(false);
	}

	async function checkInputs() {
		if (!eventDate) throw new Error("Event Date is required.");
		if (!startTime) throw new Error("Start Time is required.");
		if (endTime < startTime)
			throw new Error("End Time should be greater than start Time");
		if (!endTime) throw new Error("End Time is required.");
		if (!host || !host.id) throw new Error("Host is required.");
		if (!selectedActivity || !selectedActivity.id)
			throw new Error("Activity is required.");
		if (lat === null || lat === undefined)
			throw new Error("Latitude is required.");
		if (long === null || long === undefined)
			throw new Error("Longitude is required.");
	}

	async function saveEvent(): Promise<void> {
		try {
			await checkInputs();
			const body: Partial<Events> = {
				activityId: selectedActivity?.id ?? "", // Assuming selectedActivity contains the activityId
				eventDate: eventDate, // Ensure this is in ISO format
				startTime: startTime,
				endTime: endTime,
				isRecurring: recurring ?? false,
				recurringType: recurring ? recurringType : null, // Set to null if not recurring
				lat: lat, // Convert to string to match the schema
				long: long, // Convert to string to match the schema
				currency: "USD", // Add a default or dynamic value as needed
				price: price ?? null,
				donation: donation ?? null,
				isPrivateEvent: isPrivateEvent,
				maximum: maximum ?? null,
				minimum: minimum ?? null,
				hostId: host.id,
			};

			console.log("SAVE EVENTS", body);
			await dispatch(Actions.CreateEvent(body));
			setIsLoading(true);
			dispatch(closeDialog());
			setIsEditDialogOpen(false);
			setIsAddingNewEvent(false);
			await dispatch(Actions.getAllEvents());
			setIsLoading(false);
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "An unknown error occurred.";
			setErrorMsg(errorMessage);
			setIsLoading(false);
		}
	}

	function handleUpdateEvent(row: any): void {
		setIsAddingNewEvent(false);
		setSelectedEvent(row);
		setEventId(row.eventId);
		setEventDate(row.eventDate);
		setStartTime(row.startTime);
		setEndTime(row.endTime);
		setLat(row.lat);
		setLong(row.long);
		setPrice(row.price);
		setDonation(row.donation);
		setIsPrivateEvent(row.isPrivateEvent);
		setMaximum(row.maximum);
		setMinimum(row.minimum);
		setUpdateThisEvent(true);

		setIsEditDialogOpen(true);
	}

	function handleCreateEvent(): void {
		setIsAddingNewEvent(true);

		setSelectedEvent(null);
		setSelectedActivity(null);
		setHost(null);
		setEventId("");
		setEventDate("");
		setStartTime("");
		setEndTime("");
		setLat(0);
		setLong(0);
		setPrice(null);
		setDonation(null);
		setRecurring(false);
		setRecurringType(null);
		setIsPrivateEvent(false);
		setMaximum(null);
		setMinimum(null);
		setUpdateThisEvent(false);
		setIsEditDialogOpen(true);
	}

	return (
		<AuthWrapper>
			<div className="p-28">
				<div className="flex justify-between">
					<h1>Events Management</h1>
					<Button
						onClick={() => {
							handleCreateEvent();
						}}
						className="text-white"
						style={{ backgroundColor: "#28a745" }}
					>
						Create Event
					</Button>
				</div>

				<Paper className="w-full mt-20 p-10 ">
					{isLoading && <LinearProgress />}

					<DataGrid
						sx={{ width: "100%" }}
						density="comfortable"
						disableRowSelectionOnClick
						rows={allEvent ?? []}
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
								field: "activity",
								headerName: "Event's Info",
								renderCell: ({ row }) => (
									<div className="flex flex-row items-center">
										<Avatar
											src={row.activityIcon} // Adjust this to your image URL property
											alt={row.activityName}
											sx={{
												width: "30px",
												height: "30px",
												marginRight: "10px",
											}}
										/>
										<p className="ml-6">{row.activityName}</p>
									</div>
								),
							},
							{
								flex: 1,
								field: "host",
								headerName: "Host UserName",
								renderCell: ({ row }) => <p>{row.host}</p>,
							},
							{
								flex: 1,
								field: "price",
								headerName: "Price $",
								renderCell: ({ row }) => (
									<p className="flex flex-row justify-center items-center">
										{row.price
											? typeof row.price === "string"
												? parseFloat(row.price).toFixed(2)
												: row.price.toFixed(2)
											: 0}
									</p>
								),
							},
							{
								flex: 1,
								field: "donation",
								headerName: "Donation Based $",
								renderCell: ({ row }) => <p>{row.donation.toString()}</p>,
							},
							{
								flex: 1,
								field: "type",
								headerName: "Type",
								renderCell: ({ row }) => <p>{row.type}</p>,
							},
							// {
							// 	flex: 1,
							// 	field: 'eventName',
							// 	headerName: 'Eventname',
							// 	renderCell: ({ row }) => <p>{row.eventName}</p>,
							// },
							{
								flex: 1,
								field: "eventDate",
								headerName: "Event Date",
								renderCell: ({ row }) => (
									<p>{new Date(row.eventDate).toLocaleDateString()}</p>
								),
							},
							{
								flex: 1,
								field: "startTime",
								headerName: "Event Start Time",
								renderCell: ({ row }) => (
									<p>
										{new Date(row.startTime).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								),
							},
							{
								flex: 1,
								field: "endTime",
								headerName: "Event End Time",
								renderCell: ({ row }) => (
									<p>
										{new Date(row.endTime).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								),
							},
							{
								flex: 1,
								field: "action",
								headerName: "Action",
								renderCell: ({ row }) => (
									<div className="flex gap-2 mt-[10px]">
										<IconButton
											onClick={() => handleUpdateEvent(row)}
											className="mt-4 mr-5"
										>
											<EditIcon color="secondary" />
										</IconButton>
										<IconButton
											onClick={() => handleUpdateEvent(row)}
											className="mt-4 mr-5"
										>
											<VisibilityIcon color="secondary" />
										</IconButton>
									</div>
								),
							},
							{
								flex: 1,
								field: "status",
								headerName: "Status",

								renderCell: ({ row }) => (
									<>
										<Chip
											label={
												<p style={{ color: "white" }}>{row.eventStatus}</p>
											}
											color={
												row.eventStatus === EventStatus.Active
													? "success"
													: "error"
											}
											onClick={() => {
												dispatch(
													openDialog({
														children: (
															<Fragment>
																<DialogTitle id="alert-dialog-title">
																	{row.eventStatus === EventStatus.Active
																		? "Are you sure you want to cancel this event?"
																		: "Are you sure you want to activate this event?"}
																</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		{row.eventStatus === EventStatus.Active
																			? "This action will mark the event as cancelled and make it inactive."
																			: "This action will mark the event as active and allow it to proceed."}
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button
																		onClick={() => dispatch(closeDialog())}
																		color="primary"
																		variant="outlined"
																	>
																		Disagree
																	</Button>
																	<Button
																		onClick={() => {
																			dispatch(closeDialog());
																			if (
																				row.eventStatus === EventStatus.Active
																			) {
																				updateEventStatus(
																					row.id,
																					EventStatus.Cancelled
																				);
																			} else {
																				updateEventStatus(
																					row.id,
																					EventStatus.Active
																				);
																			}
																		}}
																		color={
																			row.eventStatus === EventStatus.Active
																				? "error"
																				: "success"
																		}
																		variant="contained"
																	>
																		Agree
																	</Button>
																</DialogActions>
															</Fragment>
														),
													})
												);
											}}
											style={{ cursor: "pointer" }}
										/>
									</>
								),
							},
						]}
					/>
				</Paper>

				{isEditDialogOpen && (
					<DialogWrapper
						isOpen={isEditDialogOpen}
						onClose={() => setIsEditDialogOpen(false)}
						title={isAddingNewEvent ? "Add Event" : "Edit Event"}
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
										justifyContent: "space-between",
										flexWrap: "wrap",
									}}
								>
									{isAddingNewEvent ? (
										<>
											<Stack
												spacing={3}
												sx={{
													marginTop: "15px",
													marginBottom: "15px",
													width: "100%",
												}}
											>
												<Autocomplete
													id="tags-standard"
													options={allActivities} // Ensure this is an array of strings
													getOptionLabel={(option) => option.name}
													value={selectedActivity} // Controlled value
													onChange={(event, newValue) =>
														setSelectedActivity(newValue || null)
													} // Handle selection
													renderInput={(params) => (
														<TextField
															{...params}
															variant="standard"
															label="Activity*"
															placeholder="Activity"
														/>
													)}
												/>
											</Stack>

											<StatusSelect
												label="Recurring"
												value={recurring}
												onChange={setRecurring}
												menuItems={BoolValue}
											/>

											<StatusSelect
												label="Recurring Type"
												value={recurringType}
												onChange={setRecurringType}
												menuItems={RecurringTypeMenu}
												disabled={!recurring}
											/>
										</>
									) : (
										<></>
									)}

									<StatusSelect
										label="Private Event"
										value={isPrivateEvent}
										onChange={setIsPrivateEvent}
										menuItems={BoolValue}
									/>

									<StatusSelect
										label="Donation Based"
										value={donation}
										onChange={setDonation}
										menuItems={BoolValue}
									/>

									<InputField
										label="Price"
										value={price}
										onChange={setPrice}
										type="number"
										width="48%"
										disabled={donation}
									/>

									<InputField
										label="Event Date"
										value={
											eventDate ? moment(eventDate).format("YYYY-MM-DD") : ""
										}
										onChange={setEventDate}
										type="date"
										width="48%"
									/>

									<InputField
										label="Start Time"
										value={startTime ? moment(startTime).format("HH:mm") : ""}
										onChange={(value) => {
											// Ensure value is in HH:mm format
											if (
												value &&
												value.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
											) {
												const date = moment().format("YYYY-MM-DD");
												setStartTime(moment(`${date} ${value}`).toISOString());
											}
										}}
										type="time"
										width="48%"
									/>

									<InputField
										label="End Time"
										value={endTime ? moment(endTime).format("HH:mm") : ""}
										onChange={(value) => {
											// Ensure value is in HH:mm format
											if (
												value &&
												value.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
											) {
												const date = moment().format("YYYY-MM-DD");
												setEndTime(moment(`${date} ${value}`).toISOString());
											}
										}}
										type="time"
										width="48%"
									/>

									<InputField
										label="Maximum Particpants"
										value={maximum}
										onChange={setMaximum}
										type="number"
										width="48%"
									/>

									<InputField
										label="Minimum Particpants"
										value={minimum}
										onChange={setMinimum}
										type="number"
										width="48%"
									/>

									{isAddingNewEvent && (
										<>
											<div className="mt-[30px] w-[100%]">
												<h4>Location</h4>
												<PlaceSearch onPlaceSelected={handlePlaceSelected} />
											</div>
										</>
									)}

									<InputField
										label="Latitudes"
										value={lat}
										onChange={setLat}
										type="number"
										width="48%"
										disabled={isAddingNewEvent}
									/>

									<InputField
										label="Longitudes"
										value={long}
										onChange={setLong}
										type="number"
										width="48%"
										disabled={isAddingNewEvent}
									/>

									{isAddingNewEvent ? (
										<>
											<Stack
												spacing={3}
												sx={{
													marginTop: "35px",
													marginBottom: "15px",
													width: "48%",
												}}
											>
												<Autocomplete
													id="tags-standard"
													options={allUsers} // Ensure this is an array of strings
													getOptionLabel={(option) => option.userName}
													value={host} // Controlled value
													onChange={(event, newValue) =>
														setHost(newValue || null)
													} // Handle selection
													renderInput={(params) => (
														<TextField
															{...params}
															variant="standard"
															label="Host*"
															placeholder="Host"
														/>
													)}
												/>
											</Stack>
										</>
									) : (
										<>
											<StatusSelect
												label="Update Only This Event?"
												value={updateThisEvent}
												onChange={setUpdateThisEvent}
												menuItems={EventsUpdate}
											/>
										</>
									)}
								</div>
							</div>
						}
						onSave={() => {
							{
								isAddingNewEvent ? saveEvent() : updateEvent();
							}
						}}
						saveButtonText="Save"
						errorMsg={errorMsg}
					/>
				)}
			</div>
		</AuthWrapper>
	);
}

export default Events;
