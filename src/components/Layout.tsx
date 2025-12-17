import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 font-sans selection:bg-indigo-500/30">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="border-t border-white/5 bg-slate-900/50 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>Created for internal tournament use. Magic: The Gathering is a trademark of Wizards of the Coast.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
