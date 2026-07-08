import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ValidationEmail {
    _id: string;
    email: string;
    createdAt: string;
}

const SocialPostValidationManager = () => {
    const [emails, setEmails] = useState<ValidationEmail[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Create state
    const [newEmail, setNewEmail] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editEmailValue, setEditEmailValue] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/social-post-emails`);
            const data = await response.json();
            if (data.success) {
                setEmails(data.data);
            } else {
                toast.error("Failed to load validation emails");
            }
        } catch (error) {
            console.error("Error fetching emails:", error);
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEmail = async () => {
        if (!newEmail.trim()) {
            toast.error("Please enter an email");
            return;
        }

        setIsCreating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/social-post-emails`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newEmail.trim() })
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Email added successfully");
                setNewEmail("");
                fetchEmails();
            } else {
                toast.error(data.message || "Failed to add email");
            }
        } catch (error) {
            toast.error("Error adding email");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteEmail = async (id: string) => {
        if (!confirm("Are you sure you want to delete this email?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/social-post-emails/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Email deleted");
                fetchEmails();
            } else {
                toast.error(data.message || "Failed to delete email");
            }
        } catch (error) {
            toast.error("Error deleting email");
        }
    };

    const startEditing = (email: ValidationEmail) => {
        setEditingId(email._id);
        setEditEmailValue(email.email);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditEmailValue("");
    };

    const handleUpdateEmail = async (id: string) => {
        if (!editEmailValue.trim()) {
            toast.error("Email cannot be empty");
            return;
        }

        setIsUpdating(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/social-post-emails/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: editEmailValue.trim() })
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Email updated");
                setEditingId(null);
                fetchEmails();
            } else {
                toast.error(data.message || "Failed to update email");
            }
        } catch (error) {
            toast.error("Error updating email");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add Allowed Email</CardTitle>
                    <CardDescription>Add an email address that is allowed to access Social Posts via OTP verification.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="new-email">Email Address</Label>
                            <Input
                                id="new-email"
                                type="email"
                                placeholder="e.g. user@company.com"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateEmail()}
                            />
                        </div>
                        <Button onClick={handleCreateEmail} disabled={isCreating}>
                            {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Allowed Emails List</CardTitle>
                    <CardDescription>Manage the emails currently authorized for Social Posts access.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : emails.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No emails found. Add an email above to grant access.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {emails.map((email) => (
                                <div key={email._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                    {editingId === email._id ? (
                                        <div className="flex items-center gap-3 flex-1">
                                            <Input 
                                                value={editEmailValue}
                                                onChange={(e) => setEditEmailValue(e.target.value)}
                                                className="max-w-md h-9"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleUpdateEmail(email._id)} disabled={isUpdating}>
                                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={cancelEditing} disabled={isUpdating}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="font-medium">{email.email}</p>
                                                <p className="text-xs text-gray-500">Added: {new Date(email.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" onClick={() => startEditing(email)}>
                                                    <Pencil className="w-4 h-4 text-blue-600" />
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteEmail(email._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SocialPostValidationManager;
