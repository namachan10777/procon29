import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Store from '../store';
import * as Actions from '../actions';

import AppBarComponent from '../component/appbar';
import * as AppModule from '../module/app';
import * as DrawerModule from '../module/drawer';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	close() {
		return this.dispatch({type: AppModule.ActionNames.CLOSE_WINDOW});
	}

	openDrawer() {
		return this.dispatch({type: DrawerModule.ActionNames.OPEN_DRAWER});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({state: state.state}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(AppBarComponent);
