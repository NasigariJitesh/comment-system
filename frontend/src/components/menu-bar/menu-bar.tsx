import { Box, IconButton, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from '../../api-calls';

const styles = (theme: Theme) => {
	const style = {
		topBar: {
			backgroundColor: theme.palette.secondary.main,
			display: 'flex',
			height: '70px',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-end',
			paddingLeft: '50px',
			paddingRight: '50px',
			paddingTop: '10px',
			paddingBottom: '10px',
		},
	} as const;

	return style;
};

const links = [
	{
		path: '/',
		name: 'Home',
	},
];

const MenuBar = () => {
	const theme = useTheme();
	const { topBar } = styles(theme);

	const { pathname } = useLocation();
	const navigate = useNavigate();

	if (pathname === '/signup' || pathname === '/signin') return null;

	return (
		<Box style={topBar}>
			{links.map((link, id) => (
				<Link
					key={id}
					to={link.path}
					style={{ marginLeft: '10px', marginRight: '10px' }}>
					<Typography align='center'>{link.name}</Typography>
				</Link>
			))}

			<IconButton
				aria-label='toggle password visibility'
				onClick={() =>
					signOut(() => {
						navigate('/signin');
					})
				}
				onMouseDown={(event) => event.preventDefault()}
				edge='end'>
				<LogoutIcon />
			</IconButton>
		</Box>
	);
};

export default MenuBar;
