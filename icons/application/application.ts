import * as filesystem from '@std/fs';
import { join } from '@std/path';
import { defaultApplicationIconsPath } from '../environment.ts';

import { WebIconDescriptor } from '../icon.ts';
import IconsState from '../state.ts';

/**
 * Loads the application icons for use in the HTML meta links.
 *
 * @param path Path where the application icons should be searched.
 * @returns An empty promise.
 */
async function loadApplicationIcons(path?: string) {
	if (!path) {
		path = IconsState.options.applicationIcons?.path ??
			defaultApplicationIconsPath;
	}

	const regExp =
		'^.*?(?<feature>mask|fav)?-?(icon|logo)-?(?<width>[0-9]*)(?<size>x?[0-9]*)\.(?<type>jpg|jpeg|png|svg|webp)$'; //'^.*(\/images\/icons\/brand\/vectors\/)(?<mask>mask)-?(icon|logo)-?([0-9]*)(?<size>x[0-9]*)\.(?<type>jpg|jpeg|png|svg|webp)$';
	const iconRegExp = new RegExp(regExp);
	const iconsDirectory = await Deno.readDir(path);

	clearApplicationIcons();

	if (await !filesystem.exists(path)) {
		return;
	}

	for await (const directoryItem of iconsDirectory) {
		if (directoryItem.isFile) {
			const regExpResult = iconRegExp.exec(directoryItem.name);
			const sizes = (regExpResult?.groups?.size)
				? `${regExpResult?.groups?.size}x${regExpResult?.groups?.size}`
				: undefined;
			const href = directoryItem.name; //join('application', directoryItem.name);
			let descriptor: WebIconDescriptor = 'icon';

			const type = regExpResult?.groups?.type;

			if (regExpResult?.groups?.feature === 'fav') {
				descriptor = 'favicon';
			} else if (regExpResult?.groups?.feature === 'mask') {
				descriptor = 'mask-icon';
			}

			if (href && descriptor) {
				IconsState.context.applicationIcons.add({
					sizes: sizes ?? 'any',
					href: href,
					descriptor: descriptor,
					type: type,
				});
			}
		}
	}

	console.log(
		`loaded: ${JSON.stringify(IconsState.context.applicationIcons.size)}`,
	);
}

/**
 * Clears the application icons from the in-memory cache.
 */
// deno-lint-ignore require-await
async function clearApplicationIcons() {
	IconsState.context.applicationIcons.clear();
}

/**
 * Gets an application icon for a given href (URL).
 * @param href href for the application icon.
 * @returns A promise with either the icon contents or undefined if the icon could not be loaded.
 */
async function getApplicationIcon(href: string): Promise<string | undefined> {
	for await (const icon of IconsState.context.applicationIcons) {
		console.log(href);
		console.log(icon.href);
		if (icon.href === href) {
			const iconMetaInfo = icon;
			const iconBody = await fetchApplicationIcon(iconMetaInfo.href);

			return iconBody;
		}
	}
}

async function fetchApplicationIcon(href: string) {
	console.log(`path: ${IconsState.options.applicationIcons?.path}`);
	console.log(IconsState.options.applicationIcons?.path);
	const applicationIconsPath = join(
		IconsState.options.applicationIcons?.path ??
			defaultApplicationIconsPath,
		href,
	);
	console.log(applicationIconsPath);
	const iconURL = new URL(applicationIconsPath, Deno.mainModule); // import.meta.url);
	console.log(iconURL);
	const iconResponse = await fetch(iconURL);
	const iconBody = await iconResponse.text();

	return iconBody;
}

/**
 * @ignore
 */
export default IconsState.context.applicationIcons;

export { clearApplicationIcons, getApplicationIcon, loadApplicationIcons };
