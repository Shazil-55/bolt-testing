import AuthWrapper from "@/components/AuthWrapper";
import { Fragment, useEffect, useState } from "react";
import * as ActivitiesAction from "../../../store/actions/activities.action";
import * as UserAction from "../../../store/actions/user.actions";
import * as Actions from "../../../store/actions/class.actions";
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
	Icon,
	IconButton,
	LinearProgress,
	Paper,
	Stack,
	TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import {
	Activities,
	Classes as ClassType,
	CreateClassInterface,
	EventStatus,
	EventType,
	RecurringType,
	User,
} from "@/helpers/interfaces";
import { DialogWrapper } from "@/helpers/DialogWrapper";
import InputField from "@/helpers/InputField";
import StatusSelect from "@/helpers/StatusSelect";
import {
	BoolValue,
	ClassUpdate,
	RecurringTypeMenu,
	ScheduleDay,
} from "@/helpers/menuItems";
import moment from "moment";
import { useDevice } from "@/helpers/useDevice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import zIndex from "@mui/material/styles/zIndex";
import PlaceSearch from "@/helpers/PlaceSearch";

function Classes() {
	const dispatch = useEnhancedDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const { IsMob, IsTab, IsWeb } = useDevice();

	const allClass = useEnhancedSelector((state) => state.User.classes);
	const allActivities = useEnhancedSelector((state) => state.User.activities);
	const allUsers = useEnhancedSelector((state) => state.User.allUsers);

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isCustomPackagesDialogOpen, setIsCustomPackagesDialogOpen] =
		useState(false);
	const [selectedClass, setSelectedClass] = useState(null);
	const [customPackages, setCustomPackages] = useState([]);
	const [isAddingNewClass, setIsAddingNewClass] = useState(false); // New state variable
	const [selectedActivity, setSelectedActivity] = useState<Activities>(null);
	const [host, setHost] = useState<User>(null);

	const [locations, setLocations] = useState([]); // New state for locations
	const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false); // State for schedule dialog
	const [selectedLocationIndex, setSelectedLocationIndex] = useState(null); // Track selected location for schedule

	const [scheduleDay, setScheduleDay] = useState(""); // New state for schedule day
	const [scheduleStartTime, setScheduleStartTime] = useState(""); // New state for schedule start time
	const [scheduleEndTime, setScheduleEndTime] = useState(""); // New state for schedule end time

	const [classDate, setClassDate] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [recurringType, setRecurringType] = useState<RecurringType | null>(
		null
	);
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [lat, setLat] = useState(0);
	const [long, setLong] = useState(0);
	const [dailyPassPrice, setDailyPassPrice] = useState(null);
	const [monthlyPassPrice, setMonthlyPassPrice] = useState(null);
	const [donationBasedDailyPass, setDonationBasedDailyPass] = useState(false);
	const [donationBasedMonthlyPass, setDonationBasedMonthlyPass] =
		useState(false);
	const [isFirstClassFree, setIsFirstClassFree] = useState(false);
	const [maximum, setMaximum] = useState(null);
	const [minimum, setMinimum] = useState(null);
	const [showEvent, setShowEvent] = useState(true);
	const [updateThisClass, setUpdateThisClass] = useState(true);

	useEffect(() => {
		getClassData();
	}, []);

	useEffect(() => {
		if (donationBasedMonthlyPass) setMonthlyPassPrice(0);
	}, [donationBasedMonthlyPass]);

	useEffect(() => {
		if (donationBasedDailyPass) setDailyPassPrice(0);
	}, [donationBasedDailyPass]);

	async function getClassData() {
		setIsLoading(true);
		await dispatch(Actions.getAllClasses());
		if (!allActivities) await dispatch(ActivitiesAction.getAllActivities());
		if (!allActivities) await dispatch(UserAction.getAllUsers());
		setIsLoading(false);
	}

	async function updateClassStatus(id: string, status: EventStatus) {
		setIsLoading(true);
		dispatch(closeDialog());
		await dispatch(
			Actions.UpdateClass(id, { classStatus: status, updateThisClass: true })
		);
		await dispatch(Actions.getAllClasses());
		setIsLoading(false);
	}

	async function checkInputs() {
		if (!name) throw new Error("Class Name is required.");
		if (!description) throw new Error("Class Description is required.");
		if (recurringType === null) throw new Error("Recurring Type is required.");
		if (!host || !host.id) throw new Error("Host is required.");
		if (!selectedActivity || !selectedActivity.id)
			throw new Error("Activity is required.");
		if (locations.length === 0)
			throw new Error("At least one location is required.");
		locations.forEach((location, index) => {
			if (location.lat === null || location.lat === undefined)
				throw new Error(`Latitude is required for location ${index + 1}.`);
			if (location.long === null || location.long === undefined)
				throw new Error(`Longitude is required for location ${index + 1}.`);
			if (!location.schedule || location.schedule.length === 0)
				throw new Error(`Please add schedule for location ${index + 1}.`);
			location.schedule.forEach((sched, schedIndex) => {
				if (!sched.startTime)
					throw new Error(
						`Start Time is required for schedule ${schedIndex + 1} at location ${index + 1}.`
					);
				if (!sched.endTime)
					throw new Error(
						`End Time is required for schedule ${schedIndex + 1} at location ${index + 1}.`
					);
				if (!sched.day)
					throw new Error(
						`Schedule Day is required for schedule ${schedIndex + 1} at location ${index + 1}.`
					);
			});
		});
	}

	async function createClass(): Promise<void> {
		try {
			await checkInputs();
			const body: Partial<CreateClassInterface> = {
				description: description,
				name: name,
				dailyPassPrice: dailyPassPrice,
				monthlyPassPrice: monthlyPassPrice,
				donationBasedDailyPass: donationBasedDailyPass,
				donationBasedMonthlyPass: donationBasedMonthlyPass,
				isFirstClassFree: isFirstClassFree,
				maximum: maximum,
				minimum: minimum,
				recurringType: recurringType,
				customPackage: customPackages
					.filter((pkg) => pkg.numberOfClasses > 0)
					.map((pkg) => ({
						numberOfClasses: pkg.numberOfClasses,
						price: pkg.price,
					})),
				hostId: host.id,
				activityId: selectedActivity.id,
				currency: "USD", // Set the currency appropriately
				location: locations.map((location) => ({
					lat: location.lat,
					long: location.long,
					schedule: (location.schedule || []).map((sched) => {
						const today = new Date();
						const startISO = (() => {
							const [startHours, startMinutes] = sched.startTime.split(":");
							today.setHours(Number(startHours));
							today.setMinutes(Number(startMinutes));
							today.setSeconds(0);
							today.setMilliseconds(0);
							return today.toISOString();
						})();

						const endISO = (() => {
							const [endHours, endMinutes] = sched.endTime.split(":");
							today.setHours(Number(endHours));
							today.setMinutes(Number(endMinutes));
							today.setSeconds(0);
							today.setMilliseconds(0);
							return today.toISOString();
						})();

						return {
							...sched,
							startTime: startISO,
							endTime: endISO,
						};
					}),
					// Ensure schedule is included
				})), // Update to use the locations state
			};

			console.log("BODY ", body);

			await dispatch(Actions.CreateClass(body)); // Assuming you have a CreateClass action
			setIsLoading(true);
			dispatch(closeDialog());
			setIsEditDialogOpen(false);
			setIsAddingNewClass(false);
			await dispatch(Actions.getAllClasses());
			setIsLoading(false);
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "An unknown error occurred.";

			setErrorMsg(errorMessage);
			// console.log("Error:", errorMessage);
			setIsLoading(false);
		}
	}

	async function updateClass(): Promise<void> {
		const body = {
			classId: selectedClass.classId,
			scheduleDate: classDate,
			startTime_updated: startTime,
			endTime_updated: endTime,
			description_updated: description,
			name_updated: name,
			lat_updated: lat,
			long_updated: long,
			dailyPassPrice_updated: dailyPassPrice,
			monthlyPassPrice_updated: monthlyPassPrice,
			donationBasedDailyPass_updated: donationBasedDailyPass,
			donationBasedMonthlyPass_updated: donationBasedMonthlyPass,
			isFirstClassFree_updated: isFirstClassFree,
			maximum_updated: maximum,
			minimum_updated: minimum,
			updateThisClass: updateThisClass,
		};

		await dispatch(Actions.UpdateClass(selectedClass.id, body));
		setIsLoading(true);
		dispatch(closeDialog());
		setIsEditDialogOpen(false);
		await dispatch(Actions.getAllClasses());
		setIsLoading(false);
	}

	function handleUpdateClass(row: any): void {
		setSelectedClass(row);
		setIsAddingNewClass(false);

		setClassDate(row.classDate);
		setName(row.className);
		setStartTime(row.startTime);
		setEndTime(row.endTime);
		setLat(row.lat);
		setLong(row.long);
		setDailyPassPrice(row.dailyPassPrice);
		setMonthlyPassPrice(row.monthlyPassPrice);
		setDonationBasedDailyPass(row.donationBasedDailyPass);
		setDonationBasedMonthlyPass(row.donationBasedMonthlyPass);
		setIsFirstClassFree(row.isFirstClassFree);
		setMaximum(row.maximum);
		setMinimum(row.minimum);
		setShowEvent(row.showEvent);

		setIsEditDialogOpen(true);
	}

	// Function to handle place selection for multiple locations
	const handlePlaceSelected = (place, index) => {
		console.log("Selected Place:", place);
		const updatedLocations = [...locations];
		updatedLocations[index] = {
			...updatedLocations[index],
			lat: place.lat,
			long: place.lng,
		};
		setLocations(updatedLocations);
	};

	// Function to add a new location
	function handleAddLocation() {
		setLocations([...locations, { lat: "", long: "", schedule: [] }]);
	}

	// Function to open schedule dialog
	function handleOpenScheduleDialog(index) {
		setSelectedLocationIndex(index);
		setIsScheduleDialogOpen(true);
	}

	function handleAddSchedule(day, startTime, endTime) {
		const updatedLocations = [...locations];
		updatedLocations[selectedLocationIndex].schedule.push({
			day,
			startTime,
			endTime,
		});
		setLocations(updatedLocations);
		setIsScheduleDialogOpen(false);
	}

	function handleCreateClass(): void {
		setIsAddingNewClass(true);

		setSelectedClass(null);
		setClassDate("");
		setName("");
		setStartTime("");
		setEndTime("");
		setLat(0);
		setLong(0);
		setDailyPassPrice(null);
		setMonthlyPassPrice(null);
		setDonationBasedDailyPass(false);
		setDonationBasedMonthlyPass(false);
		setIsFirstClassFree(false);
		setMaximum(null);
		setMinimum(null);
		setErrorMsg("");
		setUpdateThisClass(false);
		setIsEditDialogOpen(true);
	}

	function handleViewCustomPackages(row: any): void {
		setSelectedClass(row);
		setCustomPackages(row.customPackages || []);
		setIsCustomPackagesDialogOpen(true);
	}

	function handleAddCustomPackages(): void {
		setCustomPackages([]);
		setIsCustomPackagesDialogOpen(true);
	}

	async function updateCustomPackages(): Promise<void> {
		// Assuming there's an API endpoint for updating custom packages
		console.log("CustomPackages", customPackages);
		await dispatch(
			Actions.UpdateCustomPackages(selectedClass.classId, customPackages)
		);
		setIsCustomPackagesDialogOpen(false);
		await getClassData();
	}

	return (
		<AuthWrapper>
			<div className="p-28">
				<div className="flex justify-between">
					<h1>Classes Management</h1>
					<Button
						onClick={() => {
							handleCreateClass();
						}}
						className="text-white"
						style={{ backgroundColor: "#28a745" }}
					>
						Create Class
					</Button>
				</div>

				<Paper className="w-full mt-20 p-10">
					{isLoading && <LinearProgress />}

					<DataGrid
						sx={{ width: "100%" }}
						density="comfortable"
						disableRowSelectionOnClick
						rows={allClass ?? []}
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
								headerName: "Class's Info",
								renderCell: ({ row }) => (
									<div className="flex flex-row items-center">
										<Avatar
											src={row.activityIcon}
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
								field: "className",
								headerName: "Class Name",
								renderCell: ({ row }) => <p>{row.className}</p>,
							},
							{
								flex: 1,
								field: "host",
								headerName: "Host Username",
								renderCell: ({ row }) => <p>{row.host}</p>,
							},
							{
								flex: 1,
								field: "isFirstClassFree",
								headerName: "First Class Free",
								renderCell: ({ row }) => (
									<p>{row.isFirstClassFree ? "Yes" : "No"}</p>
								),
							},
							{
								flex: 1,
								field: "dailyPassPrice",
								headerName: "Price Daily($)",
								renderCell: ({ row }) => (
									<p>
										{row.dailyPassPrice
											? parseFloat(row.dailyPassPrice.toString()).toFixed(2)
											: "N/A"}
									</p>
								),
							},
							{
								flex: 1,
								field: "monthlyPassPrice",
								headerName: "Price Monthly($)",
								renderCell: ({ row }) => (
									<p>
										{row.monthlyPassPrice
											? parseFloat(row.monthlyPassPrice.toString()).toFixed(2)
											: "N/A"}
									</p>
								),
							},
							{
								flex: 1,
								field: "donationBasedDailyPass",
								headerName: "Donation(Daily)",
								renderCell: ({ row }) => (
									<p>{row.donationBasedDailyPass ? "Yes" : "No"}</p>
								),
							},
							{
								flex: 1,
								field: "donationBasedMonthlyPass",
								headerName: "Donation(Monthly)",
								renderCell: ({ row }) => (
									<p>{row.donationBasedMonthlyPass ? "Yes" : "No"}</p>
								),
							},
							{
								flex: 1,
								field: "lat",
								headerName: "Latitude",
								renderCell: ({ row }) => <p>{row.lat}</p>,
							},
							{
								flex: 1,
								field: "long",
								headerName: "Longitude",
								renderCell: ({ row }) => <p>{row.long}</p>,
							},
							{
								flex: 1,
								field: "classDate",
								headerName: "Class Date",
								renderCell: ({ row }) => (
									<p>{new Date(row.classDate).toLocaleDateString()}</p>
								),
							},
							{
								flex: 1,
								field: "startTime",
								headerName: "Start Time",
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
								headerName: "End Time",
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
								field: "confirmedCount",
								headerName: "Confirmed Count",
								renderCell: ({ row }) => <p>{row.confirmedCount ?? "0"}</p>,
							},
							{
								flex: 1,
								field: "availableCount",
								headerName: "Available Slots",
								renderCell: ({ row }) => (
									<p>{(row.maximum && row.availableCount) ?? "N/A"}</p>
								),
							},
							{
								flex: 1,
								field: "maximum",
								headerName: "Maximum Capacity",
								renderCell: ({ row }) => <p>{row.maximum ?? "N/A"}</p>,
							},
							{
								flex: 1,
								field: "viewCustomPackages",
								headerName: "Custom Packages",
								renderCell: ({ row }) => (
									<Button
										variant="outlined"
										onClick={() => handleViewCustomPackages(row)}
									>
										View Custom Packages
									</Button>
								),
							},
							{
								flex: 1,
								field: "classStatus",
								headerName: "Status",
								renderCell: ({ row }) => (
									<Chip
										label={<p style={{ color: "white" }}>{row.classStatus}</p>}
										color={
											row.classStatus === EventStatus.Active
												? "success"
												: "error"
										}
										onClick={() => {
											dispatch(
												openDialog({
													children: (
														<Fragment>
															<DialogTitle id="alert-dialog-title">
																{row.classStatus === EventStatus.Active
																	? "Are you sure you want to cancel this class?"
																	: "Are you sure you want to activate this class?"}
															</DialogTitle>
															<DialogContent>
																<DialogContentText id="alert-dialog-description">
																	{row.classStatus === EventStatus.Active
																		? "This action will mark the class as cancelled and make it inactive."
																		: "This action will mark the class as active and allow it to proceed."}
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
																		updateClassStatus(
																			row.id,
																			row.classStatus === EventStatus.Active
																				? EventStatus.Cancelled
																				: EventStatus.Active
																		);
																	}}
																	color={
																		row.classStatus === EventStatus.Active
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
								),
							},
							{
								flex: 1,
								field: "action",
								headerName: "Action",
								renderCell: ({ row }) => (
									<div className="flex gap-2 mt-[10px]">
										<IconButton
											onClick={() => handleUpdateClass(row)}
											className="mt-4 mr-5"
										>
											<EditIcon color="secondary" />
										</IconButton>
										<IconButton
											onClick={() => handleUpdateClass(row)}
											className="mt-4 mr-5"
										>
											<VisibilityIcon color="secondary" />
										</IconButton>
									</div>
								),
							},
						]}
					/>
				</Paper>
				{isLoading && <LinearProgress />}

				{isEditDialogOpen && (
					<DialogWrapper
						isOpen={isEditDialogOpen}
						onClose={() => setIsEditDialogOpen(false)}
						title={isAddingNewClass ? "Create Class" : "Edit Class"}
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
									{isAddingNewClass ? (
										<>
											<Stack
												spacing={3}
												sx={{
													marginTop: "15px",
													marginBottom: "15px",
													width: "48%",
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

											<Stack
												spacing={3}
												sx={{
													marginTop: "25px",
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

											{/* <StatusSelect
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
                        
                        /> */}
										</>
									) : (
										<></>
									)}

									<InputField
										label="Class Name"
										value={name}
										onChange={setName}
										type="string"
									/>

									<InputField
										label="Class Description"
										value={description}
										onChange={setDescription}
										type="string"
									/>

									{/* <InputField
                  label="Latitude"
                  value={lat}
                  onChange={setLat}
                  type="number"
                /> */}

									<InputField
										label="Minimum Particpants"
										value={minimum}
										onChange={setMinimum}
										type="number"
									/>
									<InputField
										label="Maximum Particpants"
										value={maximum}
										onChange={setMaximum}
										type="number"
									/>
									<InputField
										label="Daily Pass Price"
										value={dailyPassPrice}
										onChange={setDailyPassPrice}
										type="number"
										disabled={donationBasedDailyPass}
									/>
									<InputField
										label="Monthly Pass Price"
										value={monthlyPassPrice}
										onChange={setMonthlyPassPrice}
										type="number"
										disabled={donationBasedMonthlyPass}
									/>
									<StatusSelect
										label="Donation-Based Daily Pass"
										value={donationBasedDailyPass}
										onChange={setDonationBasedDailyPass}
										menuItems={BoolValue}
									/>
									<StatusSelect
										label="Donation-Based Monthly Pass"
										value={donationBasedMonthlyPass}
										onChange={setDonationBasedMonthlyPass}
										menuItems={BoolValue}
									/>
									<StatusSelect
										label="Is First Class Free"
										value={isFirstClassFree}
										onChange={setIsFirstClassFree}
										menuItems={BoolValue}
									/>
									{isAddingNewClass ? (
										<>
											<StatusSelect
												label="Recurring Type"
												value={recurringType}
												onChange={setRecurringType}
												menuItems={RecurringTypeMenu}
											/>

											{/* Custom Package Editing Section */}
											<div className="flex flex-col w-[100%] mt-4">
												{customPackages
													.filter((pkg) => !pkg.isDeleted)
													.map((pkg, filteredIndex) => {
														const originalIndex = customPackages.findIndex(
															(p) => p === pkg
														);
														return (
															<div
																key={originalIndex}
																className="mb-4"
																style={{
																	display: "flex",
																	justifyContent: "space-between",
																	alignItems: "center",
																}}
															>
																<InputField
																	label={`Package ${filteredIndex + 1} - Number of Classes`} // Changed to use filteredIndex
																	value={pkg.numberOfClasses}
																	onChange={(value) => {
																		const updatedPackages = [...customPackages];
																		updatedPackages[originalIndex] = {
																			...updatedPackages[originalIndex],
																			numberOfClasses: Number(value),
																			isUpdated: true,
																		};
																		setCustomPackages(updatedPackages);
																	}}
																	type="number"
																	width="45%"
																/>
																<InputField
																	label={`Package ${filteredIndex + 1} - Price ($)`} // Changed to use filteredIndex
																	value={pkg.price}
																	onChange={(value) => {
																		const updatedPackages = [...customPackages];
																		updatedPackages[originalIndex] = {
																			...updatedPackages[originalIndex],
																			price: Number(value),
																			isUpdated: true,
																		};
																		setCustomPackages(updatedPackages);
																	}}
																	type="number"
																	width="45%"
																/>
																<Button
																	variant="outlined"
																	color="error"
																	onClick={() => {
																		const updatedPackages = customPackages.map(
																			(p, i) => {
																				if (i === originalIndex) {
																					return {
																						...p,
																						isDeleted: true,
																						isUpdated: true,
																					};
																				}
																				return p;
																			}
																		);
																		setCustomPackages(updatedPackages);
																	}}
																	style={{
																		minWidth: "40px",
																		height: "40px",
																		padding: "0",
																		marginTop: "55px",
																	}}
																>
																	✕
																</Button>
															</div>
														);
													})}
												<div className="flex justify-center my-[10px]">
													<Button
														variant="outlined"
														color="primary"
														onClick={() => {
															setCustomPackages([
																...customPackages,
																{
																	id: ``,
																	numberOfClasses: 0,
																	price: 0,
																	subscriber: 0,
																	isUpdated: true,
																	isDeleted: false,
																},
															]);
														}}
														className="mt-10 w-[200px]"
													>
														Add New Package
													</Button>
												</div>
											</div>

											<div className="flex flex-col w-[100%] mt-4">
												{locations.map((location, index) => (
													<>
														<div key={index}>
															<PlaceSearch
																onPlaceSelected={(place) =>
																	handlePlaceSelected(place, index)
																}
															/>
															<div
																style={{
																	display: "flex",
																	justifyContent: "space-between",
																	alignItems: "center",
																	position: "relative",
																	top: "-30px",
																}}
															>
																<InputField
																	label="Latitude"
																	value={location.lat}
																	onChange={(value) => {
																		const updatedLocations = [...locations];
																		updatedLocations[index].lat = value;
																		setLocations(updatedLocations);
																	}}
																	type="number"
																	width="40%"
																	disabled={isAddingNewClass}
																/>
																<InputField
																	label="Longitude"
																	value={location.long}
																	onChange={(value) => {
																		const updatedLocations = [...locations];
																		updatedLocations[index].long = value;
																		setLocations(updatedLocations);
																	}}
																	type="number"
																	width="40%"
																	disabled={isAddingNewClass}
																/>
																<Button
																	variant="outlined"
																	onClick={() =>
																		handleOpenScheduleDialog(index)
																	}
																	style={{ width: "10%", marginTop: "50px" }}
																>
																	Add Schedule
																</Button>
																<Button
																	variant="outlined"
																	color="error"
																	onClick={() => {
																		const updatedLocations = [...locations];
																		updatedLocations.splice(index, 1); // Remove the location
																		setLocations(updatedLocations);
																	}}
																	style={{ marginTop: "50px" }}
																>
																	✕
																</Button>
															</div>
														</div>
														<div className="mt-2 w-full">
															{location &&
																location.schedule.map(
																	(schedule, scheduleIndex) => (
																		<div
																			key={scheduleIndex}
																			className="flex justify-between items-center"
																			style={{
																				position: "relative",
																				top: "-25px",
																			}}
																		>
																			<p>{`Day: ${schedule.day}, Start: ${schedule.startTime}, End: ${schedule.endTime}`}</p>
																			<Button
																				variant="outlined"
																				color="error"
																				onClick={() => {
																					const updatedLocations = [
																						...locations,
																					];
																					updatedLocations[
																						index
																					].schedule.splice(scheduleIndex, 1); // Remove the schedule
																					setLocations(updatedLocations);
																				}}
																			>
																				✕
																			</Button>
																		</div>
																	)
																)}
														</div>
													</>
												))}
												<div className="flex justify-center my-[10px]">
													<Button
														variant="outlined"
														color="primary"
														onClick={handleAddLocation}
														className="mt-10 w-[200px]"
													>
														Add Location
													</Button>
												</div>
											</div>
										</>
									) : (
										<>
											<InputField
												label="Class Date"
												value={
													classDate
														? moment(classDate).format("YYYY-MM-DD")
														: ""
												}
												onChange={setClassDate}
												type="date"
											/>
											<InputField
												label="Start Time"
												value={
													startTime ? moment(startTime).format("HH:mm") : ""
												}
												onChange={(value) =>
													setStartTime(
														moment(`${classDate} ${value}`).toISOString()
													)
												}
												type="time"
											/>
											<InputField
												label="End Time"
												value={endTime ? moment(endTime).format("HH:mm") : ""}
												onChange={(value) =>
													setEndTime(
														moment(`${classDate} ${value}`).toISOString()
													)
												}
												type="time"
											/>
											<InputField
												label="Latitude"
												value={lat}
												onChange={setLat}
												type="number"
											/>
											<InputField
												label="Longitude"
												value={long}
												onChange={setLong}
												type="number"
											/>

											<StatusSelect
												label="Update Only This Class"
												value={updateThisClass}
												onChange={setUpdateThisClass}
												menuItems={ClassUpdate}
											/>
										</>
									)}
								</div>
							</div>
						}
						onSave={() => {
							{
								isAddingNewClass ? createClass() : updateClass();
							}
						}}
						saveButtonText="Save"
						errorMsg={errorMsg}
					/>
				)}

				{isCustomPackagesDialogOpen && (
					<DialogWrapper
						isOpen={isCustomPackagesDialogOpen}
						onClose={() => setIsCustomPackagesDialogOpen(false)}
						title="Edit Custom Packages"
						maxWidth="lg"
						content={
							<div className="flex flex-col gap-4">
								{customPackages
									.filter((pkg) => !pkg.isDeleted)
									.map((pkg, index) => (
										<div
											key={pkg.id}
											className="mb-4"
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<InputField
												label={`Package ${index + 1} - Number of Classes`}
												value={pkg.numberOfClasses}
												onChange={(value) => {
													const updatedPackages = [...customPackages];
													updatedPackages[index] = {
														...updatedPackages[index],
														numberOfClasses: Number(value),
														isUpdated: true,
													};
													setCustomPackages(updatedPackages);
												}}
												type="number"
												width="45%"
											/>
											<InputField
												label={`Package ${index + 1} - Price ($)`}
												value={pkg.price}
												onChange={(value) => {
													const updatedPackages = [...customPackages];
													updatedPackages[index] = {
														...updatedPackages[index],
														price: Number(value),
														isUpdated: true,
													};
													setCustomPackages(updatedPackages);
												}}
												type="number"
												width="45%"
											/>
											<Button
												variant="outlined"
												color="error"
												onClick={() => {
													const updatedPackages = customPackages.map((p, i) => {
														if (i === index) {
															return {
																...p,
																isDeleted: true,
																isUpdated: true,
															};
														}
														return p;
													});
													setCustomPackages(updatedPackages);
												}}
												style={{
													minWidth: "40px",
													height: "40px",
													padding: "0",
													marginTop: "55px",
												}}
											>
												✕
											</Button>
										</div>
									))}
								<div className="flex justify-center my-[10px]">
									<Button
										variant="outlined"
										color="primary"
										onClick={() => {
											setCustomPackages([
												...customPackages,
												{
													id: ``,
													numberOfClasses: 0,
													price: 0,
													subscriber: 0,
													isUpdated: true,
												},
											]);
										}}
										className="mt-10  w-[200px]"
									>
										Add New Package
									</Button>
								</div>
							</div>
						}
						onSave={() => {
							// const updatedPackagesOnly = customPackages.filter(pkg => pkg.isUpdated || pkg.isDeleted);
							updateCustomPackages();
						}}
						saveButtonText="Save"
					/>
				)}

				{isScheduleDialogOpen && (
					<DialogWrapper
						isOpen={isScheduleDialogOpen}
						onClose={() => setIsScheduleDialogOpen(false)}
						title="Add Schedule"
						content={
							<div>
								<StatusSelect
									label="Day"
									value={scheduleDay} // Added value prop with fallback
									onChange={(value) => setScheduleDay(value)}
									menuItems={ScheduleDay}
								/>
								<InputField
									label="Start Time"
									value={scheduleStartTime} // Added value prop
									onChange={(value) => setScheduleStartTime(value)}
									type="time"
								/>
								<InputField
									label="End Time"
									value={scheduleEndTime} // Added value prop
									onChange={(value) => setScheduleEndTime(value)}
									type="time"
								/>
							</div>
						}
						onSave={() =>
							handleAddSchedule(scheduleDay, scheduleStartTime, scheduleEndTime)
						}
						saveButtonText="Save"
					/>
				)}
			</div>
		</AuthWrapper>
	);
}

export default Classes;
