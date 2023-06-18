import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectAnchorBase } from '../../redux/actions/comments-position';
import { isCommentSelected } from '../../redux/selectors';
import { Dispatch, State } from '../../redux/types';

/**
 * AnchorBase Props
 */
type Props = {
	anchor: string;
	className?: string;
	children: React.ReactNode;
};

export const getDoc = (el: HTMLElement | null) => {
	const doc = el?.closest('article')?.id;
	// eslint-disable-next-line no-console
	if (el && !doc) console.warn('Parent doc for comment not found.');
	return doc || 'global';
};

export const AnchorBase = (props: Props) => {
	const { anchor, children } = props;
	const dispatch = useDispatch<Dispatch>();
	const [doc, setDoc] = useState<string>();
	const [, setRef] = useState<HTMLDivElement | null>(null);

	const onRef = useCallback((el: HTMLDivElement) => {
		setRef(el);
		const parentDoc = getDoc(el);
		if (parentDoc) {
			setDoc(parentDoc);
			dispatch(connectAnchorBase(parentDoc, anchor, el));
		}
		// TODO: handle disconnect in a useEffect
	}, []);

	return <div ref={onRef}>{children}</div>;
};

AnchorBase.defaultProps = {
	className: undefined,
};

export default AnchorBase;
