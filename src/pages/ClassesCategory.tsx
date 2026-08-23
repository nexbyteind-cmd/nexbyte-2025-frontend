import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, PlayCircle, Loader2, CheckCircle2, Circle,
    BookOpen, Clock, ChevronRight, BarChart2
} from "lucide-react";
import { API_BASE_URL } from "@/config";
import LmsLayout from "@/components/LmsLayout";

const ClassesCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) { navigate("/classes"); return; }

        const fetchData = async () => {
            try {
                const [topicsRes, dashRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/classes/categories/${id}/topics`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/classes/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                const topicsJson = await topicsRes.json();
                const dashJson = await dashRes.json();

                if (topicsJson.success) setTopics(topicsJson.data);
                if (dashJson.success) {
                    const cat = dashJson.data?.categories?.find((c: any) => c._id === id);
                    setData({ category: cat, userEmail: dashJson.data?.userEmail });
                }
            } catch {
                console.error("Fetch error");
            }
            setLoading(false);
        };
        fetchData();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        );
    }

    const category = data?.category;
    const completedCount = topics.filter(t => t.progress?.completed).length;
    const progressPerc = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
    // Find first non-completed topic
    const nextTopic = topics.find(t => !t.progress?.completed);

    return (
        <LmsLayout userEmail={data?.userEmail}>
            <div className="flex-1 max-w-[880px] w-full mx-auto px-4 md:px-6 py-8">

                {/* Back */}
                <Link
                    to="/classes/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Learning
                </Link>

                {/* Category header */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                    {category?.banner && (
                        <div className="h-[200px] bg-gray-100 overflow-hidden">
                            <img
                                src={category.banner}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    )}
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-xl font-bold text-gray-900 mb-2">
                                    {category?.name || "Module Curriculum"}
                                </h1>
                                {category?.description && (
                                    <p className="text-gray-500 text-sm mb-3 leading-relaxed">{category.description}</p>
                                )}
                                {category?.tags && category.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {category.tags.map((tag: string) => (
                                            <span key={tag} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {tag.startsWith('#') ? tag : `#${tag}`}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" />
                                        {topics.length} {topics.length === 1 ? 'class' : 'classes'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <BarChart2 className="w-4 h-4" />
                                        {completedCount} completed
                                    </span>
                                </div>
                            </div>

                            {/* Progress + CTA */}
                            <div className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-xl p-4 min-w-[160px] text-center gap-3">
                                <div className="relative w-14 h-14">
                                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                        <circle cx="28" cy="28" r="22" fill="none" stroke="#E5E7EB" strokeWidth="5" />
                                        <circle
                                            cx="28" cy="28" r="22" fill="none" stroke="#2563EB" strokeWidth="5"
                                            strokeDasharray={`${2 * Math.PI * 22}`}
                                            strokeDashoffset={`${2 * Math.PI * 22 * (1 - progressPerc / 100)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">{progressPerc}%</span>
                                </div>
                                <span className="text-xs text-gray-500">Overall progress</span>
                                {nextTopic && (
                                    <Link
                                        to={`/classes/video/${nextTopic._id}`}
                                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <PlayCircle className="w-3.5 h-3.5" />
                                        {progressPerc > 0 ? 'Continue' : 'Start'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum list */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Course Curriculum</h2>

                    {topics.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm font-medium">No classes added yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {topics.map((topic, idx) => {
                                const isCompleted = topic.progress?.completed;
                                const watchedPerc = topic.progress?.watchedPercentage || 0;
                                const isInProgress = !isCompleted && watchedPerc > 0;

                                return (
                                    <Link
                                        key={topic._id}
                                        to={`/classes/video/${topic._id}`}
                                        className={`group flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition-colors ${idx < topics.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        {/* Status icon */}
                                        <div className="flex-shrink-0">
                                            {isCompleted ? (
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4.5 h-4.5 text-green-600" fill="currentColor" />
                                                </div>
                                            ) : isInProgress ? (
                                                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-amber-700">
                                                    {idx + 1}
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-blue-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                                                    {idx + 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-sm font-semibold line-clamp-1 group-hover:text-blue-700 transition-colors ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
                                                {topic.title}
                                            </h3>
                                            {topic.description && (
                                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{topic.description}</p>
                                            )}
                                            {isInProgress && (
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="flex-1 h-1 bg-gray-200 rounded-full max-w-[100px]">
                                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${watchedPerc}%` }} />
                                                    </div>
                                                    <span className="text-[10px] text-amber-600 font-medium">{Math.round(watchedPerc)}%</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            {isCompleted ? (
                                                <span className="text-[11px] font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Completed</span>
                                            ) : (
                                                <div className="flex items-center gap-1 text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircle className="w-4 h-4" /> Watch
                                                </div>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </LmsLayout>
    );
};

export default ClassesCategory;
