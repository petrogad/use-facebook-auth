import React, { ReactNode, useContext, useEffect, useState } from 'react';

import {
	FacebookSDKInitParams,
	initFacebookSdk,
	login,
	logout,
} from './utils/facebook.client';
import {
	AuthResponse,
	LoginOptions,
	LoginStatus,
	StatusResponse,
} from './utils/facebook.window';

interface FacebookContextOptions {
	authenticatedState: AuthenticatedStatus;
	authenticatedSession?: AuthResponse;
	isAuthenticated: boolean;
	loading: boolean;
	user: {};
	logout(): void;
	login(options: LoginOptions): void;
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
	options: FacebookSDKInitParams;
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
			const facebookFromHook = await initFacebookSdk(options);

			handleSetAuthState(facebookFromHook);
		};

		initFacebook();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FacebookContext.Provider
			value={{
				authenticatedSession: authState.authResponse,
				authenticatedState: authState.authStatus,
				isAuthenticated:
					authState.authStatus === AuthenticatedStatus.AUTHENTICATED,
				loading: authState.authStatus === AuthenticatedStatus.LOADING,
				user: {},
				logout: async () => {
					const response = await logout();
					handleSetAuthState(response);
				},
				login: async (options: LoginOptions) => {
					const response = await login(options);
					handleSetAuthState(response);
				},
			}}
		>
			{children}
		</FacebookContext.Provider>
	);
};

export default FacebookProvider;
