import React, { useState } from 'react';
import { Save, Plus, Trash2, Smartphone, AlertTriangle, Lock } from 'lucide-react';
import initialFormats from '../data/formats.json';
import type { Format } from '../types';

const Admin: React.FC = () => {
    const [formats, setFormats] = useState<Format[]>(initialFormats);
    const [activeFormatId, setActiveFormatId] = useState<string>(formats[0]?.id || '');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'grandius') {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    const activeFormat = formats.find(f => f.id === activeFormatId);

    const handleUpdateFormat = (field: keyof Format, value: string) => {
        setFormats(prev => prev.map(f =>
            f.id === activeFormatId ? { ...f, [field]: value } : f
        ));
    };

    const handleAddCard = () => {
        const cardName = prompt("Inserisci il nome esatto della carta (Inglese):");
        if (cardName && activeFormat) {
            setFormats(prev => prev.map(f =>
                f.id === activeFormatId ? { ...f, bannedCards: [...f.bannedCards, cardName] } : f
            ));
        }
    };

    const handleRemoveCard = (cardName: string) => {
        if (confirm(`Rimuovere ${cardName} dalla banlist?`)) {
            setFormats(prev => prev.map(f =>
                f.id === activeFormatId ? { ...f, bannedCards: f.bannedCards.filter(c => c !== cardName) } : f
            ));
        }
    };

    const handleAddFormat = () => {
        const name = prompt("Nome del nuovo formato:");
        if (name) {
            const newFormat: Format = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name: name,
                description: "Nuova descrizione",
                rules: "# Regolamento",
                bannedCards: []
            };
            setFormats(prev => [...prev, newFormat]);
            setActiveFormatId(newFormat.id);
        }
    };

    const handleDeleteFormat = () => {
        if (!activeFormat) return;
        if (confirm(`Sei sicuro di voler eliminare il formato "${activeFormat.name}" completo?`)) {
            setFormats(prev => prev.filter(f => f.id !== activeFormatId));
            setActiveFormatId('');
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(formats, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "formats.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            {/* Mobile Warning */}
            <div className="md:hidden flex flex-col items-center justify-center h-[50vh] text-center p-6 space-y-4">
                <Smartphone className="h-16 w-16 text-indigo-500" />
                <h2 className="text-2xl font-bold text-white">Desktop Only</h2>
                <p className="text-gray-400">Il pannello di amministrazione è ottimizzato per modifiche complesse e richiede un computer.</p>
            </div>

            {/* Desktop Interface */}
            <div className="hidden md:block">
                {!isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
                            <div className="text-center">
                                <div className="mx-auto h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                                    <Lock className="h-6 w-6 text-indigo-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                                <p className="text-gray-400 text-sm mt-2">Area riservata. Inserisci la password per continuare.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        autoFocus
                                    />
                                    {error && <p className="text-red-400 text-xs mt-2 ml-1">Password non corretta.</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors"
                                >
                                    Accedi
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                                <p className="text-gray-400 mt-1">Configura le banlist e scarica il file aggiornato.</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Save className="h-4 w-4" />
                                <span>Download Config</span>
                            </button>
                        </header>

                        <div className="grid grid-cols-12 gap-8">
                            {/* Sidebar List */}
                            <div className="col-span-3 space-y-2">
                                <h3 className="text-sm font-uppercase text-gray-500 font-bold mb-3">Formati</h3>
                                {formats.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFormatId(f.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeFormatId === f.id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50' : 'text-gray-400 hover:bg-white/5'}`}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                                <button
                                    onClick={handleAddFormat}
                                    className="w-full flex items-center justify-center space-x-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-4 py-3 rounded-lg transition-colors border border-dashed border-indigo-500/30 mt-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Nuovo Formato</span>
                                </button>
                            </div>

                            {/* Editor Area */}
                            <div className="col-span-9 bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-6">
                                {activeFormat ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 uppercase font-bold">Nome Formato</label>
                                                <input
                                                    value={activeFormat.name}
                                                    onChange={(e) => handleUpdateFormat('name', e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 uppercase font-bold">ID (Read Only)</label>
                                                <input
                                                    value={activeFormat.id}
                                                    disabled
                                                    className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Descrizione Breve</label>
                                            <input
                                                value={activeFormat.description}
                                                onChange={(e) => handleUpdateFormat('description', e.target.value)}
                                                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <label className="text-xs text-gray-500 uppercase font-bold">Regolamento (Markdown)</label>
                                                <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline">Guida Markdown</a>
                                            </div>
                                            <textarea
                                                value={activeFormat.rules}
                                                onChange={(e) => handleUpdateFormat('rules', e.target.value)}
                                                className="w-full h-40 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs text-gray-500 uppercase font-bold">Banlist ({activeFormat.bannedCards.length})</label>
                                                <button onClick={handleAddCard} className="text-xs flex items-center space-x-1 text-indigo-400 hover:text-indigo-300">
                                                    <Plus className="h-3 w-3" /> <span>Aggiungi Carta</span>
                                                </button>
                                            </div>
                                            <div className="bg-slate-950 border border-white/10 rounded-lg p-2 max-h-60 overflow-y-auto grid grid-cols-2 gap-2">
                                                {activeFormat.bannedCards.map((card, idx) => (
                                                    <div key={`${card}-${idx}`} className="flex items-center justify-between bg-white/5 px-3 py-1.5 rounded text-sm text-gray-300 group hover:bg-white/10">
                                                        <span>{card}</span>
                                                        <button onClick={() => handleRemoveCard(card)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-2 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-200 text-sm">
                                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                            <p>
                                                Ricorda di cliccare su <strong>Download Config</strong> e sostituire il file <code>src/data/formats.json</code> nel repository per applicare le modifiche.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">Seleziona un formato</div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;
