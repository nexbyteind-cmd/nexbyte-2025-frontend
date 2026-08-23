import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, ArrowRight, Send, CheckCircle2, PlayCircle, Loader2,
    MessageSquare, ChevronLeft, ChevronRight, BookOpen, Check
} from "lucide-react";
import { API_BASE_URL } from "@/config";
import LmsLayout from "@/components/LmsLayout";

const ClassesVideo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [markedComplete, setMarkedComplete] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // ---- Security: page-scoped event listeners ----
    useEffect(() => {
        const preventContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.protected-video-zone') || target.tagName === 'IFRAME') {
                e.preventDefault();
            }
        };
        const preventShortcuts = (e: KeyboardEvent) => {
            const isCtrl = e.ctrlKey || e.metaKey;
            if (
                e.key === 'F12' ||
                (isCtrl && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
                (isCtrl && ['U', 'u', 'S', 's'].includes(e.key)) ||
                (isCtrl && ['C', 'c'].includes(e.key) && !window.getSelection()?.toString())
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        const preventDrag = (e: DragEvent) => e.preventDefault();

        document.addEventListener('contextmenu', preventContextMenu);
        document.addEventListener('keydown', preventShortcuts, true);
        document.addEventListener('dragstart', preventDrag);
        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('keydown', preventShortcuts, true);
            document.removeEventListener('dragstart', preventDrag);
        };
    }, []);

    // ---- Data fetching ----
    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) { navigate("/classes"); return; }

        const fetchVideo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/classes/videos/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                    setMarkedComplete(json.data?.video?.progress?.completed || false);
                } else {
                    navigate("/classes/dashboard");
                }
            } catch {
                console.error("Fetch video error");
            }
            setLoading(false);
        };
        fetchVideo();
    }, [id, navigate]);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setPostingComment(true);
        const token = localStorage.getItem("classes_token");
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/comments`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ topicId: id, content: comment })
            });
            const json = await res.json();
            if (json.success) {
                setData((prev: any) => ({ ...prev, comments: [json.data, ...prev.comments] }));
                setComment("");
            }
        } catch { /* silent */ }
        setPostingComment(false);
    };

    const markCompleted = async () => {
        const token = localStorage.getItem("classes_token");
        try {
            await fetch(`${API_BASE_URL}/api/classes/progress`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    topicId: id,
                    categoryId: data?.video?.categoryId,
                    watchedPercentage: 100,
                    completed: true
                })
            });
            setMarkedComplete(true);
        } catch { /* silent */ }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        );
    }

    // Video embed URL (proxied through backend — no raw Drive URL in UI)
    const videoSrc = data?.video?._id
        ? `${API_BASE_URL}/api/classes/videos/${data.video._id}/embed`
        : "";

    const topics = data?.remainingTopics || [];
    const currentIdx = topics.findIndex((t: any) => t._id === id);
    const prevTopic = currentIdx > 0 ? topics[currentIdx - 1] : null;
    const nextTopic = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null;

    return (
        <LmsLayout userEmail={data?.userEmail}>
            {/* Two-column layout: video + sidebar */}
            <div className="flex flex-1 overflow-hidden relative protected-video-zone" style={{ minHeight: 'calc(100vh - 64px)' }}>

                {/* MAIN AREA */}
                <div className="flex-1 overflow-y-auto flex flex-col">

                    {/* Breadcrumb bar */}
                    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0">
                        <Link
                            to={`/classes/category/${data?.video?.categoryId}`}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Curriculum</span>
                        </Link>
                        <button
                            className="md:hidden flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 px-3 py-1.5 rounded-lg"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <BookOpen className="w-4 h-4" /> Curriculum
                        </button>
                    </div>

                    {/* VIDEO PLAYER */}
                    <div className="bg-black w-full select-none" style={{ aspectRatio: '16/9', position: 'relative' }}>
                        {/* Watermark */}
                        {data?.userEmail && (
                            <div
                                className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <span
                                    style={{
                                        color: 'rgba(255,255,255,0.07)',
                                        fontSize: 'clamp(14px, 2vw, 22px)',
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        transform: 'rotate(-25deg)',
                                        whiteSpace: 'nowrap',
                                        userSelect: 'none',
                                        textShadow: 'none',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {data.userEmail}
                                </span>
                            </div>
                        )}

                        {videoSrc ? (
                            <iframe
                                src={videoSrc}
                                className="w-full h-full border-none"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                title={data?.video?.title || "Class Video"}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                No video available.
                            </div>
                        )}
                    </div>

                    {/* VIDEO DETAILS */}
                    <div className="px-4 md:px-8 py-5 bg-white border-b border-gray-200">
                        <div className="max-w-[800px]">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                <h1 className="text-lg font-bold text-gray-900 leading-snug">{data?.video?.title}</h1>
                                <button
                                    onClick={markCompleted}
                                    disabled={markedComplete}
                                    className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all flex-shrink-0 border ${
                                        markedComplete
                                            ? 'bg-green-50 text-green-700 border-green-200 cursor-default'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                                    }`}
                                >
                                    {markedComplete ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Completed</>
                                    ) : (
                                        <><Check className="w-4 h-4" /> Mark Complete</>
                                    )}
                                </button>
                            </div>
                            {data?.video?.description && (
                                <p className="text-gray-500 text-sm leading-relaxed">{data.video.description}</p>
                            )}
                        </div>
                    </div>

                    {/* PREV / NEXT NAV */}
                    <div className="px-4 md:px-8 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
                        {prevTopic ? (
                            <Link
                                to={`/classes/video/${prevTopic._id}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </Link>
                        ) : <div />}
                        <div className="flex-1 text-center text-xs text-gray-400">
                            {currentIdx + 1} of {topics.length}
                        </div>
                        {nextTopic ? (
                            <Link
                                to={`/classes/video/${nextTopic._id}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : <div />}
                    </div>

                    {/* DISCUSSION */}
                    <div className="px-4 md:px-8 py-6 flex-1">
                        <div className="max-w-[800px]">
                            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                Class Discussion
                                {data?.comments?.length > 0 && (
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{data.comments.length}</span>
                                )}
                            </h2>

                            {/* Comment form */}
                            <form onSubmit={handleComment} className="mb-6">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Ask a question or share a note..."
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none bg-white transition-all"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={!comment.trim() || postingComment}
                                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {postingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                        Post
                                    </button>
                                </div>
                            </form>

                            {/* Comments list */}
                            {data?.comments?.length === 0 ? (
                                <div className="text-center py-8 border border-gray-100 rounded-xl bg-gray-50">
                                    <MessageSquare className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400">No discussion yet. Be the first to comment.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.comments.map((c: any) => (
                                        <div key={c._id} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 text-xs font-bold">
                                                {c.userEmail.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-gray-900">{c.userEmail.split('@')[0]}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR — curriculum */}
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <aside
                    ref={sidebarRef}
                    className={`
                        fixed right-0 top-[64px] bottom-0 w-[300px] z-40
                        md:relative md:top-auto md:z-auto md:w-[280px] md:flex-shrink-0
                        bg-white border-l border-gray-200 flex flex-col
                        transition-transform duration-200
                        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                    `}
                >
                    {/* Sidebar header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">Curriculum</h3>
                            <button className="md:hidden text-gray-400 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
                                ×
                            </button>
                        </div>
                        {topics.length > 0 && (
                            <>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full"
                                        style={{ width: `${Math.round(((topics.filter((t: any) => t.progress?.completed).length) / topics.length) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    {topics.filter((t: any) => t.progress?.completed).length} / {topics.length} completed
                                </p>
                            </>
                        )}
                    </div>

                    {/* Sidebar list */}
                    <div className="flex-1 overflow-y-auto">
                        {topics.map((t: any, idx: number) => {
                            const isActive = t._id === id;
                            const isDone = t.progress?.completed;
                            return (
                                <Link
                                    key={t._id}
                                    to={`/classes/video/${t._id}`}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 transition-colors hover:bg-blue-50 ${isActive ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''}`}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {isDone ? (
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        ) : (
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                                                {idx + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold line-clamp-2 leading-snug ${isActive ? 'text-blue-700' : isDone ? 'text-gray-400' : 'text-gray-700'}`}>
                                            {t.title}
                                        </p>
                                        {isActive && (
                                            <p className="text-[10px] text-blue-500 mt-0.5 font-medium flex items-center gap-1">
                                                <PlayCircle className="w-3 h-3" /> Now playing
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </LmsLayout>
    );
};

export default ClassesVideo;
