import React, { useEffect, useState } from "react";
import {
	ContentState,
	convertFromRaw,
	convertToRaw,
	Editor,
	EditorState,
} from "draft-js";
import "draft-js/dist/Draft.css"; // Import the styles
import { TextField } from "@mui/material";

const InputField = ({
	label,
	value,
	onChange,
	type,
	width = "48%",
	placeHolder = "",
	min = null,
	max = null,
	disabled = false,
	textEditor = "normal",
}) => {
	const [editorState, setEditorState] = useState(() => {
		if (textEditor === "rich-text" && value) {
			try {
				const parsedValue = JSON.parse(value);
				if (parsedValue.blocks) {
					const contentState = convertFromRaw(parsedValue);
					return EditorState.createWithContent(contentState);
				}
			} catch (error) {
				console.error("Invalid rich-text JSON:", error);
			}
		}
		return EditorState.createEmpty();
	});

	// Sync editorState with value when it changes
	useEffect(() => {
		if (textEditor === "rich-text" && value) {
			try {
				// Ensure value is valid JSON before parsing
				const parsedValue =
					typeof value === "string" ? JSON.parse(value) : value;

				if (parsedValue && parsedValue.blocks) {
					const contentState = convertFromRaw(parsedValue);
					const newEditorState = EditorState.createWithContent(contentState);

					// ✅ Prevents resetting the editor when content hasn't changed
					if (
						editorState.getCurrentContent().getPlainText() !==
						newEditorState.getCurrentContent().getPlainText()
					) {
						setEditorState(newEditorState);
					}
					return;
				}
			} catch (error) {
				console.warn("Invalid rich-text JSON, treating as plain text:", value);
			}

			// ✅ Prevent resetting state if the value hasn't changed
			if (editorState.getCurrentContent().getPlainText() !== value) {
				const contentState = ContentState.createFromText(value || "");
				setEditorState(EditorState.createWithContent(contentState));
			}
		}
		// ⚠️ Do NOT include `editorState` in dependencies, or it'll reset on every keystroke
	}, [value, textEditor]);

	// Handle rich text changes
	const handleEditorChange = (newEditorState) => {
		setEditorState(newEditorState); // Update editor state properly

		const contentState = newEditorState.getCurrentContent();
		const rawContent = JSON.stringify(convertToRaw(contentState));

		onChange(rawContent); // Store the rich text as JSON
	};

	// If the type is not "rich-text", render the original TextField
	if (textEditor !== "rich-text") {
		return (
			<div style={{ width }}>
				<h4 style={{ marginTop: "30px", marginBottom: "10px" }}>{label}</h4>
				<TextField
					fullWidth
					variant="outlined"
					type={type}
					value={value}
					placeholder={placeHolder || "N/A"}
					disabled={disabled}
					onChange={(e) => {
						const inputValue = e.target.value;

						if (type === "number") {
							// Allow only valid numeric input or empty
							const isValidNumber = /^(\d*\.?\d*)?$/.test(inputValue);

							if (isValidNumber) {
								if (inputValue === "") {
									onChange(null); // Pass null when input is cleared
								} else {
									let parsedValue = parseFloat(inputValue);

									// Apply min and max constraints
									if (min !== null && parsedValue < min) {
										parsedValue = min;
									}
									if (max !== null && parsedValue > max) {
										parsedValue = max;
									}

									onChange(parsedValue); // Pass the number
								}
							}
						} else {
							onChange(inputValue); // Handle non-number fields
						}
					}}
					inputProps={{
						min,
						max,
					}}
				/>
			</div>
		);
	}

	// Render the rich text editor
	return (
		<div style={{ width }}>
			<h4 style={{ marginTop: "30px", marginBottom: "10px" }}>{label}</h4>
			<div
				style={{
					border: "1px solid #ccc",
					padding: "10px",
					borderRadius: "4px",
					minHeight: "100px",
					backgroundColor: disabled ? "#f5f5f5" : "inherit",
					pointerEvents: disabled ? "none" : "auto",
					opacity: disabled ? 0.7 : 1,
				}}
			>
				<Editor
					editorState={editorState}
					onChange={handleEditorChange}
					readOnly={disabled}
					placeholder={placeHolder}
				/>
			</div>
		</div>
	);
};

export default InputField;
