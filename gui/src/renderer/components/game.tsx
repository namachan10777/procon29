import * as React from 'react';
import * as Common from '../../common';
import Board from '../container/board'
import AppBar from '../container/appbar';
import { ActionDispatcher } from '../container/game';

import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/RadioGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { withStyles, WithStyles } from '@material-ui/core/styles';

import * as Store from '../store';
import { Option } from 'monapt';

const styles={
	input: {
		margin: '1vh'
	},
	button: {
		margin: '1vh'
	},
	fileInput: {
		display: 'none'
	}
};

export interface GameProps extends WithStyles<typeof styles>{
	actions: ActionDispatcher;
	state: Store.UIState
	board: Common.Table;
	server: Store.Server;
	ip: string;
	port: string;
	freeze: boolean;
	time: number;
	dir: string;
	rivalOps: Array<Common.Operation>;
	colorMap: Array<{back: string; forward: string}>;
}

export const Game = withStyles(styles)(
	class extends React.Component<GameProps> {
		render() {
			let page;
			const classes = this.props.classes;
			const props = this.props;
			if (props.state == Store.UIState.Setting) {
				let errorMsg;
				if (!props.server.connected && props.server.msg.length != 0) {
					errorMsg = <span>props.connectionStatus.msg</span>;
				}
				page = (
					<div className='game-settings'>
						<div className='input-container'>
							<TextField
								className={classes.input}
								id='ip'
								label='ip'
								value={props.ip}
								onChange={(e) => props.actions.changeIp(e.target.value)}/>
							<TextField
								className={classes.input}
								id='port'
								label='port'
								value={props.port}
								onChange={(e) => props.actions.changePort(e.target.value)}/>
						</div>
						<div className='button-container'>
							<div className='player-or-user'>
								<Button
									className={classes.button}
									variant='contained'
									color='primary'
									onClick={() => props.actions.connectAsPlayer(Common.Color.Blue)}>
									Player
								</Button>
								<Button
									className={classes.button}
									variant='contained'
									color='primary'
									onClick={() => props.actions.connectAsUser(Common.Color.Blue)}>
									User
								</Button>
							</div>
							<div>
								<Button
									className={classes.button}
									variant='contained'
									color='secondary'
									onClick={() => props.actions.connectAsPlayer(Common.Color.Red)}>
									Player
								</Button>
								<Button
									className={classes.button}
									variant='contained'
									color='secondary'
									onClick={() => props.actions.connectAsUser(Common.Color.Red)}>
									User
								</Button>
							</div>
						</div>
						<input
							accept='application/json,.json'
							className={classes.fileInput}
								id='contained-button-file'
								onChange={(e) => props.actions.loadBoard(e)}
								type='file'/>
						<label htmlFor='contained-button-file'>
							<Button variant='contained' component='span' className={classes.button}>
								File
							</Button>
						</label>
						{errorMsg}
					</div>);
			}
			else if (props.state == Store.UIState.Viewer) {
				page = (
					<div>
						<div className='board-container'>
							<Board table={props.board}/>
						</div>
					</div>
				);
			}
			else {
				let calcSuitDir = (dir: string, op: Common.Operation) => {
					return Math.atan2(op.to.y-op.from.y, op.to.x-op.from.y);
				};
				let baseAngle = 0.0;
				switch (this.props.dir) {
				case 'up': baseAngle = Math.PI*2; break;
				case 'right': baseAngle = Math.PI / 2; break;
				case 'down': baseAngle = Math.PI; break;
				case 'left': baseAngle = Math.PI*3/2; break;
				}
				let spadeAngle = baseAngle, heartAngle = baseAngle + Math.PI;
				for (let i = 0; i < this.props.rivalOps.length; ++i) {
					let op = this.props.rivalOps[i];
					let id =
						this
						.props
						.board
						.arr[op.from.y][op.from.x]
						.agent;
					console.log(id);
					if (this.props.colorMap[id].back == 'red') {
						heartAngle += calcSuitDir(this.props.dir, op);
					}
					else {
						spadeAngle += calcSuitDir(this.props.dir, op);
					}
				}
				let genRotate = (dir: number) => ({
					transform: 'rotate(' + dir + 'rad)'
				});
				let msg = props.freeze ? (<span>waiting for server response</span>) : null;
				let time = props.time.toFixed(1);
				let suggest = props.state == Store.UIState.User ? (
					<div className='suggest-container'>
						<div className='suggest-heart' style={genRotate(heartAngle)}>
							♥
						</div>
						<div className='suggest-spade' style={genRotate(spadeAngle)}>
							♠
						</div>
					</div>
				) : null;
				page = (
					<div>
						<div className='board-container'>
							<Board table={props.board}/>
						</div>
						<div className='info-container'>
							{msg}
						</div>
						<div className='fab'>
							<Button
								variant='fab'
								color='primary'
								aria-label='done'
								disabled={props.freeze}
								onClick={() => props.actions.done()}
								>
								<DoneIcon />
							</Button>
						</div>
						<Button
							aria-label='undo'
							onClick={() => props.actions.undo()}
						>Undo</Button>
						<Typography variant='h4'>
							{time}
						</Typography>
						<div>
							<label>
								<input id='up' type='radio' name='dir' value='up' checked={this.props.dir == 'up'} onChange={() => this.props.actions.changeDir('up')}/>
								up
							</label>
							<label>
								<input id='right' type='radio' name='dir' value='right' checked={this.props.dir == 'right'}  onChange={() => this.props.actions.changeDir('right')}/>
								right
							</label>
							<label>
								<input id='down' type='radio' name='dir' value='down' checked={this.props.dir == 'down'}  onChange={() => this.props.actions.changeDir('down')}/>
								down
							</label>
							<label>
								<input id='left' type='radio' name='dir' value='left' checked={this.props.dir == 'left'} onChange={() => this.props.actions.changeDir('left')}/>
								left
							</label>
						</div>
						<div>
							<Button onClick={() => this.props.actions.swapSuit()}>Swap Suit</Button>
						</div>
						{suggest}
					</div>);
			}
			return (
				<div className='game-root'>
					<AppBar />
					{page}
				</div>
			);
		}
	}
);
