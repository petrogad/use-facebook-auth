# useFacebookAuth

A React based hook for facebook authentication.

[![npm version](https://badge.fury.io/js/use-facebook-auth.svg)](https://badge.fury.io/js/use-facebook-auth)

## Installiation

```bash
$ npm i use-facebook-auth
```

or

```bash
$ yarn add use-facebook-auth
```

## Usage

This hook uses context and hooks to provide info throughout your application on wether or not you have an active session. You'll want to wrap your app by doing the following:

```js
import FacebookProvider from 'use-facebook-auth';

const MY_APP_ID = 'xxxxxxxx';

ReactDOM.render(
	<React.StrictMode>
		<FacebookProvider options={{ appId: MY_APP_ID }}>
			<App />
		</FacebookProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
```

Your App Id is the application you're using too authentcate against. Then on any page you wish to authenticate/logout/get sessino info you can use the following hook:

```js
import { useFacebook } from 'use-facebook-auth';


const MyMethod = () => {
	const {
		authenticatedSession: { // only comes back when authenticated
			accessToken: 'string';
			expiresIn: 'number';
			signedRequest: 'string';
			userID: 'string';
			grantedScopes: 'string'; // optional
			reauthorize_required_in: 'number'; // optional
		},
		authenticatedState: 'loading' | 'error' | 'authenticated' | 'unauthenticated',
		isAuthenticated: true | false, //derived from the auth state;
		loading: true | false, //derived from the auth state;
		logout(): void,
		login(): void
	} = useFacebook();

	return (<div>Hello</div>);
}
```

## Additional Provider Options

The Provider requires one option, the appId, but you can also pass in language and version if you wish to alter the defaults below:

| Parameter  | Description                                                                                             |
| :--------- | :------------------------------------------------------------------------------------------------------ |
| `appId`    | _Required_ The facebook app your authentication associates too.                                         |
| `version`  | Default: v8.0 - provide a specific [version](https://developers.facebook.com/docs/graph-api/changelog/) |
| `language` | Default: en_US - Provide the language you wish to see translations in                                   |

## License

**[MIT](LICENSE)** Licensed

### Up next

- [ ] Add user session info to hook
- [ ] Add example section to readme
