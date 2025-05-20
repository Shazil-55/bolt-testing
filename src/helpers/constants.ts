// export const END_POINT = import.meta?.env?.VITE_API_BASE_URL as string

export const END_POINT = getEndpoint();
export const MAP_KEY = import.meta.env.VITE_MAP_KEY as string;
export const PRIMARY_GREEN = "#03BD66";

function getEndpoint() {
	   return "https://new-backend.flakex.com/api/v_1/internal"
	if (window.location.origin === "http://localhost:3000") {
		return "http://localhost:8000/api/v_1/internal";
	} else {
		return "https://flakex-dev.flakex.com/api/v_1/internal";
	}

	return;
}
