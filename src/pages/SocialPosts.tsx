import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, MessageSquare, MessageSquareOff, Send, Loader2, TrendingUp, Calendar, Sparkles, Youtube, Lock, Mail, ShieldCheck, Activity, BookOpen, ArrowRight, KeyRound } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { FaShareAlt, FaLightbulb, FaHandshake, FaGlobe } from "react-icons/fa";

// ImageKit Config
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

interface CategoryTheme {
    icon: any;
    gradient: string;
    tagline: string;
    textColor: string;
    accentColor: string;
}

// Themes for Social Posts (Knowledge/Info/Community)
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
    "All": {
        icon: FaGlobe,
        gradient: "from-teal-900 via-emerald-900 to-teal-900",
        tagline: "Connecting minds, sharing knowledge across the globe",
        textColor: "text-emerald-400",
        accentColor: "bg-emerald-500"
    },
    // Adding generic fallbacks or specific known categories if any. 
    // Since categories come from API, we'll use a default fallback or map specific ones if known.
    // For now, mapping some likely generic keys or default.
    "Information": {
        icon: FaLightbulb,
        gradient: "from-blue-900 via-cyan-900 to-blue-900",
        tagline: "Insights and information that empower",
        textColor: "text-cyan-400",
        accentColor: "bg-cyan-500"
    },
    "Community": {
        icon: FaHandshake,
        gradient: "from-indigo-900 via-purple-900 to-indigo-900",
        tagline: "Building bridges within the tech community",
        textColor: "text-purple-400",
        accentColor: "bg-purple-500"
    },
    "Events": {
        icon: Calendar,
        gradient: "from-orange-900 via-red-900 to-orange-900",
        tagline: "Upcoming meetups, webinars, and conferences",
        textColor: "text-orange-400",
        accentColor: "bg-orange-500"
    },
    "Share": {
        icon: FaShareAlt,
        gradient: "from-gray-900 via-slate-800 to-gray-900",
        tagline: "Sharing valuable resources and updates",
        textColor: "text-gray-400",
        accentColor: "bg-gray-500"
    }
};

