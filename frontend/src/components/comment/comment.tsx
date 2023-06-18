import React from 'react';
import { Comment as CommentProps } from '../text-editor/utils';
import {
	Avatar,
	Box,
	Button,
	Card,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';

const Comment = ({
	selectedCommentId,
	...comment
}: CommentProps & { selectedCommentId: string }) => {
	const {
		content,
		_id,
		id,
		commentedBy: { firstName, lastName },
		position: { pageY } = { pageY: 0 },
	} = comment;

	const theme = useTheme();

	return (
		<Card
			variant='elevation'
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-end',
				maxWidth: '280px',
				height: '100px',
				position: 'absolute',
				top: pageY,
				...(selectedCommentId === id ? { right: '30px' } : { right: '20px' }),
				padding: '15px',
			}}>
			<Box
				style={{
					width: '100%',
					display: 'flex',
					marginBottom: '15px',
					marginTop: '15px',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<Avatar
					style={{
						backgroundColor: theme.palette.primary.main,
						marginRight: '15px',
					}}>{`${firstName[0]}${lastName ? lastName[0] : null}`}</Avatar>
				<Typography variant='body1'>{content}</Typography>
			</Box>
		</Card>
	);
};

export default Comment;
