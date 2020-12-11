import {
	FacebookWindow,
	LoginOptions,
	StatusResponse,
} from './facebook.window';
declare let window: FacebookWindow;
export interface FacebookSDKInitParams {
	appId: string;
	version?: string;
	language?: string;
}

export function initFacebookSdk(
	params: FacebookSDKInitParams
): Promise<StatusResponse | undefined> {
	return new Promise(resolve => {
		// wait for facebook sdk to initialize before starting the react app
		window.fbAsyncInit = function() {
			window.FB.init({
				appId: params.appId,
				cookie: true,
				xfbml: true,
				version: params.version ? params.version : 'v8.0',
			});

			// auto authenticate with the api if already logged in with facebook
			window.FB.getLoginStatus(response => {
				if (response) {
					resolve(response);
				} else {
					resolve(undefined);
				}
			});
		};

		// load facebook sdk script
		(function(d, s, id) {
			const fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			const js: any = d.createElement(s);
			js.id = id;
			js.src = `https://connect.facebook.net/${params.language ||
				'en_US'}/sdk.js`;
			fjs && fjs.parentNode && fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');
	});
}

export async function login(
	options: LoginOptions
): Promise<StatusResponse | undefined> {
	const authResponse: StatusResponse | undefined = await new Promise(resolve =>
		window.FB.login(response => resolve(response), {
			...options,
		})
	);

	if (!authResponse) return undefined;

	return authResponse;
}

export async function logout(): Promise<StatusResponse | undefined> {
	// revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
	await window.FB.api('/me/permissions', 'delete');
	const authResponse: StatusResponse | undefined = await new Promise(resolve =>
		window.FB.logout(response => resolve(response))
	);

	return authResponse;
}
