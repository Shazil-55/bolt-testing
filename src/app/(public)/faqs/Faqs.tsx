import DemoContent from "@fuse/core/DemoContent";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import AuthWrapper from "@/components/AuthWrapper";
import { Fragment, useEffect, useState } from "react";
import * as Actions from "../../../store/actions/faqs.action";
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
import { Faqs } from "@/helpers/interfaces";
import { DialogWrapper } from "@/helpers/DialogWrapper";
import { useDevice } from "@/helpers/useDevice";
import InputField from "@/helpers/InputField";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
// import { useNavigate } from "react-router-dom";

import StatusSelect from "@/helpers/StatusSelect";
import { BoolValue } from "@/helpers/menuItems";
import { useNavigate } from "react-router";
import { convertFromRaw } from "draft-js";

function Faq() {
	// const router = useRouter();
	const navigate = useNavigate();

	const { IsMob, IsTab, IsWeb } = useDevice();

	const dispatch = useEnhancedDispatch();

	const [isLoading, setIsLoading] = useState(true);

	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState<string | null>(null);
	const [isTree, setIsTree] = useState<boolean>(true);
	const [parentFaq, setParentFaq] = useState<Faqs | null>(null);

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAddingNewFaq, setIsAddingNewFaq] = useState(false);
	const [selectedFaq, setSelectedFaq] = useState<Faqs>(null);

	const allFaq = useEnhancedSelector((state) => state.User.faqs);

	useEffect(() => {
		getFaqData();
	}, []);

	async function getFaqData() {
		setIsLoading(true);
		await dispatch(Actions.getAllFaqs());

		setIsLoading(false);
	}

	async function deleteThisFaq(id: string) {
		// setIsLoading(true);
		dispatch(closeDialog());
		dispatch(Actions.deleteFaq(id));
		// setIsLoading(false);
	}

	function handleCreateFaq(): void {
		setIsAddingNewFaq(true);
		setQuestion("");
		setAnswer("");
		setParentFaq(null);
		setIsEditDialogOpen(true);
	}

	function handleUpdateFaq(row: any): void {
		console.log(row);
		setQuestion("");
		setAnswer("");
		setParentFaq(null);
		setSelectedFaq(row);
		setIsEditDialogOpen(true);
	}

	function handleViewTree(id: string): void {
		console.log("id", id);
		// navigate(`/faq/?parentId=${row.id}/`);
		// had to use this because other methods weren't working and this was taking my time
		// window.location.href = `/faq/?parentId=${id}`;
		navigate(`/faq/?parentId=${id}`);
		// router.push(`/faq/?parentId=${row.id}`);
	}

	function extractPlainText(richText: string): string {
		try {
			const parsedData = JSON.parse(richText);
			const contentState = convertFromRaw(parsedData);
			return contentState.getPlainText(); // Extracts only text
		} catch (error) {
			console.warn("Invalid Draft.js JSON, using raw value:", richText);
			return richText; // Return as-is if parsing fails
		}
	}

	async function updateFaq(): Promise<void> {
		const plainQuestion = extractPlainText(question);
		const plainAnswer = isTree ? null : extractPlainText(answer);

		const body: Partial<Faqs> = {
			question: plainQuestion,
			answer: plainAnswer,
			parentId: null,
		};

		console.log("Working");
		await dispatch(Actions.UpdateFaq(selectedFaq.id, body));
		setIsLoading(true);
		dispatch(closeDialog());
		setIsEditDialogOpen(false);
		getFaqData();
		setIsLoading(false);
	}

	async function saveFaq(): Promise<void> {
		const plainQuestion = extractPlainText(question);
		const plainAnswer = isTree ? null : extractPlainText(answer);

		const body: Partial<Faqs> = {
			question: plainQuestion,
			answer: plainAnswer,
			parentId: null,
		};
		console.log("Working");
		await dispatch(Actions.CreateFaq(body));
		setIsLoading(true);
		dispatch(closeDialog());
		setIsEditDialogOpen(false);
		getFaqData();
		setIsLoading(false);
	}

	// async function updateFaq(): Promise<void> {
	// 	const body: Partial<Faqs> = {
	// 		question,
	// 		answer,
	// 		parentId: parentFaq.id,
	// 	};
	// 	console.log("Working");
	// 	await dispatch(Actions.UpdateFaq(selectedFaq.id, body));
	// 	setIsLoading(true);
	// 	dispatch(closeDialog());
	// 	setIsEditDialogOpen(false);
	// 	await dispatch(Actions.getAllFaqs());
	// 	setIsLoading(false);
	// }

	// async function saveFaq(): Promise<void> {
	// 	const body: Partial<Faqs> = {
	// 		question,
	// 		answer,
	// 		parentId: parentFaq ? parentFaq.id : null,
	// 	};
	// 	console.log("Working");
	// 	await dispatch(Actions.CreateFaq(body));
	// 	setIsLoading(true);
	// 	dispatch(closeDialog());
	// 	setIsEditDialogOpen(false);
	// 	await dispatch(Actions.getAllFaqs());
	// 	setIsLoading(false);
	// }

	return (
		<AuthWrapper>
			<div className="p-28">
				<div className="flex justify-between">
					<h1>Faqs Management</h1>
					<Button
						onClick={() => {
							handleCreateFaq();
						}}
						className="text-white"
						style={{ backgroundColor: "#28a745" }}
					>
						Create Faq
					</Button>
				</div>

				<Paper className="w-full mt-20 p-10 ">
					{isLoading && <LinearProgress />}

					<DataGrid
						sx={{ width: "100%" }}
						density="comfortable"
						disableRowSelectionOnClick
						rows={allFaq ?? []}
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
								field: "Level",
								headerName: "Level",
								renderCell: ({ row }) => <p>{1}</p>,
							},
							{
								flex: 1,
								field: "question",
								headerName: "Question/Ttle",
								renderCell: ({ row }) => <p>{row.question}</p>,
							},
							{
								flex: 1,
								field: "answer",
								headerName: "Answer/Tree",
								renderCell: ({ row }) => {
									return row.answer ? (
										<p>{row.answer}</p>
									) : (
										<Button
											className="text-white"
											style={{ backgroundColor: "#28a745" }}
											onClick={() => handleViewTree(row.id)}
										>
											View Tree
										</Button>
									);
								},
							},
							{
								flex: 1,
								field: "action",
								headerName: "Action",
								renderCell: ({ row }) => (
									<div className="flex gap-2 mt-[10px]">
										<IconButton
											onClick={() => handleUpdateFaq(row)}
											className="mt-4 mr-5"
										>
											<EditIcon color="secondary" />
										</IconButton>
										<IconButton
											onClick={() => deleteThisFaq(row.id)}
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
						title={"Edit Faq"}
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
								></div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										flexWrap: "wrap",
									}}
								>
									<InputField
										label="Question / Title"
										value={question}
										onChange={setQuestion}
										type="text"
										width="100%"
										textEditor="rich-text"
									/>

									<InputField
										label="Answer"
										value={answer}
										onChange={setAnswer}
										type="text"
										width="100%"
										disabled={isTree}
										placeHolder="Set Tree structure to false in order to provide an answer"
										textEditor="rich-text"
									/>

									<StatusSelect
										label="Tree structure"
										value={isTree}
										onChange={setIsTree}
										menuItems={BoolValue}
									/>
								</div>
							</div>
						}
						onSave={() => {
							isAddingNewFaq ? saveFaq() : updateFaq();
						}}
						saveButtonText="Save"
					/>
				)}
			</div>
		</AuthWrapper>
	);
}

export default Faq;
