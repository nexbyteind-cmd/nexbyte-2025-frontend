import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, Send, CheckCircle2, PlayCircle, Loader2,
    MessageSquare, ChevronLeft, ChevronRight, BookOpen, Check, Menu, X
} from "lucide-react";
import { API_BASE_URL } from "@/config";

// ─── Security: scope all protections to this page only ───
const useVideoPageSecurity = () => {
    useEffect(() => {
        const preventContextMenu = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest(".protected-video-zone") || t.tagName === "IFRAME") e.preventDefault();
        };
        const preventShortcuts = (e: KeyboardEvent) => {
            const ctrl = e.ctrlKey || e.metaKey;
            if (
                e.key === "F12" ||
                (ctrl && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
                (ctrl && ["U", "u", "S", "s"].includes(e.key)) ||
                (ctrl && ["C", "c"].includes(e.key) && !window.getSelection()?.toString())
            ) { e.preventDefault(); e.stopPropagation(); }
        };
        const preventDrag = (e: DragEvent) => e.preventDefault();

        document.addEventListener("contextmenu", preventContextMenu);
        document.addEventListener("keydown", preventShortcuts, true);
        document.addEventListener("dragstart", preventDrag);
        return () => {
            document.removeEventListener("contextmenu", preventContextMenu);
            document.removeEventListener("keydown", preventShortcuts, true);
            document.removeEventListener("dragstart", preventDrag);
        };
    }, []);
};

