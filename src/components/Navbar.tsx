import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <Shield className="h-8 w-8 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                MTG Banlist
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Desktop Only Admin Link */}
                        <Link
                            to="/admin"
                            className="hidden md:flex items-center space-x-1 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium"
                        >
                            <Settings className="h-4 w-4" />
                            <span>Admin</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
