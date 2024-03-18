import { JSX } from 'preact';

import { clearApplicationIcons, loadApplicationIcons } from './application.ts';
import { Icon } from '../icon.ts';
import IconsState from '../state.ts';

await loadApplicationIcons();

/**
 * Icon meta link properties.
 */
type IconMetaLinkProperties = {
	/**
	 * List of icons to render.
	 */
	list?: Set<Icon>;
};

/**
 * Provides the meta links for the icons of an application or page.
 *
 * @param properties Options for the meta link rendering.
 * @returns A JSX element.
 * @internal
 */
function IconMetaLinks(properties: IconMetaLinkProperties): JSX.Element {
	const metaLinkElements = new Set<JSX.Element>();

	let { list } = properties;

	if (list) {
		clearApplicationIcons();

		list.forEach((icon) => {
			IconsState.context.applicationIcons.add(icon);
		});
	} else {
		if (IconsState.context.applicationIcons.size == 0) {
			loadApplicationIcons();
		}

		list = IconsState.context.applicationIcons;
	}

	list.forEach((icon) => {
		let mimeType;

		switch (icon.type) {
			case 'svg':
				mimeType = 'image/svg+xml';
				break;
			case 'png':
				mimeType = 'image/png';
				break;
			case 'jpeg':
			case 'jpg':
				mimeType = 'image/jpeg';
				break;
			default:
				mimeType = undefined;
				break;
		}

		if (mimeType) {
			const href = `/images/icons/application/${icon.href}`;
			const linkElement = (
				<link
					rel={icon.descriptor}
					href={href}
					type={mimeType}
					color={icon.color}
					sizes={icon.sizes}
				/>
			);

			if (!metaLinkElements.has(linkElement)) {
				metaLinkElements.add(linkElement);
			}
		}
	});

	return (
		<>
			{Array.from(metaLinkElements)}
		</>
	);
}

export { type IconMetaLinkProperties, IconMetaLinks, type JSX };
