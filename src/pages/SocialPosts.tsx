import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share2, MessageCircle, MessageSquare, MessageSquareOff, Send, MoreHorizontal, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

// ImageKit Config (Public Key Only for displaying)
const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const SocialPosts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'popular'
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [commentInput, setCommentInput] = useState<Record<string, string>>({}); // { postId: commentText }

    useEffect(() => {
        fetchPosts();
    }, [sortBy]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/social-posts?sort=${sortBy}`);
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

    const handleLike = async (id: string) => {
        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));

        try {
            await fetch(`${API_BASE_URL}/api/social-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" })
            });
        } catch (error) {
            // Revert on error? For now just ignore
        }
    };

    const handleShare = async (id: string) => {
        // Optimistic UI
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

    const handleComment = async (id: string) => {
        const text = commentInput[id];
        if (!text || !text.trim()) return;

        const newComment = {
            user: "Guest User", // As requested, generic user but displayed simply
            text: text,
            date: new Date()
        };

        // Optimistic UI
        setPosts(posts.map(p => p._id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p));
        setCommentInput({ ...commentInput, [id]: "" });

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

    return (
        <IKContext publicKey={IK_PUBLIC_KEY} urlEndpoint={IK_URL_ENDPOINT}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />

                <main className="flex-1 container mx-auto px-4 py-8 mt-20 max-w-2xl">
                    <div className="text-center mb-8">
                        {/* Cleaner Header */}
                        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
                        <p className="text-sm text-gray-500 mb-6">Latest updates from the community</p>

                        {/* Sorting Tabs */}
                        <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => setSortBy("latest")}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${sortBy === "latest"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Latest
                            </button>
                            <button
                                onClick={() => setSortBy("popular")}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${sortBy === "popular"
                                    ? "bg-white text-orange-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <TrendingUp className="w-3 h-3" /> Trending
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-dashed p-8">
                            No posts available yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <Card key={post._id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
                                    <div className="flex flex-col h-full">
                                        {/* Header */}
                                        <div className="p-3 flex items-start gap-3">
                                            <Avatar className="h-10 w-10 border border-gray-100 cursor-pointer">
                                                <AvatarImage src="/placeholder-user.jpg" />
                                                <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">NB</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-sm font-semibold text-gray-900 truncate">NexByte Admin</h3>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • <span className="text-gray-400">Public</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content Text */}
                                        <div className="px-4 pb-2">
                                            <div className={`text-sm text-gray-800 whitespace-pre-wrap leading-relaxed ${!expandedPosts[post._id] && "line-clamp-3"}`}>
                                                {post.content}
                                            </div>
                                            {post.content && post.content.length > 150 && (
                                                <button
                                                    onClick={() => toggleReadMore(post._id)}
                                                    className="text-gray-500 hover:text-gray-700 text-xs font-medium mt-1 focus:outline-none"
                                                >
                                                    {expandedPosts[post._id] ? "...see less" : "...see more"}
                                                </button>
                                            )}
                                        </div>

                                        {/* Image */}
                                        {post.image && (
                                            <div className="mt-2 bg-gray-100 overflow-hidden border-t border-b border-gray-100">
                                                <IKImage
                                                    path={post.image}
                                                    transformation={[{ width: "800" }]}
                                                    className="w-full h-auto object-contain max-h-[500px]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}

                                        {/* Social Counts */}
                                        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-50 mx-2">
                                            <div className="flex items-center gap-1">
                                                {post.likes > 0 && (
                                                    <>
                                                        <div className="bg-blue-500 rounded-full p-0.5">
                                                            <ThumbsUp className="w-2 h-2 text-white fill-white" />
                                                        </div>
                                                        <span className="hover:text-blue-600 hover:underline cursor-pointer">{post.likes}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                {post.comments?.length > 0 && <span className="hover:text-blue-600 hover:underline cursor-pointer">{post.comments.length} comments</span>}
                                                {post.shares > 0 && <span className="hover:text-blue-600 hover:underline cursor-pointer">{post.shares} reposts</span>}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="px-2 py-1 flex items-center justify-between">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md py-3 h-auto"
                                                onClick={() => handleLike(post._id)}
                                            >
                                                <ThumbsUp className={`h-4 w-4 mr-2 ${post.likes > 0 ? "text-blue-600 fill-blue-600" : ""}`} />
                                                <span className="font-semibold text-xs text-gray-600">Like</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`flex-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md py-3 h-auto ${post.commentsHidden ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => !post.commentsHidden && document.getElementById(`comment-${post._id}`)?.focus()}
                                                disabled={post.commentsHidden}
                                            >
                                                {post.commentsHidden ? <MessageSquareOff className="h-4 w-4 mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                                                <span className="font-semibold text-xs text-gray-600">
                                                    {post.commentsHidden ? 'Off' : 'Comment'}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md py-3 h-auto"
                                                onClick={() => handleShare(post._id)}
                                            >
                                                <Share2 className="h-4 w-4 mr-2" />
                                                <span className="font-semibold text-xs text-gray-600">Share</span>
                                            </Button>
                                        </div>

                                        {/* Comment Input Section */}
                                        {!post.commentsHidden && (commentInput[post._id] || (post.comments && post.comments.length > 0)) && (
                                            <div className="bg-gray-50/50 p-3 pt-0 pb-3 transition-all duration-200">
                                                {/* Input */}
                                                <div className="flex gap-2 mb-3 mt-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src="/placeholder-user.jpg" />
                                                        <AvatarFallback className="bg-gray-200 text-gray-500 text-xs">G</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 relative">
                                                        <Input
                                                            id={`comment-${post._id}`}
                                                            placeholder="Add a comment..."
                                                            className="h-9 text-sm bg-white border-gray-200 rounded-full pr-10 focus-visible:ring-1 focus-visible:ring-gray-300"
                                                            value={commentInput[post._id] || ""}
                                                            onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleComment(post._id);
                                                            }}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="absolute right-1 top-0.5 h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-full"
                                                            onClick={() => handleComment(post._id)}
                                                            disabled={!commentInput[post._id]?.trim()}
                                                        >
                                                            <Send className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Comments List (Show only top 2 or all? Let's show all for now as user requested "just comments") */}
                                                {post.comments && post.comments.length > 0 && (
                                                    <div className="space-y-3 pl-10 pr-2">
                                                        {post.comments.map((comment: any, idx: number) => (
                                                            <div key={idx} className="bg-gray-100 rounded-r-lg rounded-bl-lg p-2.5 px-3">
                                                                <div className="flex justify-between items-baseline mb-0.5">
                                                                    {/* Simplified User Name */}
                                                                    <span className="text-xs font-bold text-gray-900">
                                                                        {comment.user === "Guest User" ? "Guest" : comment.user}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 ml-2">
                                                                        {new Date(comment.date).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-800 leading-snug">{comment.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </IKContext>
    );
};

export default SocialPosts;
