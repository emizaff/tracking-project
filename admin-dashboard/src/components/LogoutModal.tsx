import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1b26] border border-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <LogOut size={24} />
                    </div>
                    
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Yakin mau keluar?</h3>
                        <p className="text-sm text-gray-400">Kamu harus login lagi nanti untuk akses dashboard.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-2">
                        <button 
                            onClick={onClose}
                            className="py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                        >
                            Ya, Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LogoutModal;