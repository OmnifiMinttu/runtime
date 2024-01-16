import { DOMParser } from 'deno-dom/deno-dom-wasm.ts';

/**
 * Load an SVG file and returns its contents as a sequence of SVG elements for the 
 * purpose of constructing spritesheets.
 * 
 * @param path Path of the SVG file.
 * @returns A string of XML representing the SVG file's elements.
 */
function svgFromFile(path: string): string {
	const baseSVGContent = Deno.readFileSync(path);
	const baseSVG = new TextDecoder().decode(baseSVGContent);
	const document = new DOMParser().parseFromString(baseSVG, 'text/html');

	let response = '';

	if (document) {
		const elements = document.getElementsByTagName('svg');

		elements.forEach((element) => {
			response = response + element.outerHTML;
		});
	}

	return response;
}

export { svgFromFile };
