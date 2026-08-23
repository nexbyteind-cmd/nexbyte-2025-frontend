import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Search, LogOut, ChevronRight, PlayCircle, Loader2, Code, Database, Terminal, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClassesDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) {
            navigate("/classes");
            return;
        }

        const fetchDashboard = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/classes/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    localStorage.removeItem("classes_token");
                    navigate("/classes");
                }
            } catch (e) {
                console.error("Dashboard fetch error", e);
            }
            setLoading(false);
        };
        fetchDashboard();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("classes_token");
        navigate("/classes");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
            <Navbar />

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center opacity-70 animate-bounce" style={{ animationDuration: '6s', zIndex: 0 }}>
                <Database className="w-12 h-12 text-yellow-400" />
            </div>
            <div className="absolute top-60 left-10 w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center opacity-70 animate-pulse" style={{ animationDuration: '4s', zIndex: 0 }}>
                <Code className="w-10 h-10 text-blue-400" />
            </div>

            {/* Dashboard Header */}
            <header className="bg-white border-b border-gray-200 sticky top-20 z-40 mt-20">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Learning Workspace</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center gap-2 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 py-12 relative z-10">
                
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Path</h1>
                    <p className="text-gray-500 text-lg">Continue your journey in software engineering and architecture.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Categories Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-xl font-bold text-gray-900">Available Modules</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data?.categories?.map((cat: any) => (
                                <Link 
                                    to={`/classes/category/${cat._id}`} 
                                    key={cat._id}
                                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="h-40 bg-gray-100 overflow-hidden relative">
                                        {cat.banner ? (
                                            <img src={cat.banner} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                                <Terminal className="w-12 h-12 text-blue-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                Module
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cat.description}</p>
                                        <div className="flex items-center text-blue-600 font-semibold text-sm mt-auto">
                                            Explore Module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {(!data?.categories || data.categories.length === 0) && (
                                <div className="col-span-1 md:col-span-2 p-12 bg-white rounded-2xl border border-gray-200 text-center shadow-sm">
                                    <Terminal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No modules available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Sidebar */}
                    <div className="space-y-8">
                        {/* Progress Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
                            <h3 className="font-bold text-gray-900 mb-6 relative z-10">Overall Progress</h3>
                            
                            <div className="flex items-end gap-2 mb-2 relative z-10">
                                <span className="text-4xl font-black text-gray-900">{data?.progress || 0}%</span>
                                <span className="text-gray-500 text-sm font-medium pb-1">completed</span>
                            </div>
                            
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6 relative z-10">
                                <div 
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${data?.progress || 0}%` }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-gray-100 pt-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Videos</p>
                                    <p className="font-bold text-lg text-gray-900">{data?.totalVideos || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                                    <p className="font-bold text-lg text-gray-900">{data?.completedVideos || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-purple-500" /> Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {data?.recentProgress?.length > 0 ? (
                                    data.recentProgress.map((prog: any, i: number) => {
                                        // Need to find topic title from categories if possible, or just show ID
                                        return (
                                            <div key={i} className="flex gap-4 items-start group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                    <PlayCircle className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Continued learning</p>
                                                    <p className="text-xs text-gray-500 mt-1">{new Date(prog.lastWatchedTime).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 text-sm">No recent activity.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ClassesDashboard;
