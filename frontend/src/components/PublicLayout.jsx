import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <PublicNavbar />
            <main className="flex-grow container mx-auto p-4 md:p-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;