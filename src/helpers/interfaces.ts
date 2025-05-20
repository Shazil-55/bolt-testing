export interface GenericData<T> {
	data: T;
}

export enum StoredKeys {
	colorMode = "colorMode",
	firstOpen = "firstOpen",
	accessToken = "accessToken",
	refreshToken = "refreshToken",
	birthday = "birthday",
	userName = "userName",
	email = "email",
	dfp = "dfp",
	theme = "theme",
}

export interface AdminData {
	id: string;
	name: string;
	email: string;
	password: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserStore {
	isAuth: boolean;
	userData: null | AdminData;
	accessToken: null | string;
	refreshToken: null | string;
	allUsers: null | User[];
	events: null | Events[];
	classes: null | Classes[];
	activities: null | Activities[];
	faqs: null | Faqs[];
	innerFaqs: null | InnerFaq;
}

export interface AuthSuccessResponse {
	accessToken: string;
	refreshToken: string;
}

export enum UserStatus {
	Active = "Active",
	InActive = "InActive",
	Blocked = "Blocked",
}

export enum EditClassMethod {
	ThisWeek = "ThisWeek",
	NextWeek = "NextWeek",
	AllClasses = "AllClasses",
}

export enum EventType {
	Event = "Event",
	Class = "Class",
}

export enum EventStatus {
	Active = "Active",
	Cancelled = "Cancelled",
}

export enum CancelPolicy {
	Flexible = "Flexible",
	Moderate = "Moderate",
	Strict = "Strict",
}

export interface User {
	id: string;
	status: UserStatus;
	name: string;
	userSystemId: string;
	email: string;
	profileImage: string;
	birthday: string;
	currency: string;
	attendance: number;
	userName: string;
	bio: string;
	cancellationPolicy?: CancelPolicy | null;
	averageRating: number;
	exchangeRate?: number;
	pushNotification?: boolean;
	emailNotification?: boolean;
	leaveReview?: boolean;
	seeReviews?: boolean;
	lat: number;
	long: number;
	activityTime: number;
	stripeCustomerId: string;
	stripeAccountId: string;
	referralCode: string;
	referralCount: number;
	userReferralLink: string;
	availableFunds: number;
	pendingFunds: number;
	stripeTransfer: boolean;
	fcmToken: string;
	notificationCount?: number;
	topActivityId?: string | null;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	fingerPrint: string;
}

export interface CustomPackage {
	id: string;
	numberOfClasses: number;
	price: number;
	isUpdated?: boolean;
	isDeleted?: boolean;
	subscriber: number;
}

export interface Activities {
	id: string;
	name: string;
	category?: string;
	icon: string | File;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Faqs {
	id: string;
	question: string;
	answer: string | null;
	parentId: string | null;
	level: number;
	createdAt: string;
	updatedAt: string;
}

export interface InnerFaq {
	parentName: string;
	data: Faqs[];
}

// export interface InnerFaqs {
// 	id: string;
// 	question: string;
// 	answer: string | null;
// 	parentId: string | null;

// 	parentTitle: string | null;

// 	createdAt: string;
// 	updatedAt: string;
// }

export enum RecurringType {
	Daily = "Daily",
	Weekly = "Weekly",
	BiWeekly = "BiWeekly",
	TriWeekly = "TriWeekly",
	Monthly = "Monthly",
}

export interface Classes {
	id: string; // this will be the recurring schedule Id
	activityIcon: string;
	activityName: string;
	className: string;
	host: string;
	type: EventType;

	classId: string;
	classDate: string;
	startTime: string;
	endTime: string;
	lat: number;
	long: number;

	isFirstClassFree: boolean;
	dailyPassPrice: number | null;
	monthlyPassPrice: number | null;
	donationBasedDailyPass: boolean | null;
	donationBasedMonthlyPass: boolean | null;

	confirmedCount?: string; //  number of confirmed attendees
	availableCount?: number; //  number of confirmed attendees

	maximum: number | null;
	minimum: number | null;

	customPackages: CustomPackage[];
	showEvent: boolean;
	classStatus: EventStatus;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateClassInterface {
	id: string;
	scheduleId: string;
	classId: string;
	scheduleDate: string;
	classStatus: EventStatus;
	cancelClass?: boolean;

	name_updated?: string | null;
	description_updated?: string | null;
	dailyPassPrice_updated?: number | null;
	monthlyPassPrice_updated?: number | null;
	lat_updated?: number | null;
	long_updated?: number | null;
	donationBasedDailyPass_updated?: boolean | null;
	donationBasedMonthlyPass_updated?: boolean | null;
	isFirstClassFree_updated?: boolean | null;
	minimum_updated?: number | null;
	maximum_updated?: number | null;
	startTime_updated?: string | null; // Assuming it's a timestamp in ISO string format
	endTime_updated?: string | null;
	stripeMonthlyPriceId_updated?: string | null;

	updateThisClass: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ClassSchedule {
	id?: string; // only for update
	status: boolean;
	day: string;
	startTime: string;
	endTime: string;
}

export interface classLocation {
	id?: string; // only for update
	lat: number;
	long: number;
	schedule: ClassSchedule[];
}

export interface CustomPackages {
	id?: string; // only for update

	numberOfClasses: string;
	price: number;
}

export interface CreateClassInterface {
	name: string;
	description: string;
	hostId: string;
	activityId: string;
	recurringType: RecurringType;
	isFirstClassFree: boolean;
	dailyPassPrice?: number | null;
	monthlyPassPrice?: number | null;
	donationBasedDailyPass?: boolean | null;
	donationBasedMonthlyPass?: boolean | null;
	minimum?: number | null;
	maximum?: number | null;
	currency?: string | null;
	stripeMonthlyPriceId?: string | null;

	customPackage?: CustomPackages[];
	location: classLocation[];
}

export interface Events {
	id: string;
	hostId?: string;
	activityId?: string;
	activityIcon: string;
	activityName: string;
	host: string;
	type: EventType;

	eventId: string;
	eventDate: string;
	startTime: string;
	endTime: string;
	lat: number;
	long: number;
	price?: number | null;
	donation?: boolean;
	isPrivateEvent: boolean;
	isRecurring?: boolean;
	recurringType?: RecurringType;
	currency?: string;
	maximum?: number | null;
	minimum?: number | null;
	showEvent: boolean;
	eventStatus: EventStatus;
	isJoined?: boolean;
	createdAt: string;
	updatedAt: string;

	// Fields to be added

	updateThisEvent: boolean;
	noOfPartciapants: number;
}
