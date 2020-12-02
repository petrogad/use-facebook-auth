import React, { ReactNode, useContext, useEffect, useState } from 'react';

import { initFacebookSdk, login, logout } from './utils/facebook.client';
import { AuthResponse, LoginStatus } from './utils/facebook.window';

interface FacebookContextOptions {
  authenticatedState: AuthenticatedStatus;
  authenticatedSession?: {};
  isAuthenticated: boolean;
  loading: boolean;
  user: {};
  logout(): void;
  login(): void;
}
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

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
  onRedirectCallback(state?: string): void;
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
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  options,
}: FacebookProviderParams) => {
  const [authState, setAuthState] = useState<AuthStateDef>({
    authStatus: AuthenticatedStatus.LOADING,
  });

  useEffect(() => {
    const initFacebook = async () => {
      const facebookFromHook = await initFacebookSdk({
        appId: options.appId,
      });

      const authToken =
        facebookFromHook && facebookFromHook.status === 'connected'
          ? facebookFromHook.authResponse
          : undefined;

      setAuthState({
        authStatus: authToken
          ? AuthenticatedStatus.AUTHENTICATED
          : AuthenticatedStatus.UNAUTHENTICATED,
        authRequestStatus: facebookFromHook?.status,
        authResponse: authToken,
      });
    };

    initFacebook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (response?: StatusResponse): void => {};

  const handleLogout = (response?: StatusResponse): void => {};

  return (
    <FacebookContext.Provider
      value={{
        authenticatedSession: authState.authStatus,
        isAuthenticated:
          authState.authStatus === AuthenticatedStatus.AUTHENTICATED,
        loading: authState.authStatus === AuthenticatedStatus.LOADING,
        user: {},
        logout: async () => {
          const response = await logout();
          handleLogout(response);
        },
        login: async () => {
          const response = await login();
          handleLogin(response);
        },
      }}
    >
      {children}
    </FacebookContext.Provider>
  );
};
