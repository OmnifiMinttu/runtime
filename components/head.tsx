/// <reference types='../html.d.ts' />
import { asset, Head } from '$fresh/runtime.ts';
import { MetaGraphComponent } from '../graph/elements.tsx';
import { Styles } from '../styling/elements.tsx';

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
};

/**
 * Head component for the meta information in each page. 
 * 
 * @param properties Options used to set the head component.
 * @returns The head component.
 */
function HeadComponent(properties: HeadProperties) {
	const { description, image, title, url } = properties;

	return (
		<Head>
			<title>{title}</title>

			<link
				rel='icon'
				href={asset('images/vectors/brand/mask-icon.svg')}
				type='image/svg+xml'
			/>

			<link
				color='#5bbad5'
				rel='mask-icon'
				href={asset('images/vectors/brand/mask-icon.svg')}
				type='image/svg+xml'
			/>
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
				url={url} />

			<Styles />

			<link rel='manifest' href='sumi.webmanifest' />
		</Head>
	);
}

export {
	type HeadProperties, 
	HeadComponent
}

export default HeadComponent;