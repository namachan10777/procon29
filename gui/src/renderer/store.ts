import { createStore, combineReducers } from 'redux';
import * as Common from '../common';
import { Option, None } from 'monapt';

export type Pos = {
	x: number,
	y: number
}

enum Icon {
	Human,
	Suggested
}

export type ViewState = {
	color: Common.Color,
	light: boolean, 
	icon: Icon
}

export enum Config {
	Player,
	User
}

export type Server = {
	ip: string,
	port: string,
	socket: WebSocket
}

export type State = {
	connectError: boolean;
	config: Config;
	board: Common.Table;
	//Undo用
	hist: Array<Array<Common.Operation>>;
	server: Server;
	rivalOps: Common.Operation[];
	ops: Common.Operation[];
	highlight: Option<Common.Pos>;
}


let initialBoard = Common.loadBoard(require('./initial_board.json'));

export const initialState: State = {
	connectError: false,
	config: Config.Player,
	hist: [],
	board: initialBoard,
	server: {ip: '127.0.0.1', port: '8080', socket: null},
	rivalOps: [],
	ops: [],
	highlight: None
};

export const getServerInfo = (state: State) => state.server;