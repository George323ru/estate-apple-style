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
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/estates`);
            const data = await res.json();
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

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <FileText size={40} className="text-gray-400" />
                                    {file ? (
                                        <p className="text-sm font-medium text-blue-600">{file.name}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-400">CSV files only</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-sm ${!file || uploading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                                    }`}
                            >
                                {uploading ? 'Uploading...' : 'Start Import'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-2">CSV Format Example:</p>
                            <code className="block bg-gray-50 p-3 rounded-lg text-xs text-gray-600 font-mono overflow-x-auto">
                                title,price,image,location,specs,tags<br />
                                "Luxury Apt","15M","http://...","Moscow","2 rooms","Premium,Center"
                            </code>
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
