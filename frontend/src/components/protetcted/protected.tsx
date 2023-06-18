import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
	isSignedIn: boolean;
	children: ReactElement;
}

const Protected = (props: ProtectedProps) => {
	if (!props.isSignedIn) {
		return <Navigate to='/signin' replace />;
	}
	return props.children ?? null;
};
export default Protected;
