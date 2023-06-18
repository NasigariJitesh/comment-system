import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MenuBar from './components/menu-bar';
import { RootState } from './redux/store';
import Protected from './components/protetcted/protected';
import SignIn from './components/sign-in/sign-in';
import Home from './components/home';
import SignUp from './components/sign-up';

function App() {
	const user = useSelector((state: RootState) => state.user.value);

	return (
		<BrowserRouter>
			<MenuBar />
			<Routes>
				<Route
					path='/'
					element={
						<Protected isSignedIn={user !== undefined}>
							<Home />
						</Protected>
					}
				/>
				<Route path='/signin' element={<SignIn />} />
				<Route path='/signup' element={<SignUp />} />
				{/* <Route
					path='/dashboard'
					element={
						<Protected isSignedIn={user !== undefined}>
							<Dashboard />
						</Protected>
					}
				/>
				<Route
					path='/products'
					element={
						<Protected isSignedIn={user !== undefined}>
							<Products />
						</Protected>
					}
				/> */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
