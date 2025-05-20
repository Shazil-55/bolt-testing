import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import AuthWrapper from '@/components/AuthWrapper';
import { Fragment, useEffect, useState } from 'react';
import * as Actions from "../../../store/actions"
import { useEnhancedDispatch, useEnhancedSelector } from '@/helpers/reduxHooks';
import { Avatar, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, Paper } from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { PRIMARY_GREEN } from '@/helpers/constants';
import moment from 'moment';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { UserStatus } from '@/helpers/interfaces';
import ReplayIcon from '@mui/icons-material/Replay';
function User() {

	const dispatch = useEnhancedDispatch()

	const [isLoading, setIsLoading] = useState(true)

	const allUser = useEnhancedSelector(state => state.User.allUsers)

	useEffect(() => {
		getUserData()
	}, [])


	async function getUserData() {
		setIsLoading(true)
		await dispatch(Actions.getAllUsers())
		setIsLoading(false)
	}


	async function deleteThisUser(id: string) {
		// setIsLoading(true);
		dispatch(closeDialog())
		dispatch(Actions.deleteUser(id))
		// setIsLoading(false);
	}

	async function blockThisUser(id: string, blockDevice: boolean) {
		setIsLoading(true);
		dispatch(closeDialog())
		await dispatch(Actions.blockUser(id, blockDevice))
		await dispatch(Actions.getAllUsers())
		setIsLoading(false);
	}


	async function unblockThisUser(id: string) {
		setIsLoading(true);
		dispatch(closeDialog())
		await dispatch(Actions.unBlockUser(id))
		await dispatch(Actions.getAllUsers())
		setIsLoading(false);
	}

	return (
		<AuthWrapper>
			<div
				className='p-28'
			>
				<h1>User Management</h1>


				<Paper className="w-full mt-20 p-10 ">
					{isLoading && <LinearProgress />}

					<DataGrid
						sx={{ width: "100%" }}
						density="comfortable"
						disableRowSelectionOnClick
						rows={allUser ?? []}
						// getRowClassName={(params) => {
						// 	return params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-[#eee]' : '';
						// }}
						style={{ marginTop: '20px', padding: '20px', paddingTop: '40px' }}
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
								field: 'name',
								headerName: "User's Info",
								renderCell: ({ row }) => (
									<div className="flex flex-row items-center">
										<Avatar
											src={row.profileImage} // Adjust this to your image URL property
											alt={row.name}
											sx={{
												width: '30px',
												height: '30px',
												marginRight: "10px"
											}}
										/>
										<p className="ml-6">{row.name}</p>
									</div>
								),
							},
							{
								flex: 1,
								field: 'email',
								headerName: 'Email',
								renderCell: ({ row }) => <p>{row.email}</p>,
							},
							{
								flex: 1,
								field: 'userName',
								headerName: 'Username',
								renderCell: ({ row }) => <p>{row.userName}</p>,
							},
							{
								flex: 1,
								field: 'averageRating',
								headerName: 'Average Rating',
								type: "number",
								renderCell: ({ row }) => <p>{row.averageRating}</p>,
							},
							{
								flex: 1,
								field: 'currency',
								headerName: 'currency',
								renderCell: ({ row }) => <p>{row.currency}</p>,
							},
							{
								flex: 1,
								field: 'birthday',
								headerName: 'Birthday',
								type: "dateTime",
								valueGetter: (params) => {
									return new Date(params)

								}
							},
							{
								flex: 1,
								field: 'status',
								headerName: 'Status',

								renderCell: ({ row }) => (
									<Chip
										label={<p style={{ color: 'white' }}>{row.status}</p>}
										color={row.status === 'Active' ? 'success' : 'error'}
									/>
								),
							},
							{
								flex: 1,
								field: 'createdAt',
								headerName: 'Joined on',
								type: "dateTime",
								valueGetter: (params) => {
									return new Date(params)

								}
							},
							{
								sortable: false,
								filterable: false,
								editable: false,
								flex: 1,
								field: 'Delete',
								headerName: 'Delete',
								align: "right",
								headerAlign: "right",
								renderCell: ({ row }) => {
									return (
										<>
											<IconButton
												onClick={() => {
													dispatch(openDialog({
														children: (
															<Fragment>
																<DialogTitle id="alert-dialog-title">Are you use you want to delete this user?</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This action is irreversible and will delete all the data associated with this user and remove all the events created by this user
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button

																		onClick={() => dispatch(closeDialog())}
																		color="primary"
																		variant='outlined'

																	>
																		Disagree
																	</Button>
																	<Button
																		onClick={() => {
																			dispatch(closeDialog())
																			deleteThisUser(row.id)
																		}}
																		color="error"
																		variant='contained'
																	>
																		Agree
																	</Button>
																</DialogActions>
															</Fragment>
														)
													}))
												}}
											>
												<DeleteForeverIcon color='error' />
											</IconButton>
										</>
									);
								},
							},
							{
								sortable: false,
								filterable: false,
								editable: false,
								flex: 1,
								field: 'BlockDevice',
								headerName: 'Block/unblock',
								align: "center",
								headerAlign: "center",
								renderCell: ({ row }) => {
									return row.status === UserStatus.Active ? (
										<>
											<IconButton
												onClick={() => {
													dispatch(openDialog({
														children: (
															<Fragment>
																<DialogTitle id="alert-dialog-title">Are you sure you want to block this user?</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		This action is irreversible and will delete all the data associated with this user and remove all the events created by this user
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button

																		onClick={() => dispatch(closeDialog())}
																		color="primary"
																		variant='outlined'

																	>
																		Close
																	</Button>
																	<Button
																		onClick={() => {
																			dispatch(closeDialog())
																			blockThisUser(row.id, false)
																		}}
																		color="error"
																		variant='contained'
																	>
																		Block
																	</Button>
																	{
																		row.fingerPrint && (
																			<Button
																				onClick={() => {
																					dispatch(closeDialog())
																					blockThisUser(row.id, true)
																				}}
																				color="error"
																				variant='contained'
																			>
																				Block & Block device
																			</Button>
																		)
																	}
																</DialogActions>
															</Fragment>
														)
													}))
												}}

											>
												<BlockIcon fontSize={"large"} color='error' />
											</IconButton>
										</>
									) : (
										<>
											<IconButton
												onClick={() => {
													dispatch(openDialog({
														children: (
															<Fragment>
																<DialogTitle id="alert-dialog-title">Are you sure you want to unblock this user?</DialogTitle>
																<DialogContent>
																	<DialogContentText id="alert-dialog-description">
																		Are you sure you want to unblock this user? Think about it... they might cause trouble again
																	</DialogContentText>
																</DialogContent>
																<DialogActions>
																	<Button

																		onClick={() => dispatch(closeDialog())}
																		color="error"
																		variant='contained'

																	>
																		KEEP THEM BLOCKED!
																	</Button>
																	<Button
																		onClick={() => {
																			dispatch(closeDialog())
																			unblockThisUser(row.id)
																		}}
																		color="success"
																		variant='outlined'
																	>
																		unblock them
																	</Button>

																</DialogActions>
															</Fragment>
														)
													}))
												}}

											>
												<ReplayIcon color={"primary"} />
											</IconButton>
										</>
									)
								},
							},
						]}
					/>
				</Paper>

			</div>
		</AuthWrapper>

	);
}

export default User;
