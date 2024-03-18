import { FontResource } from './fonts/fonts.ts';
import { Stylesheet } from './css/styles.ts';

type StylingState = {
	fonts: FontResource[];
	stylesheets: Stylesheet[];
};

export default StylingState;

export { type StylingState };
