import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, CheckCircle2, Circle, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TodoTool = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    // Form State
    const [newTodo, setNewTodo] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Todo"
    });

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos`);
            const data = await response.json();
            if (data.success) setTodos(data.data);
        } catch (error) {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTodo)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Task created");
                fetchTodos();
                setIsAppModalOpen(false);
                setNewTodo({ title: "", description: "", priority: "Medium", status: "Todo" });
            }
        } catch (error) {
            toast.error("Error creating task");
        }
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.setData("todoId", id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("todoId");
        if (!id) return;

        // Optimistic update
        const originalTodos = [...todos];
        setTodos(prev => prev.map(t => t._id === id ? { ...t, status } : t));

        try {
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error("Failed to update");
        } catch (error) {
            toast.error("Failed to move task");
            setTodos(originalTodos); // Revert
        } finally {
            setDraggedId(null);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this task?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/todos/${id}`, { method: "DELETE" });
            toast.success("Task deleted");
            setTodos(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            toast.error("Error deleting task");
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-500 bg-red-100 border-red-200';
            case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'Low': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const Column = ({ title, status, icon: Icon, colorClass }: any) => {
        const tasks = todos.filter(t => t.status === status);

        return (
            <div
                className={`flex-1 min-w-[300px] flex flex-col rounded-xl bg-slate-50 border border-slate-200 h-full max-h-[calc(100vh-250px)]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
            >
                <div className={`p-4 border-b flex justify-between items-center bg-white rounded-t-xl ${colorClass}`}>
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <Icon className="w-4 h-4" />
                        {title}
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/50 border shadow-sm">
                        {tasks.length}
                    </span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {tasks.map(task => (
                        <div
                            key={task._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task._id)}
                            className={`
                                group relative p-4 bg-white rounded-lg border shadow-sm cursor-grab active:cursor-grabbing 
                                hover:shadow-md transition-all border-l-4
                                ${draggedId === task._id ? 'opacity-50' : 'opacity-100'}
                                ${task.priority === 'High' ? 'border-l-red-500' : task.priority === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-500'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm text-slate-900">{task.title}</h4>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                                    onClick={(e) => handleDelete(task._id, e)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>

                            {task.description && (
                                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                            )}

                            <div className="flex justify-between items-center mt-auto">
                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                            <p className="text-xs text-slate-400">Drop tasks here</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Task Board</h2>
                    <p className="text-muted-foreground">Drag and drop tasks to manage progress.</p>
                </div>
                <Button onClick={() => setIsAppModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
                <Column title="To Do" status="Todo" icon={Circle} colorClass="text-slate-700 bg-slate-50" />
                <Column title="In Progress" status="In Progress" icon={Clock} colorClass="text-blue-700 bg-blue-50" />
                <Column title="Done" status="Done" icon={CheckCircle2} colorClass="text-green-700 bg-green-50" />
            </div>

            <Dialog open={isAppModalOpen} onOpenChange={setIsAppModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>Create a task to track.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTodo} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Task Title</Label>
                            <Input
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                placeholder="E.g. Fix Navigation Bug"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={newTodo.priority}
                                onValueChange={(val) => setNewTodo({ ...newTodo, priority: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                placeholder="Add more details..."
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TodoTool;
