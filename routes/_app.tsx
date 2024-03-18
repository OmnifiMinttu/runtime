import { FreshContext } from '$fresh/server.ts';
import Spritesheet from '../graphics/spritesheet.tsx';
import { ApplicationController } from '../application/controller.ts';

/**
 * Core application wrapper for a Fresh application.
 *
 * @param _request HTTP request object.
 * @param context Fresh context.
 *
 * @returns HTML for the application page with the given context.
 */
// deno-lint-ignore require-await
async function App(_request: Request, context: FreshContext) {
	return (
		<html lang='en'>
			<head>
				<meta charset='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, viewport-fit=cover'
				/>
				<title>Minttu</title>
			</head>
			<body f-client-nav>
				<Spritesheet />
				<context.Component />
			</body>
		</html>
	);
}

export default App;

export { App };
