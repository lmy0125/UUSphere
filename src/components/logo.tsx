import type { FC } from 'react';
import Image from 'next/image'

export const Logo: FC = () => {
  return (
    <Image
      src="/logo-full3.png"
      width={135}
      height={60}
      alt="Logo"
    />
  );
};
