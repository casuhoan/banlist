import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sword } from 'lucide-react';
import formats from '../data/formats.json';
import type { Format } from '../types';

const Home: React.FC = () => {
    return (
        <div className="space-y-8">
            <header className="text-center py-12 space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-2">
                    Format <span className="text-indigo-500">Hub</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Regolamenti ufficiali e banlist per i nostri tornei interni.
                    Seleziona un formato per iniziare.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(formats as Format[]).map((format) => (
                    <Link
                        key={format.id}
                        to={`/format/${format.id}`}
                        className="group relative bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
                    >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="text-indigo-400" />
                        </div>

                        <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Sword className="h-6 w-6 text-indigo-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                            {format.name}
                        </h2>
                        <p className="text-gray-400 text-sm line-clamp-3">
                            {format.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs font-medium text-gray-500">
                            <span className="bg-slate-800 px-2 py-1 rounded">
                                Strict Rules
                            </span>
                            <span className="ml-auto">
                                {format.bannedCards.length} Cards Banned
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
