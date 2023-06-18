import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	connectAnchor,
	disconnectAnchor,
	selectAnchor,
} from '../../redux/actions/comments-position';
import { isCommentSelected } from '../../redux/selectors';
import { Dispatch, State } from '../../redux/types';

import { getDoc } from '../anchor-base';

type Props = {
	comment: string;
	className?: string;
	children: React.ReactNode;
};

export const InlineAnchor = (props: Props) => {
	const { comment, children, className } = props;
	const dispatch = useDispatch<Dispatch>();
	const [doc, setDoc] = useState<string>();
	const [ref, setRef] = useState<HTMLSpanElement | null>(null);

	useEffect(() => {
		if (ref == null || doc == null) {
			return () => {
				return undefined;
			};
		}
		return () => dispatch(disconnectAnchor(doc, ref));
	}, [doc, ref]);

	const selected = useSelector((state: State) =>
		isCommentSelected(state, doc, comment)
	);
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
			event.stopPropagation();
			dispatch(selectAnchor(doc, ref));
		},
		[doc, ref]
	);
	const onRef = useCallback((el: HTMLSpanElement) => {
		setRef(el);
		const parentDoc = getDoc(el);
		if (parentDoc) {
			setDoc(parentDoc);
			dispatch(connectAnchor(parentDoc, comment, el));
		}
	}, []);

	const style = {
		backgroundColor: selected ? '#f5c955' : '#f8e4b1',
		':hover': {
			backgroundColor: '#f7cf69b6',
		},
	};
	return (
		<span style={style} onClick={onClick} ref={onRef}>
			{children}
		</span>
	);
};

InlineAnchor.defaultProps = {
	className: undefined,
};

export default InlineAnchor;
