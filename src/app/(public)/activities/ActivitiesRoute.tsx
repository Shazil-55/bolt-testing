import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import Activity from './Activities';

const ActivitiesPageRoute: FuseRouteItemType = {
	path: 'activities',
	element: <Activity />,
	settings: {
		layout: {
			config: {
				navbar: {
					display: true
				},
				toolbar: {
					display: true
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: true
				},
				rightSidePanel: {
					display: true
				}
			}
		}
	},
	auth: authRoles.onlyGuest // []
};

export default ActivitiesPageRoute;
