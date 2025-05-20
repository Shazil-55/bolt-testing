import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import User from './User';

const UsersPageRoute: FuseRouteItemType = {
	path: 'users',
	element: <User />,
	settings: {
		layout: {
			config: {
				navbar: {
					display: true,
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

export default UsersPageRoute;
