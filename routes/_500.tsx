import { FreshContext } from '$fresh/server.ts';

/**
 * Basic error page for issues with the service.
 * 
 * @param _request HTTP request object.
 * @param context Fresh context.
 * 
 * @returns HTML for the 404 HTML page.
 */
// deno-lint-ignore require-await
async function Error500Page(request: Request, context: FreshContext) {
	return <p>500 internal error: {(context.error as Error).message}</p>;
}

export default Error500Page;