const ClassesVideo = () => {
    useVideoPageSecurity();

    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [markedComplete, setMarkedComplete] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) { navigate("/classes"); return; }

        const fetchVideo = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/classes/videos/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                    setMarkedComplete(json.data?.video?.progress?.completed || false);
                } else {
                    navigate("/classes/dashboard");
                }
            } catch { console.error("Fetch video error"); }
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
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ topicId: id, categoryId: data?.video?.categoryId, watchedPercentage: 100, completed: true })
            });
            setMarkedComplete(true);
        } catch { /* silent */ }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F7F9]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
        );
    }

    const videoSrc = data?.video?._id ? `${API_BASE_URL}/api/classes/videos/${data.video._id}/embed` : "";
    const topics = data?.remainingTopics || [];
    const currentIdx = topics.findIndex((t: any) => t._id === id);
    const prevTopic = currentIdx > 0 ? topics[currentIdx - 1] : null;
    const nextTopic = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null;
    const completedInModule = topics.filter((t: any) => t.progress?.completed).length;
    const moduleProgress = topics.length > 0 ? Math.round((completedInModule / topics.length) * 100) : 0;
    const userEmail = data?.userEmail || "";

    return (
        <div
            className="h-screen flex flex-col overflow-hidden bg-white protected-video-zone"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Compact top bar */}
            <header className="h-12 bg-[#0f172a] flex items-center justify-between px-4 flex-shrink-0 z-40">
                <div className="flex items-center gap-3">
                    {/* Hamburger for mobile sidebar */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                    <Link
                        to={`/classes/category/${data?.video?.categoryId}`}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Back to Curriculum</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen style={{ width: 11, height: 11, color: "white" }} />
                    </div>
                    <span className="text-white text-xs font-semibold hidden sm:block">NexByte Learning</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/classes/dashboard" className="text-slate-400 hover:text-white text-xs transition-colors hidden sm:block">
                        Dashboard
                    </Link>
                    <button
                        onClick={() => { localStorage.removeItem("classes_token"); navigate("/classes"); }}
                        className="text-slate-500 hover:text-white text-xs transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            {/* Body: video column + sidebar */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* ── MAIN SCROLL AREA ── */}
                <div className="flex-1 flex flex-col overflow-y-auto min-w-0">

                    {/* VIDEO PLAYER — 16:9, fills width */}
                    <div className="bg-black w-full relative select-none flex-shrink-0" style={{ aspectRatio: "16/9" }}>
                        {/* 
                            The iframe loads via our backend proxy which redirects to:
                            https://drive.google.com/file/d/{id}/preview?rm=minimal
                            ?rm=minimal suppresses Drive's top toolbar (pop-out, share, download buttons).
                            We additionally overlay the top-right corner of the player to mask any
                            residual Drive controls that may appear there, using a color-matched div.
                            This is a CSS masking approach since cross-origin iframe DOM is inaccessible.
                        */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "52px",
                                height: "52px",
                                background: "#000",
                                zIndex: 10,
                                pointerEvents: "none",
                            }}
                        />

                        {/* User watermark */}
                        {userEmail && (
                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    zIndex: 9,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                    overflow: "hidden",
                                }}
                            >
                                <span style={{
                                    color: "rgba(255,255,255,0.06)",
                                    fontSize: "clamp(13px, 1.8vw, 20px)",
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    transform: "rotate(-22deg)",
                                    whiteSpace: "nowrap",
                                    userSelect: "none",
                                }}>
                                    {userEmail}
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
                                style={{ display: "block" }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                No video available for this class.
                            </div>
                        )}
                    </div>

                    {/* CLASS INFO */}
                    <div className="bg-white border-b border-gray-200 px-5 md:px-8 py-4">
                        <div className="max-w-[800px] flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                                    {data?.video?.title}
                                </h1>
                                {data?.video?.description && (
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-3">
                                        {data.video.description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={markCompleted}
                                disabled={markedComplete}
                                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all flex-shrink-0 ${
                                    markedComplete
                                        ? "bg-green-50 text-green-700 border-green-200 cursor-default"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                                }`}
                            >
                                {markedComplete ? <><CheckCircle2 className="w-4 h-4" /> Completed</> : <><Check className="w-4 h-4" /> Mark Complete</>}
                            </button>
                        </div>
                    </div>

                    {/* PREV / NEXT */}
                    <div className="bg-white border-b border-gray-200 px-5 md:px-8 py-3 flex items-center gap-3">
                        {prevTopic ? (
                            <Link
                                to={`/classes/video/${prevTopic._id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" /> Previous
                            </Link>
                        ) : <div />}
                        <div className="flex-1 text-center text-xs text-gray-400">
                            {currentIdx + 1} / {topics.length}
                        </div>
                        {nextTopic ? (
                            <Link
                                to={`/classes/video/${nextTopic._id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Next <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            markedComplete && (
                                <Link
                                    to={`/classes/category/${data?.video?.categoryId}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Module Done
                                </Link>
                            )
                        )}
                    </div>

                    {/* DISCUSSION */}
                    <div className="px-5 md:px-8 py-6 bg-[#F6F7F9] flex-1">
                        <div className="max-w-[700px]">
                            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                Class Discussion
                                {data?.comments?.length > 0 && (
                                    <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full font-medium">
                                        {data.comments.length}
                                    </span>
                                )}
                            </h2>

                            <form onSubmit={handleComment} className="mb-5 bg-white border border-gray-200 rounded-xl p-4">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Ask a question or leave a note..."
                                    rows={3}
                                    className="w-full text-sm text-gray-900 placeholder:text-gray-400 resize-none outline-none border-none"
                                />
                                <div className="flex justify-end border-t border-gray-100 pt-3 mt-2">
                                    <button
                                        type="submit"
                                        disabled={!comment.trim() || postingComment}
                                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {postingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                        Post
                                    </button>
                                </div>
                            </form>

                            {data?.comments?.length === 0 ? (
                                <div className="text-center py-8 border border-gray-200 rounded-xl bg-white">
                                    <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400">No comments yet. Start the discussion!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.comments.map((c: any) => (
                                        <div key={c._id} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-4">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 text-xs font-bold">
                                                {c.userEmail.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-gray-900">{c.userEmail.split("@")[0]}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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

                {/* ── CURRICULUM SIDEBAR ── */}
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={`
                    fixed right-0 top-12 bottom-0 w-[270px] z-40
                    md:relative md:top-auto md:z-auto md:w-[270px] md:flex-shrink-0
                    bg-white border-l border-gray-200 flex flex-col
                    transition-transform duration-200
                    ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                `}>
                    {/* Sidebar header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Curriculum</h3>
                            <button className="md:hidden text-gray-400 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${moduleProgress}%` }} />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">
                            {completedInModule} / {topics.length} completed · {moduleProgress}%
                        </p>
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
                                    className={`
                                        flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 transition-colors
                                        ${isActive ? "bg-blue-50 border-l-[3px] border-l-blue-600 pl-[13px]" : "hover:bg-gray-50"}
                                    `}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {isDone ? (
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        ) : (
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                                                isActive ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-gray-400"
                                            }`}>
                                                {idx + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold line-clamp-2 leading-snug ${
                                            isActive ? "text-blue-700" : isDone ? "text-gray-400" : "text-gray-700"
                                        }`}>
                                            {t.title}
                                        </p>
                                        {isActive && (
                                            <p className="text-[10px] text-blue-500 mt-0.5 flex items-center gap-0.5">
                                                <PlayCircle className="w-2.5 h-2.5" /> Now playing
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ClassesVideo;
