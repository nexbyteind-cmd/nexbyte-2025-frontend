import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    BookOpen, PlayCircle, Loader2, CheckCircle2, ChevronRight,
    LayoutGrid, ArrowRight, BarChart2, Clock
} from "lucide-react";
import { API_BASE_URL } from "@/config";
import LmsWorkspaceLayout from "@/components/LmsWorkspaceLayout";

// Helper: banner thumbnail
const CategoryThumbnail = ({ banner, name }: { banner?: string; name: string }) => {
    const [imgError, setImgError] = useState(false);
    if (banner && !imgError) {
        return (
            <img
                src={banner}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
            />
        );
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <BookOpen className="w-8 h-8 text-blue-300" />
        </div>
    );
};

// Thin progress bar
const ProgressBar = ({ value }: { value: number }) => (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, value)}%` }}
        />
    </div>
);

// Category card used across all views
const CategoryCard = ({ cat }: { cat: any }) => {
    const progress = cat.progress || 0;
    const total = cat.topicCount || 0;
    const completed = Math.round((progress / 100) * total);

    return (
        <Link
            to={`/classes/category/${cat._id}`}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col"
        >
            <div className="h-[130px] bg-gray-100 overflow-hidden relative flex-shrink-0">
                <CategoryThumbnail banner={cat.banner} name={cat.name} />
                {total > 0 && (
                    <div className="absolute top-2 right-2 bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {total} {total === 1 ? "class" : "classes"}
                    </div>
                )}
                {progress === 100 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Done
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {cat.name}
                </h3>
                {cat.description && (
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2 leading-relaxed">{cat.description}</p>
                )}
                {cat.tags && cat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {cat.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {tag.startsWith("#") ? tag : `#${tag}`}
                            </span>
                        ))}
                    </div>
                )}
                <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-[11px] text-gray-400">
                        <span>{completed}/{total} completed</span>
                        <span className="font-semibold text-gray-500">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {total} {total === 1 ? "video" : "videos"}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                            {progress === 100 ? "Review" : progress > 0 ? "Continue" : "Start"}
                            <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// ---- VIEWS ----

const DashboardView = ({ data, displayName }: { data: any; displayName: string }) => {
    const totalVideos = data?.totalVideos || 0;
    const completedVideos = data?.completedVideos || 0;
    const inProgress = Math.max(0, totalVideos - completedVideos);
    const categories = data?.categories || [];
    const inProgressCats = categories.filter((c: any) => c.progress > 0 && c.progress < 100);
    const recentProgress = data?.recentProgress || [];

    return (
        <div className="max-w-[1080px] w-full mx-auto px-5 md:px-8 py-7 space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {displayName} 👋</h1>
                <p className="text-gray-400 text-sm mt-1">Pick up where you left off or explore a new module.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: "Total Classes", value: totalVideos, icon: <LayoutGrid className="w-4 h-4 text-blue-500" />, accent: "text-blue-600" },
                    { label: "Completed", value: completedVideos, icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, accent: "text-green-600" },
                    { label: "In Progress", value: inProgress, icon: <PlayCircle className="w-4 h-4 text-amber-500" />, accent: "text-amber-600" },
                    { label: "Modules", value: categories.length, icon: <BookOpen className="w-4 h-4 text-purple-500" />, accent: "text-purple-600" },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center gap-3">
                        <div className="bg-gray-50 p-2 rounded-lg">{stat.icon}</div>
                        <div>
                            <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Continue Learning */}
            {inProgressCats.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700">Continue Learning</h2>
                        <Link to="/classes/dashboard?view=continue" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inProgressCats.slice(0, 3).map((cat: any) => <CategoryCard key={cat._id} cat={cat} />)}
                    </div>
                </section>
            )}

            {/* All modules */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700">
                        {inProgressCats.length > 0 ? "All Modules" : "My Learning"}
                    </h2>
                    <span className="text-xs text-gray-400">{categories.length} {categories.length === 1 ? "module" : "modules"}</span>
                </div>

                {categories.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 font-medium">No modules available yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Check back soon or contact your administrator.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat: any) => <CategoryCard key={cat._id} cat={cat} />)}
                    </div>
                )}
            </section>

            {/* Recent activity */}
            {recentProgress.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h2>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                        {recentProgress.slice(0, 5).map((prog: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">Continued learning</p>
                                    <p className="text-xs text-gray-400">{new Date(prog.lastWatchedTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                </div>
                                {prog.completed && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                        <CheckCircle2 className="w-3 h-3" /> Done
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

const ModulesView = ({ categories, title }: { categories: any[]; title: string }) => (
    <div className="max-w-[1080px] w-full mx-auto px-5 md:px-8 py-7">
        <h1 className="text-xl font-bold text-gray-900 mb-5">{title}</h1>
        {categories.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nothing here yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat: any) => <CategoryCard key={cat._id} cat={cat} />)}
            </div>
        )}
    </div>
);

const ProgressView = ({ data }: { data: any }) => {
    const categories = data?.categories || [];
    const totalVideos = data?.totalVideos || 0;
    const completedVideos = data?.completedVideos || 0;
    const overallPerc = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    return (
        <div className="max-w-[720px] w-full mx-auto px-5 md:px-8 py-7">
            <h1 className="text-xl font-bold text-gray-900 mb-6">My Progress</h1>

            {/* Overall */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700">Overall Progress</h2>
                    <span className="text-2xl font-bold text-blue-600">{overallPerc}%</span>
                </div>
                <ProgressBar value={overallPerc} />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{completedVideos} completed</span>
                    <span>{totalVideos} total classes</span>
                </div>
            </div>

            {/* Per module */}
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Module Breakdown</h2>
            <div className="space-y-2">
                {categories.map((cat: any) => {
                    const total = cat.topicCount || 0;
                    const prog = cat.progress || 0;
                    const done = Math.round((prog / 100) * total);
                    return (
                        <Link key={cat._id} to={`/classes/category/${cat._id}`} className="block bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-200 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">{cat.name}</span>
                                <span className="text-xs font-semibold text-gray-500">{done}/{total}</span>
                            </div>
                            <ProgressBar value={prog} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// ---- MAIN COMPONENT ----

const ClassesDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const view = new URLSearchParams(location.search).get("view") || "dashboard";

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) { navigate("/classes"); return; }

        const fetchDashboard = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/classes/dashboard`, {
                    headers: { "Authorization": `Bearer ${token}` }
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F7F9]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-400">Loading workspace...</span>
                </div>
            </div>
        );
    }

    const userEmail = data?.userEmail || "";
    const firstName = userEmail ? userEmail.split("@")[0].split(".")[0] : "Learner";
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const categories = data?.categories || [];

    const renderView = () => {
        switch (view) {
            case "learning":
                return <ModulesView categories={categories} title="My Learning" />;
            case "continue":
                return <ModulesView
                    categories={categories.filter((c: any) => c.progress > 0 && c.progress < 100)}
                    title="Continue Learning"
                />;
            case "completed":
                return <ModulesView
                    categories={categories.filter((c: any) => c.progress === 100)}
                    title="Completed Modules"
                />;
            case "progress":
                return <ProgressView data={data} />;
            default:
                return <DashboardView data={data} displayName={displayName} />;
        }
    };

    return (
        <LmsWorkspaceLayout userEmail={userEmail}>
            {renderView()}
        </LmsWorkspaceLayout>
    );
};

export default ClassesDashboard;
