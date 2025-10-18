import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { GlobalFeedback } from '../common/GlobalFeedback';

const MainLayout: React.FC = () => {
    return (
        <>
            <GlobalFeedback />
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;