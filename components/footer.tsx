import { useContext } from 'preact/hooks';
import { HeaderComponent, HeaderProperties } from './header.tsx';
import { NavigationComponent, NavigationProperties } from './nav.tsx';

/**
 * Properties for creating a footer component.
 */
type FooterProperties = {
	/**
	 * Header properties for setting up the footer.
	 */
	header?: HeaderProperties;

	/**
	 * Navigation properties for the footer.
	 */
	navigation: NavigationProperties[];
};

/**
 * Footer component for an application, containing navigation elements and a header banner.
 *
 * @param properties Properties of the footer component.
 * @returns A HTML footer element.
 */
function FooterComponent(properties: FooterProperties) {
	return (
		<footer>
			{properties.header?.title &&
				<span>{properties.header?.title}</span>}
			{properties.header &&
				(
					<HeaderComponent
						logo={properties.header.logo}
						title={properties.header.title}
					/>
				)}

			{properties.navigation.map((navigationSection) => {
				return (
					<NavigationComponent
						title={navigationSection.title}
						items={navigationSection.items}
					/>
				);
			})}
		</footer>
	);
}

export { FooterComponent, type FooterProperties };

export default FooterComponent;
