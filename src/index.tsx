import React, { ReactNode, useContext, useEffect, useState } from 'react';

import { initFacebookSdk, login, logout } from './utils/facebook.client';
import {
	AuthResponse,
	LoginStatus,
	StatusResponse,
} from './utils/facebook.window';

interface FacebookContextOptions {
	authenticatedState: AuthenticatedStatus;
	authenticatedSession?: {};
	isAuthenticated: boolean;
	loading: boolean;
	user: {};
	logout(): void;
	login(): void;
}

enum AuthenticatedStatus {
	LOADING = 'loading',
	ERROR = 'error',
	AUTHENTICATED = 'authenticated',
	UNAUTHENTICATED = 'unauthenticated',
}

export const FacebookContext = React.createContext<FacebookContextOptions>({
	authenticatedState: AuthenticatedStatus.LOADING,
	isAuthenticated: false,
	loading: true,
	user: {},
	logout: () => {},
	login: () => {},
});

interface FacebookProviderParams {
	children: ReactNode;
	options: {
		appId: string;
	};
}

export const useFacebook = () => useContext(FacebookContext);

interface AuthStateDef {
	authStatus: AuthenticatedStatus;
	authResponse?: AuthResponse;
	authRequestStatus?: LoginStatus;
	user?: {};
}

export const FacebookProvider = ({
	children,
	options,
}: FacebookProviderParams) => {
	const [authState, setAuthState] = useState<AuthStateDef>({
		authStatus: AuthenticatedStatus.LOADING,
	});

	const handleSetAuthState = (response?: StatusResponse) => {
		const authToken =
			response && response.status === 'connected'
				? response.authResponse
				: undefined;

		setAuthState({
			authStatus: authToken
				? AuthenticatedStatus.AUTHENTICATED
				: AuthenticatedStatus.UNAUTHENTICATED,
			authRequestStatus: response?.status,
			authResponse: authToken,
		});
	};

	useEffect(() => {
		const initFacebook = async () => {
			const facebookFromHook = await initFacebookSdk({
				appId: options.appId,
			});

			handleSetAuthState(facebookFromHook);
		};

		initFacebook();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FacebookContext.Provider
			value={{
				authenticatedState: authState.authStatus,
				isAuthenticated:
					authState.authStatus === AuthenticatedStatus.AUTHENTICATED,
				loading: authState.authStatus === AuthenticatedStatus.LOADING,
				user: {},
				logout: async () => {
					const response = await logout();
					handleSetAuthState(response);
				},
				login: async () => {
					const response = await login();
					handleSetAuthState(response);
				},
			}}
		>
			{children}
		</FacebookContext.Provider>
	);
};

export default FacebookProvider;
