import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle, PlayCircle, Loader2, MessageSquare, Menu } from "lucide-react";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClassesVideo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) {
            navigate("/classes");
            return;
        }

        const fetchVideo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/classes/videos/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    navigate("/classes/dashboard");
                }
            } catch (e) {
                console.error("Fetch video error", e);
            }
            setLoading(false);
        };
        
        fetchVideo();
        
        // Prevent right click on video
        const preventContextMenu = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === 'IFRAME') {
                e.preventDefault();
            }
        };
        document.addEventListener('contextmenu', preventContextMenu);
        return () => document.removeEventListener('contextmenu', preventContextMenu);
        
    }, [id, navigate]);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        const token = localStorage.getItem("classes_token");
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/comments`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ topicId: id, content: comment })
            });
            const json = await res.json();
            if (json.success) {
                setData(prev => ({
                    ...prev,
                    comments: [json.data, ...prev.comments]
                }));
                setComment("");
            }
        } catch (e) {
            console.error("Comment error", e);
        }
    };

    const markCompleted = async () => {
        const token = localStorage.getItem("classes_token");
        try {
            await fetch(`${API_BASE_URL}/api/classes/progress`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    topicId: id, 
                    categoryId: data?.video?.categoryId,
                    watchedPercentage: 100,
                    completed: true 
                })
            });
            // Update UI optimistically or just alert
            alert("Marked as completed!");
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const videoUrl = data?.video?.driveFileId 
        ? `https://drive.google.com/file/d/${data.video.driveFileId}/preview` 
        : "";

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans">
            <Navbar />
            
            {/* Top Navigation Bar */}
            <div className="bg-gray-900 text-white flex items-center justify-between px-4 py-3 sticky top-20 z-50 shadow-md mt-20">
                <Link to={`/classes/category/${data?.video?.categoryId}`} className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Curriculum
                </Link>
                <div className="font-semibold text-sm truncate max-w-md hidden md:block">
                    {data?.video?.title}
                </div>
                <button 
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    
                    {/* Video Player Area */}
                    <div className="bg-black w-full aspect-video relative group select-none">
                        {/* Overlay to deter right clicks visually if possible */}
                        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-20 bg-gradient-to-tr from-transparent via-transparent to-white"></div>
                        <div className="absolute bottom-4 right-4 z-10 opacity-30 pointer-events-none select-none">
                            <span className="text-white text-xs font-bold tracking-widest uppercase rotate-[-15deg] block">CONFIDENTIAL</span>
                        </div>
                        
                        {videoUrl ? (
                            <iframe 
                                src={videoUrl} 
                                className="w-full h-full border-none"
                                allow="autoplay"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
                                No media file found.
                            </div>
                        )}
                    </div>

                    {/* Video Details & Actions */}
                    <div className="bg-white border-b border-gray-200 p-6 md:p-8">
                        <div className="container max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data?.video?.title}</h1>
                                <button 
                                    onClick={markCompleted}
                                    className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 font-semibold px-4 py-2 rounded-lg transition-colors border border-green-200 shadow-sm"
                                >
                                    <CheckCircle className="w-5 h-5" /> Mark as Completed
                                </button>
                            </div>
                            
                            <div className="prose max-w-none text-gray-600">
                                <p className="whitespace-pre-wrap leading-relaxed">{data?.video?.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Comments / Discussion */}
                    <div className="bg-[#F9FAFB] p-6 md:p-8 flex-1">
                        <div className="container max-w-4xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-600" /> Class Discussion
                            </h2>

                            <form onSubmit={handleComment} className="mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Ask a question or share your thoughts..."
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all min-h-[100px] resize-y"
                                ></textarea>
                                <div className="flex justify-end mt-3">
                                    <button 
                                        type="submit" 
                                        disabled={!comment.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center shadow-sm"
                                    >
                                        <Send className="w-4 h-4 mr-2" /> Post Comment
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4">
                                {data?.comments?.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 font-medium">No discussion yet. Be the first to start!</p>
                                    </div>
                                ) : (
                                    data?.comments?.map((c: any) => (
                                        <div key={c._id} className="flex gap-4 bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                <span className="font-bold text-blue-700">{c.userEmail.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-900">{c.userEmail.split('@')[0]}</span>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {new Date(c.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{c.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Curriculum) */}
                <div className={`
                    absolute md:relative right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl md:shadow-none flex flex-col z-40 transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Curriculum</h3>
                        {sidebarOpen && (
                            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <div className="flex flex-col gap-1">
                            {data?.remainingTopics?.map((t: any, idx: number) => {
                                const isActive = t._id === id;
                                return (
                                    <Link 
                                        key={t._id} 
                                        to={`/classes/video/${t._id}`}
                                        className={`
                                            flex items-start gap-3 p-3 rounded-lg transition-colors
                                            ${isActive ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}
                                        `}
                                    >
                                        <div className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <PlayCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold line-clamp-2 ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {idx + 1}. {t.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{t.description}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClassesVideo;
