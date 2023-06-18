import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
	connectComment,
	selectComment,
} from '../../redux/actions/comments-position';
import { commentTop, isCommentSelected } from '../../redux/selectors';
import { Dispatch, State } from '../../redux/types';

import { getDoc } from '../anchor-base';

type Props = {
	base?: string;
	comment: string;
	children: React.ReactNode;
};

export const CommentContainer = (props: Props) => {
	const { base, comment, children } = props;
	const dispatch = useDispatch<Dispatch>();
	const [doc, setDoc] = useState<string>();

	const selected = useSelector((state: State) =>
		isCommentSelected(state, doc, comment)
	);
	const top = useSelector((state: State) => commentTop(state, doc, comment));
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			event.stopPropagation();
			if (selected) return;
			dispatch(selectComment(doc, comment));
		},
		[doc, selected]
	);
	const onRef = useCallback((el: HTMLDivElement) => {
		const parentDoc = getDoc(el);
		if (parentDoc) {
			setDoc(parentDoc);
			dispatch(connectComment(parentDoc, comment, base));
		}
	}, []);

	const style = {
		position: 'absolute' as const,
		width: '280px',
		transition: 'all 300ms cubic-bezier(0.655, 0.18, 0.3, 1.255)',
		left: selected ? '-10px' : '10px',
		top: top,
	};
	return (
		<div id={comment} style={style} onClick={onClick} ref={onRef}>
			{children}
		</div>
	);
};

CommentContainer.defaultProps = {
	base: undefined,
};

export default CommentContainer;
