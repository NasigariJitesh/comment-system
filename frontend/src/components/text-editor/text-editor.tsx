import React, { useCallback, useEffect, useState } from 'react';
import {
	Editable,
	RenderElementProps,
	RenderLeafProps,
	Slate,
	withReact,
} from 'slate-react';
import { Editor, createEditor, Node, Descendant, Text } from 'slate';
import {
	Avatar,
	Box,
	Button,
	Card,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useParams } from 'react-router-dom';
import {
	CreateCommentInput,
	createComment,
	fetchDocumentByID,
	getCommentByID,
	getCommentsOfDoc,
	updateDocument,
} from '../../api-calls';
import commentsSlice from '../../redux/actions/comments';
import { getSortedComments, Comment } from './utils';

const getBackgroundColor = (isSelected: boolean, hasComment?: boolean) => {
	if (isSelected) return '#fcad03';
	if (hasComment) return '#fce992';
};

// Define a serializing function that takes a value and returns a string.
const serialize = (value: Descendant[]) => {
	return (
		value
			// Return the string content of each paragraph in the value's children.
			.map((n) => Node.string(n))
			// Join them all with line breaks denoting paragraphs.
			.join('\n')
	);
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string: string) => {
	// Return a value array of children derived by splitting the string.
	return string.split('\n').map((line) => {
		return {
			children: [{ text: line }],
		};
	});
};

const CodeElement = (props: RenderElementProps) => {
	return (
		<pre {...props.attributes}>
			<code>{props.children}</code>
		</pre>
	);
};

const Leaf = (
	props: RenderLeafProps & {
		leaf: Text & {
			bold?: boolean;
			italic?: boolean;
			comment?: boolean;
			commentId?: string;
		};
		selectedId: string;
		updateId: (text: string) => void;
	}
) => {
	return (
		<span
			{...props.attributes}
			style={{
				fontWeight: props.leaf.bold ? 'bold' : 'normal',
				fontStyle: props.leaf.italic ? 'italic' : 'normal',

				backgroundColor: props.leaf.comment
					? getBackgroundColor(
							props.leaf.commentId === props.selectedId,
							props.leaf.comment
					  )
					: undefined,
			}}
			onClick={() => {
				if (props.leaf.comment) {
					props.updateId(props.leaf.commentId ?? '');
				}
			}}>
			{props.children}
		</span>
	);
};

const DefaultElement = (props: RenderElementProps) => {
	return <p {...props.attributes}>{props.children}</p>;
};

