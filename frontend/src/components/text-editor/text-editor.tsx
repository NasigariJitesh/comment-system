import React, { useCallback, useState } from 'react';
import {
	Editable,
	RenderElementProps,
	RenderLeafProps,
	Slate,
	withReact,
} from 'slate-react';
import {
	Editor,
	Transforms,
	Element,
	createEditor,
	Node,
	Descendant,
} from 'slate';
import { Button, Menu, MenuItem } from '@mui/material';
import InlineAnchor from '../inline-anchor';
import AnchorBase from '../anchor-base';
import CommentContainer from '../comment-container';

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

const Leaf = (props: RenderLeafProps) => {
	return (
		//@ts-expect-error
		props.leaf.bold ? (
			<InlineAnchor comment={'first'}>
				<span
					{...props.attributes}
					style={{
						//@ts-expect-error
						fontWeight: props.leaf.bold ? 'bold' : 'normal',
						//@ts-expect-error
						fontStyle: props.leaf.italic ? 'italic' : 'normal',
						//@ts-expect-error
						textDecorationStyle: props.leaf.underline ? 'solid' : undefined,
					}}>
					{props.children}
				</span>
			</InlineAnchor>
		) : (
			<span
				{...props.attributes}
				style={{
					//@ts-expect-error
					fontWeight: props.leaf.bold ? 'bold' : 'normal',
					//@ts-expect-error
					fontStyle: props.leaf.italic ? 'italic' : 'normal',
					//@ts-expect-error
					textDecorationStyle: props.leaf.underline ? 'solid' : undefined,
				}}>
				{props.children}
			</span>
		)
	);
};

const DefaultElement = (props: RenderElementProps) => {
	return <p {...props.attributes}>{props.children}</p>;
};

const TextEditor = () => {
	const [editor] = useState(() => withReact(createEditor()));

	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
	} | null>(null);

	const [value, setValue] =
		useState(`Now you should be able to save changes across refreshes!
  Success—you've got JSON in your database.
  But what if you want something other than JSON? Well, you'd need to serialize your value differently. For example, if you want to save your content as plain text instead of JSON, we can write some logic to serialize and deserialize plain text values:`);

	const renderElement = useCallback((props: RenderElementProps) => {
		//@ts-ignore
		switch (props.element.type) {
			case 'code':
				return <CodeElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderLeaf = useCallback((props: RenderLeafProps) => {
		return <Leaf {...props} />;
	}, []);

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		console.log(event);
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
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-around',
			}}>
			<AnchorBase anchor={'text-editor'}>
				<div
					onContextMenu={handleContextMenu}
					style={{ cursor: 'context-menu' }}>
					<Slate
						editor={editor}
						initialValue={deserialize(value)}
						onChange={(value) => {
							setValue(serialize(value));
						}}>
						<Editable
							renderElement={renderElement}
							renderLeaf={renderLeaf}
							onKeyDown={(event) => {
								console.log(event);

								if (event.code === 'Backquote' && event.ctrlKey) {
									// Prevent the "`" from being inserted by default.
									event.preventDefault();
									// Otherwise, set the currently selected blocks type to "code".
									Transforms.setNodes<{ type: string } & Node>(
										editor,
										{ type: 'code' },
										{
											match: (n) =>
												Element.isElement(n) && Editor.isBlock(editor, n),
										}
									);
								}

								switch (event.key) {
									case 'b': {
										event.preventDefault();
										Editor.addMark(editor, 'bold', true);
										break;
									}
								}
							}}
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
								Editor.addMark(editor, 'code', true);
								handleClose();
							}}>
							Code
						</MenuItem>
					</Menu>
					<Button onClick={() => console.log(JSON.stringify(value))}>
						Print
					</Button>
				</div>
			</AnchorBase>
			{/* <div className='commentContainers'>
				<CommentContainer comment={'first'} base={'text-editor'}>
					<div style={{ width: 280, height: 150, backgroundColor: 'blue' }} />
				</CommentContainer>
			</div> */}
		</div>
	);
};

export default TextEditor;
