import { State } from '../types';

export function selectedComment(state: State, docId?: string | null) {
	if (docId == null) return null;
	return state.commentsPositions.docs[docId]?.selectedComment;
}

export function isCommentSelected(
	state: State,
	docId?: string | null,
	commentId?: string | null
) {
	if (docId == null || commentId == null) return false;
	return state.commentsPositions.docs[docId]?.selectedComment === commentId;
}

export function commentTop(
	state: State,
	docId?: string | null,
	commentId?: string | null
) {
	if (docId == null || commentId == null) return 0;
	return state.commentsPositions.docs[docId]?.comments[commentId]?.top ?? 0;
}

export function isAnchorSelected(
	state: State,
	docId: string | null,
	anchorId: string | null
) {
	if (docId == null || anchorId == null) return false;
	return state.commentsPositions.docs[docId]?.selectedAnchor === anchorId;
}
