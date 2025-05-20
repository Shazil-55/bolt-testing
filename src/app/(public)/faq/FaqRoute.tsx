import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import authRoles from "@auth/authRoles";
import Faq from "./Faq";

const FaqPageRoute: FuseRouteItemType = {
	path: "faq",
	element: <Faq />,
	settings: {
		layout: {
			config: {
				navbar: {
					display: true,
				},
				toolbar: {
					display: true,
				},
				footer: {
					display: false,
				},
				leftSidePanel: {
					display: true,
				},
				rightSidePanel: {
					display: true,
				},
			},
		},
	},
	auth: authRoles.onlyGuest, // []
};

export default FaqPageRoute;