const SocialPosts = () => {
    const [searchParams] = useSearchParams(); // Added to match pattern if needed, though previously locally managed

    // We can stick to local state if preferred, but URL params are better for sharing. 
    // The previous SocialPosts used local state. I'll switch to URL params for consistency with TechPosts if feasible, 
    // but to be safe and "same like above", I'll use local state initialized from URL if present.
    const initialCategory = "All";

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authStep, setAuthStep] = useState(1);
    const [authEmail, setAuthEmail] = useState("");
    const [authOtp, setAuthOtp] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(""); // Inline error state

    const handleVerifyEmail = async () => {
        setAuthError("");
        if (!authEmail.trim()) {
            setAuthError("Please enter an email address");
            return;
        }
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(authEmail.trim())) {
            setAuthError("Please enter a valid email address (e.g. name@company.com)");
            return;
        }
        setAuthLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail.trim() })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("OTP sent to your email!");
                setAuthStep(2);
            } else {
                setAuthError(data.message || "Email not authorized");
            }
        } catch (error) {
            setAuthError("Error verifying email. Please ensure backend is running.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleValidateOtp = async () => {
        setAuthError("");
        if (!authOtp.trim() || authOtp.length !== 6) {
            setAuthError("Please enter a valid 6-digit OTP");
            return;
        }
        setAuthLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts/validate-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail.trim(), otp: authOtp.trim() })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Access Granted");
                setIsAuthenticated(true);
            } else {
                setAuthError(data.message || "Invalid or expired OTP");
            }
        } catch (error) {
            setAuthError("Error validating OTP.");
        } finally {
            setAuthLoading(false);
        }
    };
    const [sortBy, setSortBy] = useState("latest");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({});
    const [commentValues, setCommentValues] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/social-posts?sort=${sortBy}`;
            if (selectedCategory && selectedCategory !== "All") {
                url += `&category=${encodeURIComponent(selectedCategory)}`;
            }
            if (date) {
                url += `&date=${date.toISOString()}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [sortBy, selectedCategory, date]);

    const handleLike = async (id: string) => {
        setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" })
            });
        } catch (error) { }
    };

    const handleShare = async (id: string) => {
        setPosts(posts.map(p => p._id === id ? { ...p, shares: (p.shares || 0) + 1 } : p));
        const shareUrl = `${window.location.origin}/social-posts/${id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "share" })
            });
        } catch (error) { }
    };

    const handleComment = async (id: string, text: string) => {
        if (!text || !text.trim()) return;
        const newComment = {
            user: "Guest User",
            text: text,
            date: new Date()
        };
        setPosts(posts.map(p => p._id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p));
        setCommentInput({ ...commentInput, [id]: "" });
        setCommentValues(prev => ({ ...prev, [id]: "" }));
        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "comment", payload: newComment })
            });
        } catch (error) {
            toast.error("Failed to post comment");
        }
    };

    const toggleReadMore = (id: string) => {
        setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Helper to get theme
    const getTheme = (catName: string) => {
        // Try exact match, or "Information" if uncategorized, or default
        return CATEGORY_THEMES[catName] || CATEGORY_THEMES["All"];
    };

    const currentTheme = getTheme(selectedCategory);
    const CurrentIcon = currentTheme.icon;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col font-sans bg-white">
                <Navbar />
                <div className="flex-1 flex mt-16 overflow-hidden">
                    
                    {/* LEFT SIDE - BRANDING */}
                    <div className="hidden lg:flex w-1/2 bg-[#0B1120] flex-col justify-between p-12 lg:p-20 text-white relative overflow-hidden">
                        {/* Grid Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        
                        
                        {/* Center Content */}
                        <div className="relative z-10 -mt-10">
                            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-12">
                                "The best platform we use<br/>for our <span className="text-[#3b82f6]">knowledge sharing</span>."
                            </h1>
                            
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/50">
                                        <ShieldCheck className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <span className="text-gray-300 font-medium tracking-wide">Enterprise-grade access security</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/50">
                                        <Activity className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <span className="text-gray-300 font-medium tracking-wide">Real-time engagement tracking</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/50">
                                        <BookOpen className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <span className="text-gray-300 font-medium tracking-wide">Curated tech insights & resources</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 text-sm text-slate-500 font-medium">
                            © 2026 NexByte Inc. All rights reserved.
                        </div>

                        {/* Subtle Glows */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                    </div>

                    {/* RIGHT SIDE - FORM */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-white relative">
                        <div className="w-full max-w-[420px] space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Sign in to continue your knowledge journey.
                                </p>
                            </div>

                            {authStep === 1 ? (
                                <div className="space-y-6 pt-2">
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                        <div className="relative mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={authEmail}
                                                onChange={(e) => setAuthEmail(e.target.value)}
                                                className={`pl-11 h-12 rounded-xl border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb] transition-shadow ${authError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
                                            />
                                        </div>
                                        {authError && <p className="text-red-500 text-sm mt-1.5 font-medium">{authError}</p>}
                                    </div>
                                    <Button 
                                        className="w-full h-12 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[15px] rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-2"
                                        onClick={handleVerifyEmail}
                                        disabled={authLoading}
                                    >
                                        {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>Sign In <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6 pt-2">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">One-Time Password</Label>
                                            <button 
                                                onClick={() => { setAuthStep(1); setAuthOtp(""); setAuthError(""); }}
                                                className="text-[13px] text-[#2563eb] hover:text-blue-700 font-medium"
                                                type="button"
                                            >
                                                Change email?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                id="otp"
                                                type="text"
                                                maxLength={6}
                                                placeholder="••••••"
                                                value={authOtp}
                                                onChange={(e) => setAuthOtp(e.target.value)}
                                                className={`pl-11 h-12 rounded-xl border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb] transition-shadow text-lg tracking-[0.2em] font-mono ${authError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                onKeyDown={(e) => e.key === 'Enter' && handleValidateOtp()}
                                            />
                                        </div>
                                        {authError ? (
                                            <p className="text-red-500 text-sm mt-1.5 font-medium">{authError}</p>
                                        ) : (
                                            <p className="text-xs text-gray-500 mt-2">
                                                OTP sent to <span className="font-medium text-gray-700">{authEmail}</span>. Valid for 1m.
                                            </p>
                                        )}
                                    </div>
                                    <Button 
                                        className="w-full h-12 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[15px] rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-2"
                                        onClick={handleValidateOtp}
                                        disabled={authLoading}
                                    >
                                        {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>Verify & Access <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </Button>
                                </div>
                            )}
                            
                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-[13px] text-gray-500">
                                    Don't have an account? <a href="#" className="font-semibold text-[#2563eb] hover:text-blue-500">Contact IT Support</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />

                {/* Dynamic Banner Section */}
                <div className={`mt-16 relative overflow-hidden bg-gradient-to-r ${currentTheme.gradient} text-white transition-all duration-700`}>
                    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <CurrentIcon
                                key={i}
                                className="absolute animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    fontSize: `${Math.random() * 40 + 20}px`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    animationDelay: `${Math.random() * 5}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center text-center">
                        <div className={`p-3 rounded-full bg-white/10 backdrop-blur-md mb-4 shadow-lg ${currentTheme.textColor}`}>
                            <CurrentIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                            {selectedCategory === "All" ? "Social Feed" : selectedCategory}
                        </h1>
                        <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
                            {currentTheme.tagline}
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-2 py-6 max-w-[1600px] -mt-8 relative z-20">
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Category Filter Pills */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300
                                        ${selectedCategory === "All"
                                            ? "bg-emerald-500 text-white shadow-md transform scale-105"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                        }
                                    `}
                                >
                                    <FaGlobe className={`w-3.5 h-3.5 ${selectedCategory === "All" ? "text-white" : "text-emerald-500"}`} />
                                    All Posts
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300
                                            ${selectedCategory === cat.name
                                                ? "bg-black text-white shadow-md transform scale-105"
                                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                            }
                                        `}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Filters & Sorting */}
                            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                {sortBy === 'latest' && (
                                    <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className={`p-2 rounded-md transition-all ${date ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-900 hover:bg-white"}`}>
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {date && (
                                            <button
                                                onClick={() => setDate(undefined)}
                                                className="text-[10px] text-red-500 ml-1 hover:underline font-medium"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => setSortBy("latest")}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === "latest"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => setSortBy("popular")}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${sortBy === "popular"
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </button>
                            </div>
                        </div>
                    </div>

                    <main className="min-h-[400px]">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <CurrentIcon className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
                                <p className="text-sm text-gray-500 mt-1">Be the first to share something about {selectedCategory}!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {posts.map((post) => (
                                    <Card key={post._id} className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col bg-white h-full rounded-xl">
                                        {post.image && (
                                            <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                                <IKImage
                                                    path={post.image}
                                                    transformation={[{ height: "400", width: "600" }]}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute top-3 left-3 z-20">
                                                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-white/50 flex items-center gap-1.5 text-gray-800">
                                                        <FaShareAlt className="w-3 h-3 text-emerald-600" />
                                                        {post.category || "Social"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="mb-4 flex-1">
                                                <div className={`text-sm text-gray-600 whitespace-pre-wrap leading-relaxed ${!expandedPosts[post._id] && "line-clamp-3"}`}>
                                                    {post.content}
                                                </div>
                                                {post.content && post.content.length > 150 && (
                                                    <button
                                                        onClick={() => toggleReadMore(post._id)}
                                                        className="text-blue-600 hover:text-blue-700 text-xs font-bold mt-2 focus:outline-none hover:underline"
                                                    >
                                                        {expandedPosts[post._id] ? "Show less" : "Read more"}
                                                    </button>
                                                )}
                                            </div>

                                            {post.actionLink && (
                                                <div className="mb-2">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-8 text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                                                        onClick={() => window.open(post.actionLink, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        {post.buttonText || "More Info"} <span className="text-[10px]">{post.buttonText === "Youtube" ? <Youtube className="w-3 h-3 ml-1" /> : "↗"}</span>
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-4 mt-auto">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 font-medium">
                                                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp className="w-3 h-3" /> {post.likes || 0}</span>
                                                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors"><MessageCircle className="w-3 h-3" /> {post.comments?.length || 0}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-3 mt-3 border-t border-gray-50">
                                                <Button variant="ghost" size="sm" className={`flex-1 h-8 text-xs rounded-lg transition-colors ${post.likes > 0 ? "text-blue-600 bg-blue-50 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`} onClick={() => handleLike(post._id)}>
                                                    <ThumbsUp className={`h-3.5 w-3.5 mr-1.5 ${post.likes > 0 ? "fill-current" : ""}`} /> Like
                                                </Button>
                                                <Button variant="ghost" size="sm" className={`flex-1 h-8 text-xs rounded-lg transition-colors ${post.commentsHidden ? 'opacity-50 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => !post.commentsHidden && setCommentInput(prev => ({ ...prev, [post._id]: prev[post._id] ? "" : "open" }))} disabled={post.commentsHidden}>
                                                    {post.commentsHidden ? <MessageSquareOff className="h-3.5 w-3.5 mr-1.5" /> : <MessageSquare className="h-3.5 w-3.5 mr-1.5" />} {post.commentsHidden ? 'Off' : 'Comment'}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors" onClick={() => handleShare(post._id)}>
                                                    <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
                                                </Button>
                                            </div>

                                            {!post.commentsHidden && commentInput[post._id] === "open" && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            placeholder="Write a comment..."
                                                            className="w-full pl-3 pr-9 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                                                            value={commentValues[post._id] || ""}
                                                            onChange={(e) => setCommentValues(prev => ({ ...prev, [post._id]: e.target.value }))}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id, commentValues[post._id] || "")}
                                                        />
                                                        <button
                                                            onClick={() => handleComment(post._id, commentValues[post._id] || "")}
                                                            className={`absolute right-1 top-1 p-1 rounded-md transition-all ${commentValues[post._id] ? "text-blue-600 hover:bg-blue-50" : "text-gray-300 cursor-not-allowed"}`}
                                                            disabled={!commentValues[post._id]}
                                                        >
                                                            <Send className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
                <Footer />
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                        10% { opacity: 0.5; }
                        90% { opacity: 0.5; }
                        100% { transform: translateY(-100px) rotate(20deg); opacity: 0; }
                    }
                    .animate-float {
                        animation-name: float;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                    }
                `}</style>
            </div>
        </IKContext>
    );
};

export default SocialPosts;