// This is a placeholder for base-anchors
export const ANCHOR_BASE = 'ANCHOR_BASE';

export const CONNECT_COMMENT = 'CONNECT_COMMENT';
export const DISCONNECT_COMMENT = 'DISCONNECT_COMMENT';
export const CONNECT_ANCHOR = 'CONNECT_ANCHOR';
export const CONNECT_ANCHOR_BASE = 'CONNECT_ANCHOR_BASE';
export const DISCONNECT_ANCHOR = 'DISCONNECT_ANCHOR';
export const SELECT_COMMENT = 'SELECT_COMMENT';
export const DESELECT_COMMENT = 'DESELECT_COMMENT';
export const SELECT_ANCHOR = 'SELECT_ANCHOR';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const REPOSITION_COMMENTS = 'REPOSITION_COMMENTS';
export const RESET_ALL_COMMENTS = 'RESET_ALL_COMMENTS';

export type Comment = {
	id: string;
	baseAnchors: string[];
	inlineAnchors: string[];
	top: number;
	visible: boolean;
};

export type Anchor = {
	id: string;
	comment: typeof ANCHOR_BASE | string;
	element?: HTMLElement;
};

export type DocState = {
	id: string;
	selectedComment: string | null;
	selectedAnchor: string | null;
	comments: Record<string, Comment>;
	anchors: Record<string, Anchor>;
};

export type PositionsState = {
	docs: Record<string, DocState>;
};

export interface ConnectCommentAction {
	type: typeof CONNECT_COMMENT;
	payload: {
		docId: string;
		commentId: string;
		baseId?: string;
	};
}

export interface DisconnectAnchorAction {
	type: typeof DISCONNECT_ANCHOR;
	payload: {
		docId: string;
		anchorId: string;
	};
}

export interface ResetAllCommentsAction {
	type: typeof RESET_ALL_COMMENTS;
}

export interface ConnectAnchorAction {
	type: typeof CONNECT_ANCHOR;
	payload: {
		docId: string;
		commentId: string;
		anchorId: string;
		element?: HTMLElement;
	};
}

export interface ConnectAnchorBaseAction {
	type: typeof CONNECT_ANCHOR_BASE;
	payload: {
		docId: string;
		anchorId: string;
		element: HTMLElement;
	};
}

export interface DisconnectCommentAction {
	type: typeof DISCONNECT_COMMENT;
	payload: {
		docId: string;
		commentId: string;
	};
}

export interface SelectCommentAction {
	type: typeof SELECT_COMMENT;
	payload: {
		docId: string;
		commentId: string;
	};
}
export interface SelectAnchorAction {
	type: typeof SELECT_ANCHOR;
	payload: {
		docId: string;
		anchorId: string;
	};
}
export interface DeselectCommentAction {
	type: typeof DESELECT_COMMENT;
	payload: {
		docId: string;
	};
}
export interface RepositionCommentsAction {
	type: typeof REPOSITION_COMMENTS;
	payload: {
		docId: string;
	};
}

export type CommentsPositionActionTypes =
	| ConnectCommentAction
	| DisconnectCommentAction
	| ConnectAnchorAction
	| ConnectAnchorBaseAction
	| DisconnectAnchorAction
	| SelectCommentAction
	| SelectAnchorAction
	| DeselectCommentAction
	| RepositionCommentsAction
	| ResetAllCommentsAction;
