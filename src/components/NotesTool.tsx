import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Assuming these exist provided the user has shadcn
import { Label } from "@/components/ui/label";
import { Star, Plus, Trash2, ExternalLink, Calendar, Link as LinkIcon, X } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Assuming Switch exists

const NotesTool = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewNote, setViewNote] = useState<any | null>(null);

    // Form State
    const [newNote, setNewNote] = useState({
        title: "",
        description: "",
        reason: "",
        important: false,
        links: [] as { url: string }[]
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/notes`);
            const data = await response.json();
            if (data.success) {
                setNotes(data.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            toast.error("Failed to load notes");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Filter empty links
            const payload = {
                ...newNote,
                links: newNote.links.filter(l => l.url.trim() !== "").map(l => l.url)
            };

            const response = await fetch(`${API_BASE_URL}/api/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Note created successfully!");
                fetchNotes();
                setIsModalOpen(false);
                setNewNote({ title: "", description: "", reason: "", important: false, links: [] });
            } else {
                toast.error("Failed to create note");
            }
        } catch (error) {
            toast.error("Error creating note");
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                toast.success("Note deleted");
                fetchNotes();
                if (viewNote?._id === id) setViewNote(null);
            }
        } catch (error) {
            toast.error("Error deleting note");
        }
    };

    const addLinkField = () => {
        setNewNote({ ...newNote, links: [...newNote.links, { url: "" }] });
    };

    const removeLinkField = (index: number) => {
        const updated = [...newNote.links];
        updated.splice(index, 1);
        setNewNote({ ...newNote, links: updated });
    };

    const updateLinkField = (index: number, value: string) => {
        const updated = [...newNote.links];
        updated[index].url = value;
        setNewNote({ ...newNote, links: updated });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
                    <p className="text-muted-foreground">Manage your important notes and quick links.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Note
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading notes...</div>
            ) : notes.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <p className="text-muted-foreground">No notes found. Create your first note!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {notes.map((note) => (
                        <Card key={note._id} className="cursor-pointer hover:shadow-md transition-shadow relative group" onClick={() => setViewNote(note)}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-semibold line-clamp-1 pr-6">
                                        {note.title}
                                    </CardTitle>
                                    {note.important && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 absolute top-6 right-6" />}
                                </div>
                                <CardDescription className="text-xs flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                                    {note.description}
                                </p>
                                {note.links && note.links.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600">
                                        <LinkIcon className="w-3 h-3" />
                                        {note.links.length} Link{note.links.length > 1 ? 's' : ''}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Note Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Note</DialogTitle>
                        <DialogDescription>Add a new note to your collection.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder="Note Title"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Detailed description..."
                                value={newNote.description}
                                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Reason / Purpose</Label>
                            <Input
                                placeholder="Why matches this note?"
                                value={newNote.reason}
                                onChange={(e) => setNewNote({ ...newNote, reason: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                            <Switch
                                id="important-mode"
                                checked={newNote.important}
                                onCheckedChange={(checked) => setNewNote({ ...newNote, important: checked })}
                            />
                            <Label htmlFor="important-mode" className="flex items-center gap-2 cursor-pointer">
                                Mark as Important <Star className={`w-4 h-4 ${newNote.important ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Links</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addLinkField} className="h-7 text-xs">
                                    <Plus className="w-3 h-3 mr-1" /> Add Link
                                </Button>
                            </div>
                            {newNote.links.map((link, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="https://..."
                                        value={link.url}
                                        onChange={(e) => updateLinkField(index, e.target.value)}
                                        className="text-sm"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLinkField(index)}>
                                        <X className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            {newNote.links.length === 0 && <p className="text-xs text-muted-foreground italic">No links added.</p>}
                        </div>

                        <DialogFooter>
                            <Button type="submit">Save Note</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Note Modal */}
            <Dialog open={!!viewNote} onOpenChange={(open) => !open && setViewNote(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <div className="flex justify-between items-start pr-8">
                            <div>
                                <DialogTitle className="text-xl flex items-center gap-2">
                                    {viewNote?.title}
                                    {viewNote?.important && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                                </DialogTitle>
                                <DialogDescription>
                                    Created on {viewNote && new Date(viewNote.createdAt).toLocaleString()}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {viewNote?.reason && (
                            <div className="p-3 bg-muted/30 rounded-md border-l-4 border-primary">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Purpose</p>
                                <p className="text-sm">{viewNote.reason}</p>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-sm mb-2">Description</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {viewNote?.description || "No description provided."}
                            </p>
                        </div>

                        {viewNote?.links && viewNote.links.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Links</h4>
                                <div className="space-y-1">
                                    {viewNote.links.map((link: string, i: number) => (
                                        <a
                                            key={i}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-2 rounded hover:bg-blue-50 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                if (viewNote) handleDeleteNote(viewNote._id);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Note
                        </Button>
                        <Button variant="outline" onClick={() => setViewNote(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NotesTool;
