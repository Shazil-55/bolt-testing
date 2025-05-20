import React, { useEffect, useRef, useState } from "react";
import { MAP_KEY } from "./constants";

const PlaceSearch = ({ onPlaceSelected }) => {
	const inputRef = useRef(null);

	useEffect(() => {
		// Load the Google Maps script dynamically
		const loadGoogleMapsScript = () => {
			if (!window.google) {
				const script = document.createElement("script");
				script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`;
				script.async = true;
				script.onload = () => initializeAutocomplete();
				console.log("SCRIPT", script);
				document.body.appendChild(script);
			} else {
				initializeAutocomplete();
			}
		};

		const initializeAutocomplete = () => {
			if (inputRef.current && window.google) {
				const autocomplete = new window.google.maps.places.Autocomplete(
					inputRef.current,
					{ types: ["geocode"] } // Restrict to address or places
				);

				autocomplete.addListener("place_changed", () => {
					const place = autocomplete.getPlace();
					if (place.geometry) {
						const { lat, lng } = place.geometry.location;
						onPlaceSelected({ lat: lat(), lng: lng(), name: place.name });
					}
				});
			}
		};

		loadGoogleMapsScript();
	}, [onPlaceSelected]);

	return (
		<div>
			<input
				type="text"
				ref={inputRef}
				placeholder="Search for a place..."
				style={{
					width: "100%",
					padding: "10px",
					fontSize: "16px",
					margin: "10px 0",
					position: "relative" /* Ensure the input is positioned correctly */,
					zIndex: 99999, //
				}}
			/>
		</div>
	);
};

export default PlaceSearch;
