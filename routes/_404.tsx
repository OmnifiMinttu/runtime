import { FreshContext } from '$fresh/server.ts';
import { HeadComponent } from '../components/head.tsx';

/**
 * Basic error page for pages that cannot be found.
 * 
 * @param _request HTTP request object.
 * @param context Fresh context.
 * 
 * @returns HTML for the 404 HTML page.
 */
// deno-lint-ignore require-await
async function Error404Page(_request: Request, context: FreshContext) {
	const { data, url } = context;

	return (
		<>
			<HeadComponent
				description='Self-sovereign data spaces'
				image={url.href + 'og-image.png'}
				title='404 - Page not found'
				url={url}
			/>
			<h1>Page not found</h1>
			<p>The page you were looking for doesn't exist.</p>
			<p>
				<a href='/'>Go back home</a>
			</p>
		</>
	);
}

export default Error404Page;
