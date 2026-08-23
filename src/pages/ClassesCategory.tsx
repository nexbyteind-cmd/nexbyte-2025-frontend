import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, PlayCircle, Loader2, CheckCircle2, BookOpen,
    BarChart2, ChevronRight
} from "lucide-react";
import { API_BASE_URL } from "@/config";
import LmsWorkspaceLayout from "@/components/LmsWorkspaceLayout";

const ProgressRing = ({ value, size = 56 }: { value: number; size?: number }) => {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={5} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={value === 100 ? "#22C55E" : "#2563EB"} strokeWidth={5}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - value / 100)}
                strokeLinecap="round"
            />
        </svg>
    );
};

const ClassesCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState<any[]>([]);
    const [category, setCategory] = useState<any>(null);
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) { navigate("/classes"); return; }

        const fetchAll = async () => {
            try {
                const [topicsRes, dashRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/classes/categories/${id}/topics`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/classes/dashboard`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);
                const topicsJson = await topicsRes.json();
                const dashJson = await dashRes.json();

                if (topicsJson.success) setTopics(topicsJson.data);
                if (dashJson.success) {
                    const cat = dashJson.data?.categories?.find((c: any) => c._id === id);
                    setCategory(cat);
                    setUserEmail(dashJson.data?.userEmail || "");
                }
            } catch {
                console.error("Category fetch error");
            }
            setLoading(false);
        };
        fetchAll();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F7F9]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
        );
    }

    const completedCount = topics.filter(t => t.progress?.completed).length;
    const progressPerc = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
    const nextTopic = topics.find(t => !t.progress?.completed);

    return (
        <LmsWorkspaceLayout userEmail={userEmail}>
            <div className="max-w-[860px] w-full mx-auto px-5 md:px-8 py-7">

                {/* Breadcrumb */}
                <Link
                    to="/classes/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                {/* Module header card */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                    {category?.banner && (
                        <div className="h-[190px] overflow-hidden bg-gray-100">
                            <img
                                src={category.banner}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                        </div>
                    )}
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-gray-900 mb-1.5">
                                    {category?.name || "Module Curriculum"}
                                </h1>
                                {category?.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{category.description}</p>
                                )}
                                {category?.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {category.tags.map((tag: string) => (
                                            <span key={tag} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {tag.startsWith("#") ? tag : `#${tag}`}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" />
                                        {topics.length} {topics.length === 1 ? "class" : "classes"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <BarChart2 className="w-4 h-4" />
                                        {completedCount} completed
                                    </span>
                                </div>
                            </div>

                            {/* Progress + CTA */}
                            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 flex-shrink-0 self-start">
                                <div className="relative">
                                    <ProgressRing value={progressPerc} size={56} />
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{progressPerc}%</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Progress</p>
                                    {nextTopic ? (
                                        <Link
                                            to={`/classes/video/${nextTopic._id}`}
                                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" />
                                            {progressPerc > 0 ? "Continue" : "Start"}
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> All done!
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum */}
                <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Course Curriculum</h2>

                    {topics.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                            <BookOpen className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">No classes added yet.</p>
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
                                        className={`group flex items-center gap-4 px-5 py-4 hover:bg-blue-50/60 transition-colors ${idx < topics.length - 1 ? "border-b border-gray-100" : ""}`}
                                    >
                                        {/* Status */}
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                            {isCompleted ? (
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                </div>
                                            ) : (
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                                                    isInProgress
                                                        ? "border-amber-400 bg-amber-50 text-amber-700"
                                                        : "border-gray-200 bg-gray-50 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-600"
                                                }`}>
                                                    {idx + 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-sm font-semibold line-clamp-1 transition-colors group-hover:text-blue-700 ${isCompleted ? "text-gray-400" : "text-gray-900"}`}>
                                                {topic.title}
                                            </h3>
                                            {topic.description && (
                                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{topic.description}</p>
                                            )}
                                            {isInProgress && (
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="flex-1 h-1 bg-gray-100 rounded-full max-w-[80px]">
                                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${watchedPerc}%` }} />
                                                    </div>
                                                    <span className="text-[10px] text-amber-600 font-medium">{Math.round(watchedPerc)}%</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {isCompleted ? (
                                                <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Done</span>
                                            ) : (
                                                <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                    <PlayCircle className="w-3.5 h-3.5" /> Watch
                                                </span>
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
        </LmsWorkspaceLayout>
    );
};

export default ClassesCategory;
