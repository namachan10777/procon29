import * as React from 'react';
import Board from '../container/board'
import AppBar from '../container/appbar';
import Drawer from '../container/drawer';
import { ActionDispatcher } from '../container/game';

import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

import { withStyles, WithStyles } from '@material-ui/core/styles';

import * as Store from '../store';

export interface GameProps {
	board: Store.Table;
	actions: ActionDispatcher;
}

const styles={};

type ClassNames = keyof typeof styles;

export const Game = withStyles(styles)<GameProps>(
	(props: GameProps & WithStyles<ClassNames>) => {
		const classes = props.classes;
		return (
			<div>
				<AppBar />
				<Drawer />
				<div className='board-container'>
					<Board />
				</div>
				<div className='info-container'>
				</div>
				<div className='fab'>
					<Button variant='fab' color='primary' aria-label='done' onClick={() => props.actions.done()}>
 						<DoneIcon />
					</Button>
				</div>
			</div>
		);
	}
);
