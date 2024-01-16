import { JSX } from 'preact';
import { IS_BROWSER } from '$fresh/runtime.ts';

/**
 * Basic button control. 
 * 
 * @param properties HTML attributes for the button element (`<button />`).
 * @returns A button HTML element.
 */
export function Button(properties: JSX.HTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...properties}
			disabled={!IS_BROWSER || properties.disabled}
			class='px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors'
		/>
	);
}
