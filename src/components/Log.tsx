import type { FC } from 'react';
import Image from 'next/image';

type LogoProps = {
	width: number;
	height: number;
};

export const Logo: FC<LogoProps> = ({ width, height }) => {
	return <Image src="/logo.png" width={width} height={height} alt="Logo" />;
};
