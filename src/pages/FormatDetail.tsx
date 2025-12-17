import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, BookOpen, Ban } from 'lucide-react';
import formats from '../data/formats.json';
import type { Format } from '../types';
import CardGrid from '../components/CardGrid';

const FormatDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const format = useMemo(() => {
        return (formats as Format[]).find(f => f.id === id);
    }, [id]);

    if (!format) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white mb-4">Formato non trovato</h2>
                <Link to="/" className="text-indigo-400 hover:text-indigo-300">Torna alla Home</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Formats
            </Link>

            <header className="border-b border-white/10 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{format.name}</h1>
                <p className="text-xl text-indigo-400">{format.description}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rules Section - 1 Column on Desktop */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 sticky top-24">
                        <div className="flex items-center space-x-2 mb-4 text-indigo-400">
                            <BookOpen className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Regolamento</h2>
                        </div>
                        <div className="prose prose-invert prose-indigo max-w-none text-gray-300 text-sm">
                            <ReactMarkdown>{format.rules}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Banlist Section - 2 Columns on Desktop */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-2 mb-4 text-red-400">
                        <Ban className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Banlist ({format.bannedCards.length})</h2>
                    </div>

                    <div className="bg-slate-900/30 rounded-2xl p-6 border border-white/5">
                        <CardGrid cardNames={format.bannedCards} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormatDetail;
