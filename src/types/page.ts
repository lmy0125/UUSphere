import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
// NOTE: We only re-export the NextPage to maintain consistency between CRA and Next.js

export type Page<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

// export type Page = NextPage;
