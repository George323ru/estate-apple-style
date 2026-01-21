import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, LogOut, FileText, CheckCircle, AlertCircle, Database } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [stats, setStats] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
        }
        fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const { fetchWpEstates } = await import('../services/wpApi');
            const data = await fetchWpEstates();
            setStats(data);
        } catch (e) {
            console.error("Failed to fetch stats");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = import.meta.env.VITE_API_URL || '';

            const response = await fetch(`${apiUrl}/api/estates/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    navigate('/login');
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error(data.error || 'Upload failed');
            }

            setMessage({ type: 'success', text: data.message });
            setFile(null);
            fetchStats(); // Refresh stats
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Database size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Properties</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Upload Properties</h2>
                                <p className="text-sm text-gray-500">Import data via CSV file</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                            <h3 className="text-xl font-bold mb-4">Manage via WordPress</h3>
                            <p className="text-gray-500 mb-6">Property management is now handled through the WordPress Dashboard.</p>
                            <a
                                href="http://localhost:8000/wp-admin"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Go to WP Admin
                            </a>
                        </div>
                    </div>

                    {/* Recent Items (Placeholder for now) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 opacity-50 pointer-events-none">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <p className="text-gray-500">Log of recent uploads will appear here.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
