import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Check, X, CheckCircle2, XCircle, Video, Folder, Users, Eye, EyeOff, AlertTriangle, MessageSquare, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IKContext, IKUpload } from "imagekitio-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const authenticator = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/imagekit-auth`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return { signature: data.signature, expire: data.expire, token: data.token };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

interface ClassesAdminManagerProps {
    initialTab?: "approve_access" | "create_class" | "feedback";
}

const ClassesAdminManager = ({ initialTab = "approve_access" }: ClassesAdminManagerProps) => {
    const [activeTab, setActiveTab] = useState(initialTab); // create_class, approve_access, feedback
    const [learners, setLearners] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [feedbackData, setFeedbackData] = useState<any[]>([]);
    const [feedbackSort, setFeedbackSort] = useState<"latest" | "oldest">("latest");
    const [loading, setLoading] = useState(false);

    // Approve Access Form
    const [newEmail, setNewEmail] = useState("");
    const [selectedAllowedCategories, setSelectedAllowedCategories] = useState<string[]>([]);

    // Edit Access Form
    const [editAccessUser, setEditAccessUser] = useState<any>(null);
    const [editAccessCategories, setEditAccessCategories] = useState<string[]>([]);

    // Create Category Form
    const [catName, setCatName] = useState("");
    const [catHashtags, setCatHashtags] = useState("");
    const [catBanner, setCatBanner] = useState("");

    // Create Class Form
    const [classTitle, setClassTitle] = useState("");
    const [classDesc, setClassDesc] = useState("");
    const [classCategory, setClassCategory] = useState("");
    const [driveFiles, setDriveFiles] = useState<any[]>([]);
    const [fetchingDriveFiles, setFetchingDriveFiles] = useState(false);
    const [selectedDriveFile, setSelectedDriveFile] = useState("");

    // Dialogs
    const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
    const [deleteClassConfirm, setDeleteClassConfirm] = useState<string | null>(null);
    const [revokeAccessConfirm, setRevokeAccessConfirm] = useState<string | null>(null);

    // Edit states
    const [editingTopic, setEditingTopic] = useState<any>(null);
    const [editTopicTitle, setEditTopicTitle] = useState("");
    const [editTopicDesc, setEditTopicDesc] = useState("");

    useEffect(() => {
        fetchLearners();
        fetchCategories();
        fetchTopics();
        fetchFeedback();
    }, []);

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const fetchLearners = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/learners`);
            const json = await res.json();
            if (json.success) setLearners(json.data);
        } catch (e) {
            console.error("Failed to fetch learners");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/categories`);
            const json = await res.json();
            if (json.success) setCategories(json.data);
        } catch (e) {
            console.error("Failed to fetch categories");
        }
    };

    const fetchTopics = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/topics`);
            const json = await res.json();
            if (json.success) setTopics(json.data);
        } catch (e) {
            console.error("Failed to fetch topics");
        }
    };

    const fetchFeedback = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/feedback`);
            const json = await res.json();
            if (json.success) setFeedbackData(json.data);
        } catch (e) {
            console.error("Failed to fetch feedback");
        }
    };

    const handleDownloadFeedbackCSV = () => {
        if (feedbackData.length === 0) return toast.error("No feedback to download");
        
        const sorted = [...feedbackData].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return feedbackSort === "latest" ? dateB - dateA : dateA - dateB;
        });

        const headers = ["S.No", "Email ID", "Date", "Course Name", "Topic Title", "Question"];
        const rows = sorted.map((f, i) => {
            return [
                i + 1,
                f.email,
                new Date(f.date).toLocaleDateString(),
                f.courseName,
                f.topicTitle,
                (f.question || "").replace(/"/g, '""')
            ].map(v => `"${v}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `feedback_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // --- APPROVE ACCESS OPERATIONS ---
    const handleAddAccess = async () => {
        if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
            toast.error("Please enter a valid email address");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/learners/add-access`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newEmail.trim(), allowedCategories: selectedAllowedCategories })
            });
            const json = await res.json();
            if (json.success) {
                toast.success(json.message);
                setNewEmail("");
                setSelectedAllowedCategories([]);
                fetchLearners();
            } else {
                toast.error(json.message || "Failed to provide access");
            }
        } catch (e) {
            toast.error("Network error");
        }
        setLoading(false);
    };

    const handleUpdateAccess = async () => {
        if (!editAccessUser) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/learners/${editAccessUser._id}/access`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ allowedCategories: editAccessCategories })
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Course access updated successfully");
                setEditAccessUser(null);
                fetchLearners();
            } else {
                toast.error(json.message || "Failed to update access");
            }
        } catch (e) {
            toast.error("Network error");
        }
        setLoading(false);
    };

    const handleRevokeAccess = async () => {
        if (!revokeAccessConfirm) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/learners/${revokeAccessConfirm}/revoke-access`, {
                method: "POST"
            });
            if (res.ok) {
                toast.success("Access revoked successfully");
                fetchLearners();
            }
        } catch (e) {
            toast.error("Network error");
        }
        setRevokeAccessConfirm(null);
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to completely remove this learner? This deletes their email, progress, and revokes Drive access. This action cannot be undone.")) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/learners/${id}`, {
                method: "DELETE"
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success("Learner completely removed");
                fetchLearners();
            } else {
                toast.error(json.message || "Failed to delete learner");
            }
        } catch (e) {
            toast.error("Network error");
        }
        setLoading(false);
    };

    // --- CREATE CLASS OPERATIONS ---
    const handleCreateCategory = async () => {
        if (!catName.trim()) {
            toast.error("Category Title is required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: catName, 
                    description: catHashtags, 
                    banner: catBanner,
                    isPublished: true 
                })
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Category created and Drive folder generated");
                setCatName("");
                setCatHashtags("");
                setCatBanner("");
                fetchCategories();
            }
        } catch (e) {
            toast.error("Network error");
        }
        setLoading(false);
    };

    const handleDeleteCategory = async () => {
        if (!deleteCategoryConfirm) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/categories/${deleteCategoryConfirm}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Category and all its classes permanently deleted");
                fetchCategories();
                fetchTopics();
            }
        } catch (e) {
            toast.error("Network error");
        }
        setDeleteCategoryConfirm(null);
    };

    const fetchDriveFiles = async (categoryId: string) => {
        if (!categoryId) {
            setDriveFiles([]);
            return;
        }
        setFetchingDriveFiles(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/categories/${categoryId}/drive-files`);
            const json = await res.json();
            if (json.success) {
                setDriveFiles(json.data);
            } else {
                toast.error(json.message || "Failed to fetch Drive files");
            }
        } catch (e) {
            toast.error("Network error fetching Drive files");
        }
        setFetchingDriveFiles(false);
    };

    // When category changes, reset selection and fetch files
    useEffect(() => {
        if (classCategory) {
            fetchDriveFiles(classCategory);
            setSelectedDriveFile("");
        } else {
            setDriveFiles([]);
            setSelectedDriveFile("");
        }
    }, [classCategory]);

    const handleCreateClass = async () => {
        if (!classCategory || !classTitle.trim() || !classDesc.trim() || !selectedDriveFile) {
            toast.error("All fields and a selected video are required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/topics`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    categoryId: classCategory,
                    title: classTitle,
                    description: classDesc,
                    driveFileId: selectedDriveFile,
                    isPublished: true
                })
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Class created successfully");
                setClassTitle("");
                setClassDesc("");
                setSelectedDriveFile("");
                fetchTopics();
            }
        } catch (e) {
            toast.error("Network error");
        }
        setLoading(false);
    };

    const handleUpdateClass = async () => {
        if (!editingTopic || !editTopicTitle.trim()) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/topics/${editingTopic._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...editingTopic,
                    title: editTopicTitle,
                    description: editTopicDesc
                })
            });
            if (res.ok) {
                toast.success("Class updated");
                setEditingTopic(null);
                fetchTopics();
            }
        } catch (e) {
            toast.error("Network error");
        }
    };

    const handleToggleClassVisibility = async (topic: any) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/topics/${topic._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...topic,
                    isPublished: !topic.isPublished
                })
            });
            if (res.ok) {
                toast.success(`Class ${!topic.isPublished ? 'unhidden' : 'hidden'}`);
                fetchTopics();
            }
        } catch (e) {
            toast.error("Network error");
        }
    };

    const handleDeleteClass = async () => {
        if (!deleteClassConfirm) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/admin/topics/${deleteClassConfirm}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Class permanently deleted");
                fetchTopics();
            }
        } catch (e) {
            toast.error("Network error");
        }
        setDeleteClassConfirm(null);
    };


    return (
        <IKContext
            publicKey={IK_PUBLIC_KEY}
            urlEndpoint={IK_URL_ENDPOINT}
            authenticator={authenticator}
        >
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Online Classes</h2>
            </div>

            <div className="flex gap-4 border-b">
                <Button 
                    variant={activeTab === "approve_access" ? "default" : "ghost"}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                    data-state={activeTab === "approve_access" ? "active" : "inactive"}
                    onClick={() => setActiveTab("approve_access")}
                >
                    <Users className="w-4 h-4 mr-2" />
                    Approve Access
                </Button>
                <Button 
                    variant={activeTab === "create_class" ? "default" : "ghost"}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                    data-state={activeTab === "create_class" ? "active" : "inactive"}
                    onClick={() => setActiveTab("create_class")}
                >
                    <Folder className="w-4 h-4 mr-2" />
                    Create Class
                </Button>
                <Button 
                    variant={activeTab === "feedback" ? "default" : "ghost"}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
                    data-state={activeTab === "feedback" ? "active" : "inactive"}
                    onClick={() => setActiveTab("feedback")}
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Feedback
                </Button>
            </div>

            {/* TAB: APPROVE ACCESS */}
            {activeTab === "approve_access" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <Card>
                        <CardContent className="pt-6 flex flex-col gap-4">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Learner Email ID</label>
                                    <Input 
                                        placeholder="Enter Learner Email ID" 
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Button onClick={handleAddAccess} disabled={loading} className="shrink-0">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Provide Access
                                </Button>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-2 block">Select Allowed Courses (Optional, default is none)</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedAllowedCategories.length === 0 && <span className="text-xs text-gray-400">Select courses from below.</span>}
                                    {selectedAllowedCategories.map(catId => {
                                        const cat = categories.find(c => c._id === catId);
                                        return cat ? (
                                            <div key={catId} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-100">
                                                {cat.name}
                                                <button 
                                                    onClick={() => setSelectedAllowedCategories(prev => prev.filter(id => id !== catId))}
                                                    className="text-blue-400 hover:text-blue-700 ml-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                                <select 
                                    className="max-w-md w-full h-9 border rounded-md px-3 text-sm bg-white"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && !selectedAllowedCategories.includes(val)) {
                                            setSelectedAllowedCategories([...selectedAllowedCategories, val]);
                                        }
                                        e.target.value = "";
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select course to add...</option>
                                    {categories.filter(c => !selectedAllowedCategories.includes(c._id)).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Learner Access Requests</h3>
                        <div className="bg-white border rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 font-medium text-gray-500">Email ID</th>
                                        <th className="p-4 font-medium text-gray-500">Allowed Courses</th>
                                        <th className="p-4 font-medium text-gray-500">Status</th>
                                        <th className="p-4 font-medium text-gray-500">Date Permission Given</th>
                                        <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {learners.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                                No learners found.
                                            </td>
                                        </tr>
                                    ) : learners.map(learner => (
                                        <tr key={learner._id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium">{learner.email}</td>
                                            <td className="p-4">
                                                {learner.allowedCategories && learner.allowedCategories.length > 0 ? (
                                                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
                                                        {learner.allowedCategories.length} {learner.allowedCategories.length === 1 ? 'course' : 'courses'}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">None</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {learner.status === 'active' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active Access
                                                    </span>
                                                ) : learner.status === 'revoked' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Revoked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-500">
                                                {learner.approvedAt ? new Date(learner.approvedAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => {
                                                            setEditAccessUser(learner);
                                                            setEditAccessCategories(learner.allowedCategories || []);
                                                        }}
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit Access
                                                    </Button>
                                                    {learner.status === 'active' && (
                                                        <Button variant="destructive" size="sm" onClick={() => setRevokeAccessConfirm(learner._id)}>
                                                            <XCircle className="w-4 h-4 mr-2" /> Revoke
                                                        </Button>
                                                    )}
                                                    {learner.status === 'revoked' && (
                                                        <Button variant="outline" size="sm" className="text-green-600" onClick={() => { setNewEmail(learner.email); handleAddAccess(); }}>
                                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Re-Approve
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={() => handleDeleteUser(learner._id)} disabled={loading}>
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: CREATE CLASS */}
            {activeTab === "create_class" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Create Category */}
                    <Card>
                        <div className="bg-gray-50 px-6 py-3 border-b font-semibold text-gray-700">1. Create Category</div>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Category Banner</label>
                                <div className="border rounded-md px-3 py-2 bg-white flex items-center justify-between">
                                    <IKUpload
                                        fileName="category-banner"
                                        onSuccess={(res: any) => setCatBanner(res.url)}
                                        onError={(err) => toast.error("Upload failed: " + err.message)}
                                    />
                                    {catBanner && (
                                        <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden ml-2">
                                            <img src={catBanner} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Category Title</label>
                                <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Master Python" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Hashtags / Details</label>
                                <Input value={catHashtags} onChange={(e) => setCatHashtags(e.target.value)} placeholder="#python #backend" />
                            </div>
                            <div className="md:col-span-3 flex justify-end mt-2">
                                <Button onClick={handleCreateCategory} disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Create Category
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Create Class */}
                    <Card>
                        <div className="bg-gray-50 px-6 py-3 border-b font-semibold text-gray-700">2. Create Class</div>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Select Category</label>
                                    <select 
                                        className="w-full h-10 border rounded-md px-3 bg-white"
                                        value={classCategory}
                                        onChange={(e) => setClassCategory(e.target.value)}
                                    >
                                        <option value="">-- Choose Category --</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Class Title</label>
                                    <Input value={classTitle} onChange={(e) => setClassTitle(e.target.value)} placeholder="Lesson Title" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Detailed Description</label>
                                <textarea 
                                    className="w-full border rounded-md p-3 min-h-[100px]"
                                    value={classDesc}
                                    onChange={(e) => setClassDesc(e.target.value)}
                                    placeholder="Class description..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Select Video</label>
                                    <div className="flex gap-2">
                                        <select 
                                            className="w-full h-10 border rounded-md px-3 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                            value={selectedDriveFile}
                                            onChange={(e) => setSelectedDriveFile(e.target.value)}
                                            disabled={!classCategory || driveFiles.length === 0}
                                        >
                                            <option value="">{fetchingDriveFiles ? "Loading videos..." : "-- Select Video --"}</option>
                                            {driveFiles.map(f => (
                                                <option key={f.id} value={f.id}>{f.name} ({(f.size / (1024*1024)).toFixed(2)} MB)</option>
                                            ))}
                                        </select>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => fetchDriveFiles(classCategory)}
                                            disabled={!classCategory || fetchingDriveFiles}
                                            title="Refresh Videos"
                                        >
                                            <Loader2 className={`w-4 h-4 ${fetchingDriveFiles ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                    {!classCategory && <p className="text-xs text-gray-400 mt-1">Select a category first.</p>}
                                    {classCategory && driveFiles.length === 0 && !fetchingDriveFiles && (
                                        <p className="text-xs text-amber-600 mt-1">No videos found. Upload them to Drive first.</p>
                                    )}
                                </div>
                                <div className="flex items-end">
                                    <Button 
                                        variant="secondary"
                                        className="w-full"
                                        disabled={!classCategory}
                                        onClick={() => {
                                            const cat = categories.find(c => c._id === classCategory);
                                            if (cat && cat.driveFolderId) {
                                                window.open(`https://drive.google.com/drive/folders/${cat.driveFolderId}`, '_blank');
                                            }
                                        }}
                                        type="button"
                                    >
                                        <Folder className="w-4 h-4 mr-2" />
                                        Open Google Drive Folder
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                <b>Workflow:</b> 1. Open Google Drive Folder → 2. Upload Video in Drive → 3. Refresh Video List → 4. Select Video → 5. Publish
                            </p>
                            
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleCreateClass} disabled={loading} type="button">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                    Publish Class
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="h-px bg-gray-200 w-full my-8"></div>

                    {/* Category-wise Class Management */}
                    <div className="space-y-8">
                        <h3 className="font-bold text-xl text-gray-900">Manage Classes</h3>
                        
                        {categories.map(cat => {
                            const catTopics = topics.filter(t => t.categoryId === cat._id);
                            return (
                                <div key={cat._id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                                    <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg flex items-center">
                                                <Folder className="w-5 h-5 mr-2 text-blue-500" />
                                                {cat.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => setDeleteCategoryConfirm(cat._id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete Category
                                        </Button>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {catTopics.length === 0 ? (
                                            <p className="text-sm text-gray-500 p-4 text-center">No classes in this category yet.</p>
                                        ) : catTopics.map(topic => (
                                            <div key={topic._id} className={`flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 border rounded-lg ${!topic.isPublished ? 'bg-gray-50 opacity-75' : 'bg-white hover:border-blue-200'}`}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-semibold text-gray-900">{topic.title}</h5>
                                                        {!topic.isPublished && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Hidden</span>}
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{topic.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => handleToggleClassVisibility(topic)}
                                                    >
                                                        {topic.isPublished ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                                        {topic.isPublished ? 'Hide' : 'Unhide'}
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingTopic(topic);
                                                            setEditTopicTitle(topic.title);
                                                            setEditTopicDesc(topic.description);
                                                        }}
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteClassConfirm(topic._id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: FEEDBACK */}
            {activeTab === "feedback" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Learner Feedback</h3>
                        <div className="flex gap-4">
                            <select 
                                className="h-9 border rounded-md px-3 text-sm bg-white"
                                value={feedbackSort}
                                onChange={(e) => setFeedbackSort(e.target.value as any)}
                            >
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            <Button variant="outline" size="sm" onClick={handleDownloadFeedbackCSV}>
                                <Download className="w-4 h-4 mr-2" /> Download CSV
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-medium text-gray-500 w-16">S.No</th>
                                    <th className="p-4 font-medium text-gray-500 w-48">Email ID</th>
                                    <th className="p-4 font-medium text-gray-500 w-32">Date</th>
                                    <th className="p-4 font-medium text-gray-500 w-48">Course Name</th>
                                    <th className="p-4 font-medium text-gray-500">Question</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {feedbackData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No feedback found.
                                        </td>
                                    </tr>
                                ) : (
                                    [...feedbackData]
                                    .sort((a, b) => {
                                        const dateA = new Date(a.date).getTime();
                                        const dateB = new Date(b.date).getTime();
                                        return feedbackSort === "latest" ? dateB - dateA : dateA - dateB;
                                    })
                                    .map((f, i) => (
                                        <tr key={f._id} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-500 font-medium">{i + 1}</td>
                                            <td className="p-4 font-medium">{f.email}</td>
                                            <td className="p-4 text-gray-500">{new Date(f.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-blue-700">{f.courseName}</div>
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{f.topicTitle}</div>
                                            </td>
                                            <td className="p-4 text-gray-700 whitespace-pre-wrap">
                                                {f.question}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* EDIT TOPIC DIALOG */}
            <Dialog open={!!editingTopic} onOpenChange={(open) => !open && setEditingTopic(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Class</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Class Title</label>
                            <Input value={editTopicTitle} onChange={(e) => setEditTopicTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Detailed Description</label>
                            <textarea 
                                className="w-full border rounded-md p-3 min-h-[100px]"
                                value={editTopicDesc}
                                onChange={(e) => setEditTopicDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTopic(null)}>Cancel</Button>
                        <Button onClick={handleUpdateClass}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DESTRUCTIVE ACTION DIALOGS */}
            <Dialog open={!!deleteCategoryConfirm} onOpenChange={(open) => !open && setDeleteCategoryConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600">
                            <AlertTriangle className="w-5 h-5 mr-2" /> Delete Category
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-gray-900 font-medium">
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-gray-500">
                        Deleting this category will permanently delete the category and ALL classes/videos associated with it. Are you sure you want to proceed?
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteCategoryConfirm(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteCategory}>Permanently Delete Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteClassConfirm} onOpenChange={(open) => !open && setDeleteClassConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600">
                            <AlertTriangle className="w-5 h-5 mr-2" /> Delete Class
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            This action cannot be undone. Are you sure you want to permanently delete this class?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteClassConfirm(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteClass}>Delete Class</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!revokeAccessConfirm} onOpenChange={(open) => !open && setRevokeAccessConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-yellow-600">
                            <AlertTriangle className="w-5 h-5 mr-2" /> Revoke Access
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            This will revoke the learner's Google Drive access and block them from the Classes dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevokeAccessConfirm(null)}>Cancel</Button>
                        <Button onClick={handleRevokeAccess}>Revoke Access</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editAccessUser} onOpenChange={(open) => !open && setEditAccessUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Course Access</DialogTitle>
                        <DialogDescription>Modify allowed courses for this learner.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email ID</label>
                            <Input value={editAccessUser?.email} readOnly className="bg-gray-50" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">Existing Course Access</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {editAccessCategories.length === 0 && <span className="text-xs text-gray-400">No courses allowed.</span>}
                                {editAccessCategories.map(catId => {
                                    const cat = categories.find(c => c._id === catId);
                                    if (!cat) return null;
                                    return (
                                        <div key={catId} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-100">
                                            {cat.name}
                                            <button 
                                                onClick={() => setEditAccessCategories(prev => prev.filter(id => id !== catId))}
                                                className="text-blue-400 hover:text-blue-700 ml-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Add New Course</label>
                            <div className="flex gap-2">
                                <select 
                                    className="flex-1 h-9 border rounded-md px-3 text-sm bg-white"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && !editAccessCategories.includes(val)) {
                                            setEditAccessCategories([...editAccessCategories, val]);
                                        }
                                        e.target.value = ""; // reset
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select course to add...</option>
                                    {categories.filter(c => !editAccessCategories.includes(c._id)).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditAccessUser(null)}>Cancel</Button>
                        <Button onClick={handleUpdateAccess} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
        </IKContext>
    );
};

export default ClassesAdminManager;
