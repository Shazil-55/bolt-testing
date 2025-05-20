import i18n from "@i18n";
import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18n.addResourceBundle("en", "navigation", en);
i18n.addResourceBundle("tr", "navigation", tr);
i18n.addResourceBundle("ar", "navigation", ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: "users-component",
		title: "Users",
		translate: "Users",
		type: "item",
		icon: "heroicons-outline:star",
		url: "users",
	},
	{
		id: "events-component",
		title: "Events",
		translate: "Events",
		type: "item",
		icon: "heroicons-outline:star",
		url: "events",
	},
	{
		id: "classes-component",
		title: "Classes",
		translate: "Classes",
		type: "item",
		icon: "heroicons-outline:star",
		url: "classes",
	},
	{
		id: "activities-component",
		title: "Activities",
		translate: "Activities",
		type: "item",
		icon: "heroicons-outline:star",
		url: "activities",
	},
	{
		id: "faqs-component",
		title: "Faqs",
		translate: "Faqs",
		type: "item",
		icon: "heroicons-outline:star",
		url: "faqs",
	},
];

export default navigationConfig;
