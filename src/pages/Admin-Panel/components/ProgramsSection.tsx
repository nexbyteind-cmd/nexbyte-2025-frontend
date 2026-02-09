import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, EyeOff, Trash2, ChevronUp, ChevronDown, ExternalLink, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ProgramsSectionProps {
    programs: any[];
    programApplications: any[];
    expandedPrograms: { [key: string]: boolean };
    setExpandedPrograms: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    newProgram: any;
    setNewProgram: (data: any) => void;
    editingProgramId: string | null;
    handleCreateProgram: (e: React.FormEvent) => void;
    handleEditProgram: (program: any) => void;
    handleCancelEditProgram: () => void;
    handleDeleteProgram: (id: string) => void;
    handleToggleProgramVisibility: (id: string, currentStatus: boolean, type: string) => void;
    fetchProgramApplications: () => void;
    resendingId: string | null;
    handleResendEmail: (collectionRoute: string, id: string) => void;
    openEmailModal: (email: string, subject: string) => void;
    handleDeleteRecord: (collectionRoute: string, id: string, refreshFn: () => void) => void;
    showControls?: boolean;
}

const ProgramsSection: React.FC<ProgramsSectionProps> = ({
    programs,
    programApplications,
    expandedPrograms,
    setExpandedPrograms,
    newProgram,
    setNewProgram,
    editingProgramId,
    handleCreateProgram,
    handleEditProgram,
    handleCancelEditProgram,
    handleDeleteProgram,
    handleToggleProgramVisibility,
    fetchProgramApplications,
    resendingId,
    handleResendEmail,
    openEmailModal,
    handleDeleteRecord,
    showControls = true
}) => {

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Create Program Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{editingProgramId ? "Edit Program" : "Create Programme (Training / Internship)"}</CardTitle>
                    <CardDescription>
                        {editingProgramId ? "Update the program details below." : "Create a new training or internship program."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateProgram} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Program Type <span className="text-red-500">*</span></Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={newProgram.type}
                                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                                required
                            >
                                <option value="Training">Training</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Title <span className="text-red-500">*</span></Label>
                            <Input value={newProgram.title} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} placeholder="e.g. Web Development Bootcamp" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Description <span className="text-red-500">*</span></Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200"
                                value={newProgram.description}
                                onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mode <span className="text-red-500">*</span></Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newProgram.mode} onChange={(e) => setNewProgram({ ...newProgram, mode: e.target.value })} required>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Duration <span className="text-red-500">*</span></Label>
                                <Input value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} placeholder="e.g. 6 Weeks / 3 Months" required />
                            </div>
                        </div>

                        {newProgram.type === "Training" ? (
                            <>
                                <div className="space-y-2">
                                    <Label>Fee (₹) <span className="text-red-500">*</span></Label>
                                    <Input type="number" value={newProgram.fee} onChange={(e) => setNewProgram({ ...newProgram, fee: parseInt(e.target.value) })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Skills Covered <span className="text-red-500">*</span></Label>
                                    <Input value={newProgram.skillsCovered} onChange={(e) => setNewProgram({ ...newProgram, skillsCovered: e.target.value })} placeholder="HTML, CSS, React..." required />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label>Stipend (₹) <span className="text-red-500">*</span></Label>
                                    <Input type="number" value={newProgram.stipend} onChange={(e) => setNewProgram({ ...newProgram, stipend: parseInt(e.target.value) })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Required Skills <span className="text-red-500">*</span></Label>
                                    <Input value={newProgram.requiredSkills} onChange={(e) => setNewProgram({ ...newProgram, requiredSkills: e.target.value })} placeholder="Basic JavaScript Knowledge..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Openings <span className="text-red-500">*</span></Label>
                                    <Input type="number" value={newProgram.openings} onChange={(e) => setNewProgram({ ...newProgram, openings: parseInt(e.target.value) })} required />
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date <span className="text-red-500">*</span></Label>
                                <Input type="date" value={newProgram.startDate} onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date <span className="text-red-500">*</span></Label>
                                <Input type="date" value={newProgram.endDate} onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Registration Deadline <span className="text-red-500">*</span></Label>
                                <Input type="date" value={newProgram.registrationDeadline} onChange={(e) => setNewProgram({ ...newProgram, registrationDeadline: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Helpline Number <span className="text-red-500">*</span></Label>
                                <Input type="tel" value={newProgram.helplineNumber} onChange={(e) => setNewProgram({ ...newProgram, helplineNumber: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Organizer Email <span className="text-red-500">*</span></Label>
                                <Input type="email" placeholder="organizer@example.com" value={newProgram.organizerEmail} onChange={(e) => setNewProgram({ ...newProgram, organizerEmail: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>WhatsApp Group Link <span className="text-red-500">*</span></Label>
                                <Input type="url" placeholder="https://chat.whatsapp.com/..." value={newProgram.whatsappGroupLink} onChange={(e) => setNewProgram({ ...newProgram, whatsappGroupLink: e.target.value })} required />
                            </div>
                        </div>

                        {/* Selection Rounds - Internship Only */}
                        {newProgram.type === "Internship" && (
                            <div className="space-y-4 border p-4 rounded-lg bg-secondary/10">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Selection Rounds</Label>
                                    <Button type="button" size="sm" variant="outline" onClick={() => setNewProgram({ ...newProgram, rounds: [...newProgram.rounds, { name: "", startDate: "", endDate: "" }] })}>
                                        + Add Round
                                    </Button>
                                </div>
                                {newProgram.rounds.map((round: any, index: number) => (
                                    <div key={index} className="grid grid-cols-7 gap-2 items-end">
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-xs">Round Name</Label>
                                            <Input
                                                placeholder="e.g. Assessment"
                                                value={round.name}
                                                onChange={(e) => {
                                                    const updatedRounds = [...newProgram.rounds];
                                                    updatedRounds[index].name = e.target.value;
                                                    setNewProgram({ ...newProgram, rounds: updatedRounds });
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-xs">Date</Label>
                                            <Input
                                                type="date"
                                                value={round.startDate}
                                                onChange={(e) => {
                                                    const updatedRounds = [...newProgram.rounds];
                                                    updatedRounds[index].startDate = e.target.value;
                                                    setNewProgram({ ...newProgram, rounds: updatedRounds });
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Button type="button" variant="destructive" size="icon" onClick={() => {
                                                const updatedRounds = newProgram.rounds.filter((_: any, i: number) => i !== index);
                                                setNewProgram({ ...newProgram, rounds: updatedRounds });
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1">
                                {editingProgramId ? `Update ${newProgram.type} (Hidden by Default)` : `Create ${newProgram.type} (Hidden by Default)`}
                            </Button>
                            {editingProgramId && (
                                <Button type="button" variant="outline" onClick={handleCancelEditProgram}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* List Programs */}
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Active Programs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {programs.length === 0 ? <p className="text-muted-foreground text-sm">No programs yet.</p> : programs.map((program) => {
                            const apps = programApplications.filter(a => (program.type === "Training" ? a.trainingId : a.internshipId) === program._id);
                            return (
                                <div key={program._id} className="border p-4 rounded-lg bg-card">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${program.type === 'Training' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {program.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{program.mode}</span>
                                            </div>
                                            <h4 className="font-bold">{program.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {program.duration} • {program.startDate} to {program.endDate}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{apps.length} Applications</span>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setExpandedPrograms(prev => ({ ...prev, [program._id]: !prev[program._id] }))}>
                                                    {expandedPrograms[program._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </Button>
                                                {/* CSV Download for Program Applicants */}
                                                <Button variant="outline" size="sm" className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => {
                                                    if (apps.length === 0) return toast.error("No applicants");
                                                    const headers = ["Name", "Email", "Phone", "Age", "College", "Type", "Resume Link", "Portfolio Link"];
                                                    const rows = apps.map(a => [a.fullName, a.email, a.phone, a.age, a.collegeName, program.type, a.resumeLink, a.portfolioLink].map(f => `"${f || ''}"`).join(","));
                                                    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
                                                    const link = document.createElement("a");
                                                    link.href = encodeURI(csv);
                                                    link.download = `${program.title}_applicants.csv`;
                                                    link.click();
                                                }}>
                                                    <Download className="w-3 h-3" />
                                                </Button>
                                                {showControls && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={`h-8 gap-1 ${program.isHidden ? 'text-gray-500 border-gray-200' : 'text-green-600 border-green-200'}`}
                                                        onClick={() => handleToggleProgramVisibility(program._id, program.isHidden, program.type)}
                                                        title={program.isHidden ? "Click to Unhide" : "Click to Hide"}
                                                    >
                                                        {program.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        {program.isHidden ? "Hidden" : "Visible"}
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" className="h-8 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleEditProgram(program)}>
                                                    Edit
                                                </Button>
                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteProgram(program._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {apps.length > 0 && expandedPrograms[program._id] && (
                                        <div className="mt-4 bg-secondary/10 p-3 rounded-md">
                                            <h5 className="font-semibold text-sm mb-2">Applicants:</h5>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="text-xs">Name</TableHead>
                                                            <TableHead className="text-xs">Email</TableHead>
                                                            <TableHead className="text-xs">Phone</TableHead>
                                                            <TableHead className="text-xs">College</TableHead>
                                                            <TableHead className="text-xs">Resume</TableHead>
                                                            <TableHead className="text-xs">Portfolio</TableHead>
                                                            <TableHead className="text-xs">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {apps.map((app, appIndex) => (
                                                            <TableRow key={appIndex}>
                                                                <TableCell className="text-xs">{app.fullName}</TableCell>
                                                                <TableCell className="text-xs">{app.email}</TableCell>
                                                                <TableCell className="text-xs">{app.phone}</TableCell>
                                                                <TableCell className="text-xs">{app.collegeName}</TableCell>
                                                                <TableCell className="text-xs">
                                                                    {app.resumeLink ? (
                                                                        <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                                            View <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    ) : <span className="text-muted-foreground">-</span>}
                                                                </TableCell>
                                                                <TableCell className="text-xs">
                                                                    {app.portfolioLink ? (
                                                                        <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                                            View <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    ) : <span className="text-muted-foreground">-</span>}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-2">
                                                                        <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.email, `Regarding your application for ${program.title}`)}>
                                                                            <Mail className="w-4 h-4 text-blue-500" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('program-applications', app._id)}>
                                                                            <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('program-applications', app._id, fetchProgramApplications)}>
                                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProgramsSection;
