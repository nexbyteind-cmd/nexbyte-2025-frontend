import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, Loader2, CheckCircle, Lock, BookOpen } from "lucide-react";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClassesCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("classes_token");
        if (!token) {
            navigate("/classes");
            return;
        }

        const fetchTopics = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/classes/categories/${id}/topics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    setTopics(json.data);
                }
            } catch (e) {
                console.error("Fetch topics error", e);
            }
            setLoading(false);
        };
        fetchTopics();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            {/* Header Area */}
            <div className="bg-white border-b border-gray-200 mt-20">
                <div className="container mx-auto max-w-5xl px-6 py-8 relative z-10">
                    <Link to="/classes/dashboard" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Workspace
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Module Curriculum</h1>
                    <p className="text-gray-500 mt-2 text-lg">Select a class to start learning.</p>
                </div>
            </div>

            <main className="flex-1 container mx-auto max-w-5xl px-6 py-12 relative z-10">
                
                {topics.length === 0 ? (
                    <div className="p-16 text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium text-lg">No classes found in this module yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {topics.map((topic, idx) => {
                                const isCompleted = topic.progress?.completed;
                                const progressPerc = topic.progress?.watchedPercentage || 0;
                                
                                return (
                                    <Link 
                                        to={`/classes/video/${topic._id}`} 
                                        key={topic._id}
                                        className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl relative group-hover:scale-105 transition-transform">
                                            {idx + 1}
                                            {isCompleted && (
                                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5">
                                                    <CheckCircle className="w-5 h-5 text-green-500" fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                                                {topic.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">{topic.description}</p>
                                        </div>

                                        <div className="flex-shrink-0 flex flex-col items-end md:items-center w-full md:w-auto mt-4 md:mt-0">
                                            <div className="flex items-center text-blue-600 font-semibold group-hover:bg-blue-600 group-hover:text-white px-4 py-2 rounded-lg transition-colors border border-blue-200 group-hover:border-blue-600">
                                                <PlayCircle className="w-5 h-5 mr-2" /> Play Video
                                            </div>
                                            {progressPerc > 0 && !isCompleted && (
                                                <p className="text-xs font-semibold text-gray-400 mt-3">{Math.round(progressPerc)}% completed</p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ClassesCategory;
