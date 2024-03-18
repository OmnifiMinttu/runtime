import { asset } from '$fresh/runtime.ts';
import StylingContext from './context.ts';
import { JSX } from 'preact';

/**
 * Provides the style elements within the page, both with inline elements and `link` elements.
 *
 * @returns HTML with the `<link>` elements and inline CSS.
 */
function Styles() {
	const inlineStyles = StylingContext.instance().styles.list.filter((
		stylesheet,
	) => stylesheet.inline === true && stylesheet.content !== null);
	const deferredStyles = StylingContext.instance().styles.list.filter((
		stylesheet,
	) => stylesheet.inline !== true);

	const elements: JSX.Element[] = [];

	inlineStyles.forEach((element) => {
		if (element.content && element.hash) {
			elements.push(
				<style
					dangerouslySetInnerHTML={{ __html: element.content }}
				/>,
			);
		}
	});

	deferredStyles.forEach((element) => {
		const href = (element.url)
			? element.url.toString()
			: element.path || '';

		elements.push(
			<link as='style' href={asset(href)} rel='peload' />,
		);

		elements.push(
			<link
				as='style'
				rel='stylesheet'
				href={asset(href)}
				integrity={element.hash}
			/>,
		);
	});

	const fonts = StylingContext.instance().fonts.list;

	fonts.forEach((font) => {
		const href = (font.url) ? font.url.toString() : font.path || '';

		elements.push(
			<link
				rel='preload'
				href={asset(href)}
				as='font'
				type='font/woff2'
				crossorigin='anonymous'
				integrity={font.hash}
			>
			</link>,
		);
	});

	return (
		<>
			{elements}
		</>
	);
}

export { Styles };
