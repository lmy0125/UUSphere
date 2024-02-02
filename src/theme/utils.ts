import type { PaletteColor } from '@mui/material/styles/createPalette';
import type { ColorPreset } from './index';
import { blue, green, indigo, purple, custom } from './colors';

export const getPrimary = (preset?: ColorPreset): PaletteColor => {
	switch (preset) {
		case 'blue':
			return blue;
		case 'green':
			return green;
		case 'indigo':
			return indigo;
		case 'purple':
			return purple;
		case 'custom':
			return custom;
		default:
			console.error(
				'Invalid color preset, accepted values: "blue", "green", "indigo" or "purple"".'
			);
			return blue;
	}
};
