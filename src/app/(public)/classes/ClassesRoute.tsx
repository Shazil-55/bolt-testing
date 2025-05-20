import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import Classes from './Classes';

const ClassesPageRoute: FuseRouteItemType = {
	path: 'classes',
	element: <Classes />,
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

export default ClassesPageRoute;
