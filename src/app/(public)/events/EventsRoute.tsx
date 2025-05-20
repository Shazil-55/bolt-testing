import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import Events from './Events';

const EventsPageRoute: FuseRouteItemType = {
	path: 'events',
	element: <Events />,
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

export default EventsPageRoute;
