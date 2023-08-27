import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';

const TemplatePage: PageType = () => {
	return <div>templatePage</div>;
};

TemplatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TemplatePage;
