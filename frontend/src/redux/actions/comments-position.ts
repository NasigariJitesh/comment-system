import { v4 as uuid } from 'uuid';
import {
	CONNECT_ANCHOR,
	DESELECT_COMMENT,
	DISCONNECT_ANCHOR,
	CONNECT_COMMENT,
	SELECT_ANCHOR,
	SELECT_COMMENT,
	DISCONNECT_COMMENT,
	CONNECT_ANCHOR_BASE,
	REPOSITION_COMMENTS,
	RESET_ALL_COMMENTS,
} from '../types';
import { AppThunk, CommentsPositionActionTypes } from '../types';
import { selectedComment } from '../selectors';

export function connectComment(
	docId?: string,
	commentId?: string,
	baseId?: string
): AppThunk<void> {
	return (dispatch) => {
		if (docId == null || commentId == null) return;
		dispatch({
			type: CONNECT_COMMENT,
			payload: { docId, commentId, baseId },
		} as CommentsPositionActionTypes);
	};
}

export function connectAnchor(
	docId?: string,
	commentId?: string,
	element?: string | HTMLElement
): AppThunk<void> {
	return (dispatch) => {
		if (docId == null || commentId == null || element == null) return;
		const anchorId = typeof element === 'string' ? element : uuid();
		if (typeof element !== 'string') {
			// eslint-disable-next-line no-param-reassign
			(element as any).anchorId = anchorId;
		}
		dispatch({
			type: CONNECT_ANCHOR,
			payload: {
				docId,
				commentId,
				anchorId,
				element: typeof element === 'string' ? undefined : element,
			},
		} as CommentsPositionActionTypes);
	};
}

export function connectAnchorBase(
	docId?: string,
	anchorId?: string,
	element?: HTMLElement
): AppThunk<void> {
	return (dispatch) => {
		if (docId == null || anchorId == null || element == null) return;
		// eslint-disable-next-line no-param-reassign
		(element as any).anchorId = anchorId;
		dispatch({
			type: CONNECT_ANCHOR_BASE,
			payload: {
				docId,
				anchorId,
				element,
			},
		} as CommentsPositionActionTypes);
	};
}

export function updateComment(
	docId: string,
	commentId: string
): CommentsPositionActionTypes {
	return {
		type: SELECT_COMMENT,
		payload: { docId, commentId },
	};
}

export function selectComment(
	docId?: string,
	commentId?: string
): AppThunk<void> {
	return (dispatch) => {
		dispatch({
			type: SELECT_COMMENT,
			payload: { docId, commentId },
		} as CommentsPositionActionTypes);
	};
}

export function selectAnchor(
	docId?: string,
	anchor?: string | HTMLElement | null
): AppThunk<void> {
	return (dispatch) => {
		if (docId == null || anchor == null) return;
		const anchorId =
			typeof anchor === 'string' ? anchor : (anchor as any).anchorId;
		if (!anchorId) return;
		dispatch({
			type: SELECT_ANCHOR,
			payload: { docId, anchorId },
		} as CommentsPositionActionTypes);
	};
}

export function disconnectComment(
	docId?: string,
	commentId?: string
): AppThunk<void> {
	return (dispatch) => {
		if (docId == null || commentId == null) return;
		dispatch({
			type: DISCONNECT_COMMENT,
			payload: { docId, commentId },
		} as CommentsPositionActionTypes);
	};
}

export function disconnectAnchor(
	docId?: string,
	anchor?: string | HTMLElement | null
): AppThunk<void> {
	return (dispatch) => {
		if (docId == null || anchor == null) return;
		const anchorId =
			typeof anchor === 'string' ? anchor : (anchor as any).anchorId;
		if (!anchorId) return;
		dispatch({
			type: DISCONNECT_ANCHOR,
			payload: { docId, anchorId },
		} as CommentsPositionActionTypes);
	};
}

export function resetAllComments(): AppThunk<void> {
	return (dispatch) => {
		dispatch({
			type: RESET_ALL_COMMENTS,
			payload: {},
		} as CommentsPositionActionTypes);
	};
}

const toggle = { active: false };
export function disableNextDeselectComment() {
	toggle.active = true;
}

export function deselectComment(docId: string): AppThunk {
	return (dispatch, getState) => {
		if (toggle.active) {
			toggle.active = false;
			return;
		}
		const selected = selectedComment(getState(), docId);
		if (selected) {
			dispatch({ type: DESELECT_COMMENT, payload: { docId } });
		}
	};
}

export function repositionComments(docId: string): CommentsPositionActionTypes {
	return { type: REPOSITION_COMMENTS, payload: { docId } };
}
