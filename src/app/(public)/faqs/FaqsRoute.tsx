import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import authRoles from "@auth/authRoles";
import Faq from "./Faqs";

const FaqsPageRoute: FuseRouteItemType = {
	path: "faqs",
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

export default FaqsPageRoute;
