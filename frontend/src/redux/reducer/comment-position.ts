import { opts } from '../connect';
import { docReducer } from './doc';
import {
	PositionsState,
	CommentsPositionActionTypes,
	CONNECT_COMMENT,
	SELECT_COMMENT,
	CONNECT_ANCHOR,
	SELECT_ANCHOR,
	DocState,
	DISCONNECT_ANCHOR,
	DESELECT_COMMENT,
	CONNECT_ANCHOR_BASE,
	REPOSITION_COMMENTS,
	RESET_ALL_COMMENTS,
	DISCONNECT_COMMENT,
	Comment,
} from '../types';
import { combineReducers } from '@reduxjs/toolkit';

export const initialState: PositionsState = {
	docs: {},
};

function getHeight(id: string) {
	return document.getElementById(id)?.offsetHeight ?? 0;
}

function getAnchorElement(
	state: DocState,
	comment: Comment
): HTMLElement | null {
	// Iterate through all of the inline, and then work towards base anchors
	// This should return fast, usually the first element is defined!
	// If an ID is removed from the DOM, this falls back to any other anchors
	const allAnchors = [
		...(comment.inlineAnchors ?? []),
		...(comment.baseAnchors ?? []),
	];
	for (let index = 0; index < allAnchors.length; index += 1) {
		const anchor = state.anchors[allAnchors[index]];
		const element =
			anchor?.element ?? document.getElementById(anchor?.id ?? '');
		if (element) return element;
	}
	return null;
}

function getTopLeft(anchor: HTMLElement | null) {
	// Recurse up the tree until you find the article (nested relative offsets)
	let el: HTMLElement | null = anchor;
	let top = 0;
	let left = 0;
	do {
		top += el?.offsetTop || 0;
		left += el?.offsetLeft || 0;
		el = (el?.offsetParent ?? null) as HTMLElement | null;
	} while (el && el.tagName !== 'ARTICLE');
	return { top, left };
}

function placeComments(state: DocState, actionType: string): DocState {
	// Do not place comments if it is a deselect call
	if (actionType === DESELECT_COMMENT) return state;
	type Loc = [string, { top: number; left: number; height: number }];
	let findMe: Loc | undefined;
	const sorted = Object.entries(state.comments)
		.map(([id, comment]) => {
			const element = getAnchorElement(state, comment);
			const loc: Loc = [id, { ...getTopLeft(element), height: getHeight(id) }];
			if (id === state.selectedComment) {
				findMe = loc;
			}
			return loc;
		})
		.sort((a, b) => {
			if (a[1].top === b[1].top) return a[1].left - b[1].left;
			return a[1].top - b[1].top;
		});

	const idx = findMe ? sorted.indexOf(findMe) : 0;
	// Push upwards from target (or nothing)
	const before = sorted.slice(0, idx + 1).reduceRight((prev, [id, loc]) => {
		const { top } = prev[prev.length - 1]?.[1] ?? {};
		const newTop =
			Math.min(top - loc.height - opts.padding, loc.top) || loc.top;
		const next = [id, { top: newTop, height: loc.height }] as Loc;
		return [...prev, next];
	}, [] as Loc[]);

	// Push comments downward
	const after = sorted.slice(idx).reduce((prev, [id, loc]) => {
		const { top, height } = prev[prev.length - 1]?.[1] ?? {};
		const newTop = Math.max(top + height + opts.padding, loc.top) || loc.top;
		const next = [id, { top: newTop, height: loc.height }] as Loc;
		return [...prev, next];
	}, [] as Loc[]);

	const idealPlacement = Object.fromEntries([...before, ...after]);

	let hasChanges = false;
	const comments = Object.fromEntries(
		Object.entries(state.comments).map(([id, comment]) => {
			const { top } = idealPlacement[id];
			if (comment.top !== top) {
				hasChanges = true;
				return [id, { ...comment, top }];
			}
			return [id, comment];
		})
	);
	if (!hasChanges) return state;
	return {
		...state,
		comments,
	};
}

const commentPositionReducer = (
	state = initialState,
	action: CommentsPositionActionTypes
): PositionsState => {
	switch (action.type) {
		case SELECT_COMMENT:
		case SELECT_ANCHOR:
		case CONNECT_COMMENT:
		case CONNECT_ANCHOR:
		case CONNECT_ANCHOR_BASE:
		case DISCONNECT_ANCHOR:
		case DISCONNECT_COMMENT:
		case DESELECT_COMMENT:
		case REPOSITION_COMMENTS: {
			const { docId } = action.payload ? action.payload : { docId: '123' };
			const nextDoc = placeComments(
				docReducer(state.docs[docId], action),
				action.type
			);
			return {
				...state,
				docs: {
					...state.docs,
					[docId]: nextDoc,
				},
			};
		}
		case RESET_ALL_COMMENTS: {
			return {
				...state,
				docs: {},
			};
		}
		default:
			return state;
	}
};

const reducer = combineReducers({
	commentPositionReducer,
});

export default reducer;
