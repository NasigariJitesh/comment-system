import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

import type {
	Action,
	Middleware as RMiddleware,
	Reducer as RReducer,
} from 'redux';
import {
	CommentsPositionActionTypes,
	PositionsState,
} from './comments-position';

export interface State {
	commentsPositions: PositionsState;
}

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	State,
	null,
	Action<string>
>;
export type Dispatch = ThunkDispatch<State, null, Action<string>>;

export type Middleware = RMiddleware<any, State, Dispatch>;
export type Reducer = RReducer<State, CommentsPositionActionTypes>;
