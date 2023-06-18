import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import docsSlice from '../../redux/actions/docs';
import PizZip from 'pizzip';
import { fetchDocuments, uploadDocument } from '../../api-calls';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { DOMParser } from '@xmldom/xmldom';

const str2xml = (str: string) => {
	if (str.charCodeAt(0) === 65279) {
		// BOM sequence
		str = str.substr(1);
	}
	return new DOMParser().parseFromString(str, 'text/xml');
};

const getParagraphs = (content: string | ArrayBuffer) => {
	const zip = new PizZip(content);
	const xml = str2xml(zip.files['word/document.xml'].asText());
	const paragraphsXml = xml.getElementsByTagName('w:p');
	const paragraphs = [];

	for (let i = 0, len = paragraphsXml.length; i < len; i++) {
		let fullText = '';
		const textsXml = paragraphsXml[i].getElementsByTagName('w:t');
		for (let j = 0, len2 = textsXml.length; j < len2; j++) {
			const textXml = textsXml[j];
			if (textXml.childNodes) {
				fullText += textXml.childNodes[0].nodeValue;
			}
		}
		if (fullText) {
			paragraphs.push(fullText);
		}
	}
	return paragraphs;
};

const Home = () => {
	const [file, setFile] = useState<File>();

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const {
		actions: { updateDocs },
	} = docsSlice;

	const user = useSelector((state: RootState) => state.user.value);
	const docs = useSelector((state: RootState) => state.docs.value);
	useEffect(() => {
		const token = JSON.parse(localStorage.getItem('jwt') ?? '');
		fetchDocuments(user._id, token).then((response) => {
			if (response.error) {
			} else dispatch(updateDocs([...response]));
		});
	}, [user]);

	const onClickHandler = (document?: File) => {
		if (!document) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target) {
				const content = e.target.result;
				if (content) {
					const paragraphs = getParagraphs(content);
					const text = paragraphs.join('\n');

					const token = localStorage.getItem('jwt');
					const fileDetails = {
						name: document.name,
						content: text,
						createdBy: user._id,
					};
					uploadDocument(user._id, JSON.parse(token ?? ''), fileDetails).then(
						(response) => {
							dispatch(updateDocs([...docs, response]));
						}
					);
				}
			}
		};
		reader.readAsBinaryString(document);
	};

	return (
		<div>
			Home
			<Box style={{ width: '100%', padding: '50px' }}>
				<input
					type='file'
					onChange={(event) => {
						if (event.target.files) setFile(event.target.files[0]);
					}}
					accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				/>
				<Button
					disabled={file === undefined}
					onClick={() => onClickHandler(file)}>
					Upload
				</Button>
			</Box>
			<Box style={{ padding: '50px' }}>
				<Grid container spacing={2}>
					{docs.map((doc, id) => {
						const {
							name,
							_id,
							createdBy: { firstName, lastName },
							updatedAt,
						} = doc;
						return (
							<Grid item key={id} xs={6} md={4}>
								<Card
									variant='elevation'
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										height: '150px',
										padding: '10px',
									}}
									onClick={() => navigate(`/edit/${_id}`)}>
									<Typography variant='h6'>{name}</Typography>
									<Typography variant='body1'>
										{firstName} {lastName}
									</Typography>
									<Typography variant='body2'>
										Last updated: {new Date(updatedAt).toDateString()}
									</Typography>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			</Box>
		</div>
	);
};

export default Home;
