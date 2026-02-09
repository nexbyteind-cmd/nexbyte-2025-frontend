import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Trash2, Eye, EyeOff, Save } from "lucide-react";

interface ContentItem {
    _id?: string;
    type: string;
    isActive: boolean;
    order: number;
    quote?: string;
    client?: {
        initials: string;
        name: string;
        designation: string;
        company: string;
    };
    highlightMetric?: {
        label: string;
        value: string;
    };
    industry?: string;
    duration?: string;
    platforms?: string[];
    title?: string;
    challenge?: string;
    solution?: string;
    results?: any[];
}

interface TestimonialsSectionProps {
    testimonials: ContentItem[];
    newContent: ContentItem;
    setNewContent: (content: ContentItem) => void;
    editingContentId: string | null;
    setEditingContentId: (id: string | null) => void;
    handleSaveContent: (e: React.FormEvent) => void;
    handleDeleteContent: (id: string) => void;
    toggleContentStatus: (id: string, current: boolean) => void;
    showControls?: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
    testimonials,
    newContent,
    setNewContent,
    editingContentId,
    setEditingContentId,
    handleSaveContent,
    handleDeleteContent,
    toggleContentStatus
}) => {
    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{editingContentId ? "Edit Content" : "Add New Content"}</CardTitle>
                    <CardDescription>Create Testimonials or Case Studies</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveContent} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label>Type <span className="text-red-500">*</span></Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={newContent.type}
                                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                                    required
                                >
                                    <option value="testimonial">Testimonial</option>
                                    <option value="caseStudy">Case Study</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <Label>Order Priority <span className="text-red-500">*</span></Label>
                                <Input type="number" value={newContent.order} onChange={(e) => setNewContent({ ...newContent, order: parseInt(e.target.value) })} required />
                            </div>
                        </div>

                        {newContent.type === 'testimonial' ? (
                            <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                <h4 className="font-semibold text-sm">Testimonial Details</h4>
                                <Label>Quote <span className="text-red-500">*</span></Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200"
                                    value={newContent.quote}
                                    onChange={(e) => setNewContent({ ...newContent, quote: e.target.value })}
                                    required={newContent.type === 'testimonial'}
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Client Name *" value={newContent.client?.name || ""} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client!, name: e.target.value } })} required={newContent.type === 'testimonial'} />
                                    <Input placeholder="Initials (Avatar)" value={newContent.client?.initials || ""} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client!, initials: e.target.value } })} />
                                    <Input placeholder="Designation *" value={newContent.client?.designation || ""} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client!, designation: e.target.value } })} required={newContent.type === 'testimonial'} />
                                    <Input placeholder="Company *" value={newContent.client?.company || ""} onChange={(e) => setNewContent({ ...newContent, client: { ...newContent.client!, company: e.target.value } })} required={newContent.type === 'testimonial'} />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Metric Value (e.g. 340%) *" value={newContent.highlightMetric?.value || ""} onChange={(e) => setNewContent({ ...newContent, highlightMetric: { ...newContent.highlightMetric!, value: e.target.value } })} required={newContent.type === 'testimonial'} />
                                    <Input placeholder="Metric Label (e.g. Growth) *" value={newContent.highlightMetric?.label || ""} onChange={(e) => setNewContent({ ...newContent, highlightMetric: { ...newContent.highlightMetric!, label: e.target.value } })} required={newContent.type === 'testimonial'} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 border p-4 rounded-md bg-secondary/10">
                                <h4 className="font-semibold text-sm">Case Study Details</h4>
                                <Input placeholder="Title *" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} required={newContent.type === 'caseStudy'} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Industry *" value={newContent.industry} onChange={(e) => setNewContent({ ...newContent, industry: e.target.value })} required={newContent.type === 'caseStudy'} />
                                    <Input placeholder="Duration *" value={newContent.duration} onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })} required={newContent.type === 'caseStudy'} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Platforms (Comma separated) <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Instagram, Facebook..." value={newContent.platforms?.join(', ')} onChange={(e) => setNewContent({ ...newContent, platforms: e.target.value.split(',').map(s => s.trim()) })} required={newContent.type === 'caseStudy'} />
                                </div>

                                <Label>Challenge <span className="text-red-500">*</span></Label>
                                <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" value={newContent.challenge} onChange={(e) => setNewContent({ ...newContent, challenge: e.target.value })} required={newContent.type === 'caseStudy'} />

                                <Label>Solution <span className="text-red-500">*</span></Label>
                                <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200" value={newContent.solution} onChange={(e) => setNewContent({ ...newContent, solution: e.target.value })} required={newContent.type === 'caseStudy'} />

                                <div className="space-y-2">
                                    <Label>Results (JSON Format for now) <span className="text-red-500">*</span></Label>
                                    <p className="text-xs text-muted-foreground">{'Example: [{"label": "Growth", "value": "200%"}]'}</p>
                                    <textarea
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono border-gray-200"
                                        value={JSON.stringify(newContent.results)}
                                        onChange={(e) => {
                                            try { setNewContent({ ...newContent, results: JSON.parse(e.target.value) }) } catch (err) { }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            {editingContentId ? "Update Content (Hidden by Default)" : "Save Content (Hidden by Default)"}
                        </Button>
                        {editingContentId && (
                            <Button type="button" variant="outline" className="w-full mt-2" onClick={() => {
                                setEditingContentId(null);
                                setNewContent({
                                    type: "testimonial",
                                    isActive: false,
                                    order: 1,
                                    quote: "",
                                    client: { initials: "", name: "", designation: "", company: "" },
                                    highlightMetric: { label: "", value: "" },
                                    industry: "", duration: "", platforms: [], title: "", challenge: "", solution: "", results: []
                                });
                            }}>
                                Cancel Edit
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Existing Content</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {testimonials.length === 0 ? <p className="text-muted-foreground">No content found.</p> : (
                            testimonials.map((item, i) => (
                                <div key={i} className="flex flex-col p-4 border rounded-lg bg-card gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2 items-center">
                                            <span className={`px-2 py-1 rounded text-xs text-white ${item.type === 'testimonial' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                                {item.type === 'testimonial' ? 'Testimonial' : 'Case Study'}
                                            </span>
                                            {item.isActive ? <span className="text-green-600 text-xs font-bold">Active</span> : <span className="text-red-500 text-xs">Inactive</span>}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => {
                                                setNewContent(item);
                                                setEditingContentId(item._id || null);
                                            }}>
                                                <Monitor className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500" onClick={() => item._id && handleDeleteContent(item._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => item._id && toggleContentStatus(item._id, item.isActive)}>
                                                {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        {item.type === 'testimonial' ? (
                                            <>
                                                <p className="font-semibold">{item.client?.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">"{item.quote}"</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.industry} • {item.duration}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestimonialsSection;
