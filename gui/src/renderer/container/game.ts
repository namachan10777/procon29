import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';
import * as Common from '../../common';

import * as GameModule from '../module/game';
import * as AppModule from '../module/app';
import * as ServerModule from '../module/server';
import * as ServerSaga from '../saga/server';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}

	changeIp(ip: string) {
		this.dispatch({type: ServerModule.ActionNames.CHANGE_IP_ADDRESS, payload: {ip}});
	}

	changePort(port: string) {
		this.dispatch({type: ServerModule.ActionNames.CHANGE_PORT, payload: {port}});
	}

	connectAsPlayer(color: Common.Color) {
		this.dispatch({
			type: ServerSaga.ActionNames.CONNECT_SOCKET,
			payload: {
				state: Store.UIState.Player,
				color
			}
		});
	}


	connectAsUser(color: Common.Color) {
		this.dispatch({
			type: ServerSaga.ActionNames.CONNECT_SOCKET,
			payload: {
				state: Store.UIState.User,
				color
			}
		});
	}

	loadBoard(e: any) {
		const reader = new FileReader();
		const path = e.target.files[0];
		console.log(e.target.files);
		reader.onload = (e: any) => {
			this.dispatch({
				type: AppModule.ActionNames.UPDATE_BOARD,
				payload: {
					board: Common.loadBoard(JSON.parse(e.target.result))
				}
			});
			this.dispatch({
				type: AppModule.ActionNames.TRANSITION,
				payload: {
					state: Store.UIState.Viewer,
					color: Common.Color.Neut
				}
			});
		};
		reader.readAsText(path);
	}

	changeDir(dir: string) {
		console.log(dir);
		this.dispatch({
			type: AppModule.ActionNames.CHANGE_DIR,
			payload: {
				dir
			}
		});
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		ip: state.server.ip,
		port: state.server.port,
		state: state.state,
		freeze: state.freeze,
		board: state.board,
		server: state.server,
		dir: state.dir,
		colorMap: state.colorMap,
		rivalOps: state.rivalOps,
		turn: state.turn,
		score: state.score,
		boardIsValid: state.boardIsValid
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);
