import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, Loader2, CheckCircle2, Clock, ChevronRight, LayoutGrid } from "lucide-react";
import { API_BASE_URL } from "@/config";
import LmsLayout from "@/components/LmsLayout";

const ClassesDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) { navigate("/classes"); return; }

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
            } catch {
                console.error("Dashboard fetch error");
            }
            setLoading(false);
        };
        fetchDashboard();
    }, [navigate]);

    const userEmail = data?.userEmail || "";
    const firstName = userEmail ? userEmail.split("@")[0].split(".")[0] : "Learner";
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-400">Loading workspace...</span>
                </div>
            </div>
        );
    }

    const totalVideos = data?.totalVideos || 0;
    const completedVideos = data?.completedVideos || 0;
    const inProgress = totalVideos - completedVideos > 0 ? totalVideos - completedVideos : 0;
    const categories = data?.categories || [];

    return (
        <LmsLayout userEmail={userEmail}>
            <div className="flex-1 max-w-[1100px] w-full mx-auto px-4 md:px-6 py-8">

                {/* Welcome header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome back, {displayName} 👋
                    </h1>
                    <p className="text-gray-500 text-sm">Pick up where you left off or explore a new module.</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                        { label: "Total Classes", value: totalVideos, icon: <LayoutGrid className="w-4 h-4 text-blue-600" />, bg: "bg-blue-50" },
                        { label: "Completed", value: completedVideos, icon: <CheckCircle2 className="w-4 h-4 text-green-600" />, bg: "bg-green-50" },
                        { label: "In Progress", value: inProgress, icon: <PlayCircle className="w-4 h-4 text-amber-600" />, bg: "bg-amber-50" },
                        { label: "Modules", value: categories.length, icon: <BookOpen className="w-4 h-4 text-purple-600" />, bg: "bg-purple-50" },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                            <div className={`${stat.bg} p-2 rounded-lg flex-shrink-0`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Categories section */}
                <div>
                    <h2 className="text-base font-semibold text-gray-800 mb-4">My Learning</h2>

                    {categories.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="font-semibold text-gray-600 mb-1">No modules available yet</p>
                            <p className="text-sm text-gray-400">Check back soon or contact your administrator.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat: any) => {
                                const catProgress = cat.progress || 0;
                                const catTotal = cat.topicCount || 0;
                                return (
                                    <Link
                                        key={cat._id}
                                        to={`/classes/category/${cat._id}`}
                                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                    >
                                        {/* Thumbnail */}
                                        <div className="h-[140px] bg-gray-100 overflow-hidden relative">
                                            {cat.banner ? (
                                                <>
                                                    <img
                                                        src={cat.banner}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fb = e.currentTarget.nextElementSibling as HTMLElement;
                                                            if (fb) fb.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div
                                                        className="w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 absolute inset-0"
                                                        style={{ display: 'none' }}
                                                    >
                                                        <BookOpen className="w-10 h-10 text-blue-300" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                                    <BookOpen className="w-10 h-10 text-blue-300" />
                                                </div>
                                            )}
                                            {catTotal > 0 && (
                                                <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                    {catTotal} {catTotal === 1 ? 'class' : 'classes'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                                                {cat.name}
                                            </h3>
                                            {cat.description && (
                                                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{cat.description}</p>
                                            )}

                                            {/* Tags */}
                                            {cat.tags && cat.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {cat.tags.slice(0, 3).map((tag: string) => (
                                                        <span key={tag} className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                                            {tag.startsWith('#') ? tag : `#${tag}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Progress */}
                                            {catTotal > 0 && (
                                                <div className="mb-3">
                                                    <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                                                        <span>{catProgress}% complete</span>
                                                        <span>{Math.round((catProgress / 100) * catTotal)}/{catTotal}</span>
                                                    </div>
                                                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full transition-all"
                                                            style={{ width: `${catProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {catTotal} {catTotal === 1 ? 'video' : 'videos'}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                                    {catProgress > 0 ? 'Continue' : 'Start'} <ChevronRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent activity */}
                {data?.recentProgress?.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-base font-semibold text-gray-800 mb-3">Recent Activity</h2>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {data.recentProgress.slice(0, 5).map((prog: any, i: number) => (
                                <div key={i} className={`flex items-center gap-4 px-5 py-3.5 ${i < data.recentProgress.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Continued learning</p>
                                        <p className="text-xs text-gray-400">{new Date(prog.lastWatchedTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    {prog.completed && (
                                        <div className="ml-auto">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" /> Completed
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </LmsLayout>
    );
};

export default ClassesDashboard;
