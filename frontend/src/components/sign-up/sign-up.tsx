import {
	Container,
	TextField,
	InputAdornment,
	IconButton,
	OutlinedInput,
	InputLabel,
	FormControl,
	Button,
	Box,
	Typography,
	useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signUp } from '../../api-calls';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [error, setError] = useState('');

	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const theme = useTheme();

	let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

	const SignUpHandler = (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	) => {
		if (firstName === '' || email === '' || password === '') {
			setError('FirstName, Email and password are required');
			return;
		}
		if (!regex.test(email)) {
			setError('Enter a valid email address');
			return;
		}

		signUp({ firstName, lastName, email, password }).then((response) => {
			setFirstName('');
			setLastName('');
			setEmail('');
			setPassword('');
			setError('');
			if (response.error) {
				setError(response.error);
			} else {
				navigate('/signin');
			}
		});
	};

	return (
		<Box
			style={{
				display: 'flex',
				width: '100%',
				height: '100vh',
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Container
				disableGutters
				style={{
					display: 'flex',
					height: '100%',
					minWidth: '300px',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '20px',
					maxWidth: '650px',
				}}>
				<TextField
					value={firstName}
					fullWidth
					style={{ margin: '15px 0' }}
					id='firstName'
					label='First Name*'
					variant='outlined'
					onChange={(event) => setFirstName(event.target.value)}
					error={error !== ''}
				/>
				<TextField
					value={lastName}
					fullWidth
					style={{ margin: '15px 0' }}
					id='lastName'
					label='Last Name'
					variant='outlined'
					onChange={(event) => setLastName(event.target.value)}
					error={error !== ''}
				/>
				<TextField
					value={email}
					fullWidth
					style={{ margin: '15px 0' }}
					id='email'
					label='Email*'
					variant='outlined'
					onChange={(event) => setEmail(event.target.value)}
					error={error !== ''}
				/>
				<FormControl
					error={error !== ''}
					fullWidth
					sx={{ margin: '15px 0' }}
					variant='outlined'>
					<InputLabel htmlFor='outlined-adornment-password'>
						Password
					</InputLabel>
					<OutlinedInput
						fullWidth
						id='password'
						label='Password'
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						error={error !== ''}
						type={showPassword ? 'text' : 'password'}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									onClick={() => setShowPassword((show) => !show)}
									onMouseDown={(event) => event.preventDefault()}
									edge='end'>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				{error !== '' ? (
					<Typography color={theme.palette.error.main}>{error}</Typography>
				) : null}
				<Button
					variant='contained'
					onClick={() => SignUpHandler(firstName, lastName, email, password)}>
					Sign In
				</Button>
			</Container>
		</Box>
	);
};

export default SignIn;