const TextEditor = () => {
	const [editor] = useState(() => withReact(createEditor()));

	const theme = useTheme();
	const dispatch = useDispatch();

	const { documentId } = useParams();

	const comments = useSelector((state: RootState) => state.comments.value);
	const user = useSelector((state: RootState) => state.user.value);

	const [currentComments, setCurrentComments] = useState<Comment[]>([]);

	const {
		actions: { updateComments, clearComments },
	} = commentsSlice;

	const [selectedCommentId, setSelectedCommentId] = useState('');

	const [commentFormVisible, setCommentFormVisible] = useState(false);

	const [inputValue, setInputValue] = useState('');
	const [uniqueId, setUniqueId] = useState('');

	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
	} | null>(null);

	const [latestMenuPosition, setLatestMenuPosition] = useState<{
		pageX: number;
		pageY: number;
	} | null>(null);

	const [value, setValue] = useState<Descendant[]>();

	const renderElement = useCallback((props: RenderElementProps) => {
		//@ts-ignore
		switch (props.element.type) {
			case 'code':
				return <CodeElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderLeaf = useCallback(
		(props: RenderLeafProps) => {
			return (
				<Leaf
					{...props}
					selectedId={selectedCommentId}
					updateId={setSelectedCommentId}
				/>
			);
		},
		[selectedCommentId]
	);

	useEffect(() => {
		const token = JSON.parse(localStorage.getItem('jwt') ?? '');

		fetchDocumentByID(user._id, documentId ?? '', token).then((response) => {
			if (response.error) console.error(response.error);
			else {
				if (response.editorContent) {
					setValue(JSON.parse(response.editorContent));
					console.log(JSON.parse(response.editorContent));
				} else setValue(deserialize(response.content));
			}
		});

		getCommentsOfDoc(user._id, documentId ?? '', token).then((response) => {
			if (response.error) console.error(response.error);
			else {
				console.log(response);
				dispatch(updateComments([...response]));
			}
		});
	}, [documentId]);

	useEffect(() => {
		const array = [...comments];
		setCurrentComments([...getSortedComments(array)]);
	}, [comments]);

	useEffect(() => {
		return () => {
			dispatch(clearComments([]));
		};
	}, []);

	const handleSave = (
		userId: string,
		documentId?: string,
		value?: Descendant[]
	) => {
		const token = JSON.parse(localStorage.getItem('jwt') ?? '');
		updateDocument(userId, token, {
			documentId: documentId ?? '',
			editorContent: JSON.stringify(value),
			content: serialize(value ?? []),
		}).then((response) => console.log(response));
	};

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX + 2,
						mouseY: event.clientY - 6,
				  }
				: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
				  // Other native context menus might behave different.
				  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
				  null
		);
		setLatestMenuPosition(
			latestMenuPosition === null
				? {
						pageX: event.pageX,
						pageY: event.pageY,
				  }
				: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
				  // Other native context menus might behave different.
				  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
				  null
		);
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	const handleCommentSubmit = (input: string, userId: string, id: string) => {
		const comment = {
			commentedBy: userId,
			content: input,
			id,
			...(latestMenuPosition
				? { position: { ...latestMenuPosition } }
				: { position: { pageX: 0, pageY: 0 } }),

			document: documentId ?? '',
		};

		const token = JSON.parse(localStorage.getItem('jwt') ?? '');

		createComment(userId, token, comment).then((response) => {
			if (response.error) {
				console.error(response.error);
			} else {
				getCommentByID(userId, response._id, token).then((response) => {
					if (response.error) {
						console.error(response.error);
					} else {
						console.log(response);
						dispatch(updateComments([...comments, response]));
					}
				});
			}
		});
		setUniqueId('');
		setInputValue('');
		setLatestMenuPosition(null);
		setCommentFormVisible(false);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				backgroundColor: '#9c9b9a',
			}}>
			<Button
				onClick={() => handleSave(user._id, documentId, value)}
				variant='contained'
				style={{
					marginTop: '30px',
					marginRight: '30px',
					alignSelf: 'flex-end',
				}}>
				Save
			</Button>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
				}}>
				{value ? (
					<div
						onContextMenu={handleContextMenu}
						style={{ cursor: 'context-menu' }}>
						<Slate
							editor={editor}
							initialValue={value}
							onChange={(value) => {
								setValue(value);
							}}>
							<Editable
								style={{
									maxWidth: '800px',
									minHeight: '1200px',
									borderWidth: '0px',
									outlineWidth: '0px',
									margin: '10px',
									padding: '5px 10px',
									borderRadius: '12px',
									backgroundColor: '#fcfcfc',
								}}
								renderElement={renderElement}
								renderLeaf={renderLeaf}
							/>
						</Slate>
						<Menu
							open={contextMenu !== null}
							onClose={handleClose}
							anchorReference='anchorPosition'
							anchorPosition={
								contextMenu !== null
									? { top: contextMenu.mouseY, left: contextMenu.mouseX }
									: undefined
							}>
							<MenuItem
								onClick={() => {
									Editor.addMark(editor, 'bold', true);
									handleClose();
								}}>
								Bold
							</MenuItem>
							<MenuItem
								onClick={() => {
									Editor.addMark(editor, 'italic', true);
									handleClose();
								}}>
								Italic
							</MenuItem>
							<MenuItem
								onClick={() => {
									Editor.addMark(editor, 'underline', true);
									handleClose();
								}}>
								Underline
							</MenuItem>
							<MenuItem
								onClick={() => {
									const id = uuid();
									setUniqueId(id);
									Editor.addMark(editor, 'comment', true);
									Editor.addMark(editor, 'commentId', id);
									setCommentFormVisible(true);
									handleClose();
								}}>
								Comment
							</MenuItem>
						</Menu>
					</div>
				) : null}
				<Box style={{ width: '300px', alignSelf: 'stretch' }}>
					{commentFormVisible ? (
						<Card
							variant='elevation'
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-end',
								maxWidth: '280px',
								minHeight: '100px',
								position: 'absolute',
								top: latestMenuPosition?.pageY,
								right: '20px',
								padding: '15px',
								zIndex: 1000,
							}}>
							<IconButton
								onClick={() => {
									setUniqueId('');
									setInputValue('');
									setLatestMenuPosition(null);
									setCommentFormVisible(false);
								}}>
								<CloseIcon />
							</IconButton>
							<Box
								style={{
									width: '100%',
									minHeight: '80px',
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
									}}>{`${user.firstName[0]}${
									user.lastName ? user.lastName[0] : null
								}`}</Avatar>
								<TextField
									variant='outlined'
									label='Comment'
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									multiline
									rows={3}
									style={{ flex: 1 }}
								/>
							</Box>
							<Button
								onClick={() =>
									handleCommentSubmit(inputValue, user._id, uniqueId)
								}
								variant='contained'>
								Submit
							</Button>
						</Card>
					) : null}

					{currentComments.map((comment, index) => {
						const {
							content,
							_id,
							id,
							commentedBy: { firstName, lastName },
							position: { pageY } = { pageY: 0 },
						} = comment;
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
									...(selectedCommentId === id
										? { right: '30px' }
										: { right: '20px' }),
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
										}}>{`${firstName[0]}${
										lastName ? lastName[0] : null
									}`}</Avatar>
									<Typography variant='body1'>{content}</Typography>
								</Box>
								<TextField variant='outlined'></TextField>
							</Card>
						);
					})}
				</Box>
			</div>
		</div>
	);
};

export default TextEditor;
