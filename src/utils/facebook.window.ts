export type LoginStatus =
	| 'authorization_expired'
	| 'connected'
	| 'not_authorized'
	| 'unknown';

export interface AuthResponse {
	accessToken: string;
	expiresIn: number;
	signedRequest: string;
	userID: string;
	grantedScopes?: string;
	reauthorize_required_in?: number;
}

export interface StatusResponse {
	status: LoginStatus;
	authResponse: AuthResponse;
}

interface InitOptions {
	appId?: string;
	version: string;
	cookie?: boolean;
	status?: boolean;
	xfbml?: boolean;
	frictionlessRequests?: boolean;
	hideFlashCallback?: boolean;
	autoLogAppEvents?: boolean;
}

export interface LoginOptions {
	auth_type?: 'reauthenticate' | 'reauthorize' | 'rerequest';
	scope?: string;
	return_scopes?: boolean;
	enable_profile_selector?: boolean;
	profile_selector_ids?: string;
}

export interface FacebookWindow extends Window {
	fbAsyncInit(): void;
	FB: {
		init(initOptions: InitOptions): void;

		getLoginStatus(
			callback: (response: StatusResponse) => void,
			roundtrip?: boolean
		): void;

		login(
			callback: (response: StatusResponse) => void,
			options?: LoginOptions
		): void;

		logout(callback?: (response: StatusResponse) => void): void;

		api(permissions: string, type: string): Promise<void>;
	};
}
