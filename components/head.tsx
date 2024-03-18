import { asset, Head } from '$fresh/runtime.ts';
import { MetaGraphComponent } from '../graph/elements.tsx';
import { Styles } from '../styling/style-meta-links.tsx';
import { IconMetaLinks } from '../icons/application/meta-link.tsx';
import { Icon } from '../icons/icon.ts';

/**
 * Properties used to set the head component on each page.
 */
type HeadProperties = {
	/**
	 * Page address.
	 */
	url: URL;
	/**
	 * Title of the page.
	 */
	title: string;
	/**
	 * Page descriptin.
	 */
	description: string;
	/**
	 * Image used to represent the page in graphs.
	 */
	image?: string;

	icons?: Icon[];
};

/**
 * Head component for the meta information in each page.
 *
 * @param properties Options used to set the head component.
 * @returns The head component.
 */
function HeadComponent(properties: HeadProperties) {
	const { description, image, title, url, icons } = properties;

	return (
		<Head>
			<title>{title}</title>

			<IconMetaLinks />

			<meta name='theme-color' content='#d7d7d7' />

			<link
				rel='apple-touch-icon'
				sizes='256x256'
				href={asset('images/brand/rasters/logos/enso-light-256.png')}
			/>
			<meta name='msapplication-TileColor' content='#d7d7d7' />

			<meta name='description' content={description} />

			<MetaGraphComponent
				description={description}
				image={image}
				title={title}
				url={url}
			/>

			<Styles />

			<link rel='manifest' href='sumi.webmanifest' />
		</Head>
	);
}

export { HeadComponent, type HeadProperties };

export default HeadComponent;
