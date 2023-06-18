import { combineReducers } from '@reduxjs/toolkit';
import {
	CommentsPositionActionTypes,
	SELECT_COMMENT,
	CONNECT_COMMENT,
	DocState,
	CONNECT_ANCHOR,
	SELECT_ANCHOR,
	DISCONNECT_ANCHOR,
	DESELECT_COMMENT,
	DISCONNECT_COMMENT,
	CONNECT_ANCHOR_BASE,
	ANCHOR_BASE,
	REPOSITION_COMMENTS,
	RESET_ALL_COMMENTS,
} from '../types';

export const docReducer = (
	state: DocState,
	action: CommentsPositionActionTypes
): DocState => {
	if (state == null && action.type !== RESET_ALL_COMMENTS) {
		const { docId } = action.payload;
		// eslint-disable-next-line no-param-reassign
		state = {
			id: docId,
			selectedComment: null,
			selectedAnchor: null,
			comments: {},
			anchors: {},
		};
	}
	switch (action.type) {
		case REPOSITION_COMMENTS:
			return state;
		case CONNECT_COMMENT: {
			const { commentId, baseId } = action.payload;
			const baseIds = baseId ? [baseId] : [];
			const prevComment = state.comments[commentId];
			return {
				...state,
				comments: {
					...state.comments,
					[commentId]: {
						...prevComment,
						id: commentId,
						baseAnchors: [...baseIds, ...(prevComment?.baseAnchors ?? [])],
						inlineAnchors: [...(prevComment?.inlineAnchors ?? [])],
					},
				},
			};
		}
		case DISCONNECT_COMMENT: {
			const { commentId } = action.payload;
			const comment = state.comments[commentId];
			if (!comment) return state;

			const comments = { ...state.comments };
			delete comments[comment.id];

			return {
				...state,
				comments,
			};
		}
		case CONNECT_ANCHOR: {
			const { commentId, anchorId, element } = action.payload;

			const prevComment = state.comments[commentId];

			return {
				...state,
				comments: {
					...state.comments,
					[commentId]: {
						...prevComment,
						inlineAnchors: [anchorId, ...(prevComment?.inlineAnchors ?? [])],
					},
				},
				anchors: {
					...state.anchors,
					[anchorId]: {
						id: anchorId,
						comment: commentId,
						element,
					},
				},
			};
		}
		case CONNECT_ANCHOR_BASE: {
			const { anchorId, element } = action.payload;
			return {
				...state,
				anchors: {
					...state.anchors,
					[anchorId]: {
						id: anchorId,
						comment: ANCHOR_BASE,
						element,
					},
				},
			};
		}
		case DISCONNECT_ANCHOR: {
			const { anchorId } = action.payload;
			const anchor = state.anchors[anchorId];
			if (!anchor) return state;

			const anchors = { ...state.anchors };
			delete anchors[anchor.id];

			const comment = state.comments[anchor.comment];

			return {
				...state,
				comments: {
					...state.comments,
					[anchor.comment]: {
						...comment,
						inlineAnchors: [...(comment?.inlineAnchors ?? [])].filter(
							(a) => a !== anchorId
						),
					},
				},
				anchors,
			};
		}
		case SELECT_COMMENT: {
			const { commentId } = action.payload;

			const prevComment = state.comments[commentId];
			return {
				...state,
				selectedComment: commentId,
				selectedAnchor:
					prevComment?.inlineAnchors?.[0] ??
					prevComment?.baseAnchors?.[0] ??
					null,
				comments: {
					...state.comments,
					[commentId]: {
						...prevComment,
						id: commentId,
						baseAnchors: [...(prevComment?.baseAnchors ?? [])],
						inlineAnchors: [...(prevComment?.inlineAnchors ?? [])],
					},
				},
			};
		}
		case SELECT_ANCHOR: {
			const { anchorId } = action.payload;
			const anchor = state.anchors[anchorId];
			if (!anchor) return state;
			const comment = state.comments[anchor.comment];
			// Bring the selected anchor to the front
			const anchors = [
				anchorId,
				...[...(comment?.inlineAnchors ?? [])].filter((a) => a !== anchorId),
			];
			return {
				...state,
				comments: {
					...state.comments,
					[anchor.comment]: {
						...comment,
						inlineAnchors: anchors,
					},
				},
				selectedAnchor: anchorId,
				selectedComment: anchor.comment,
			};
		}
		case DESELECT_COMMENT: {
			return {
				...state,
				selectedAnchor: null,
				selectedComment: null,
			};
		}
		default:
			return state;
	}
};

const reducer = combineReducers({
	docReducer,
});

export default reducer;
