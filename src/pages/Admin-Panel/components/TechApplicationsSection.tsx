import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, Trash2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TechApplicationsSectionProps {
    techApplications: any[];
    fetchTechApplications: () => void;
    resendingId: string | null;
    handleResendEmail: (collectionRoute: string, id: string) => void;
    openEmailModal: (email: string, subject: string) => void;
    handleDeleteRecord: (collectionRoute: string, id: string, refreshFn: () => void) => void;
    showControls?: boolean;
}

const TechApplicationsSection: React.FC<TechApplicationsSectionProps> = ({
    techApplications,
    fetchTechApplications,
    resendingId,
    handleResendEmail,
    openEmailModal,
    handleDeleteRecord
}) => {

    const handleDownloadTechCSV = () => {
        if (techApplications.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Category", "Name", "Email", "Company", "Budget", "Details"];

        const rows = techApplications.map(app => {
            return [
                new Date(app.submittedAt).toLocaleDateString(),
                app.serviceCategory,
                app.commonDetails?.fullName,
                app.commonDetails?.email,
                app.commonDetails?.companyName,
                app.commonDetails?.budgetRange,
                JSON.stringify(app.serviceDetails).replace(/"/g, "'")
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `tech_applications_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Technology Inquiries</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadTechCSV} className="text-green-600 border-green-200">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchTechApplications}>
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {techApplications.length === 0 ? (
                    <div className="text-center py-8 text-black">No inquiries yet.</div>
                ) : (
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {techApplications.map((app, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(app.submittedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell><span className="font-semibold text-primary">{app.serviceCategory}</span></TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{app.commonDetails?.fullName}</span>
                                                <span className="text-xs text-muted-foreground">{app.commonDetails?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{app.commonDetails?.companyName || "-"}</TableCell>
                                        <TableCell>{app.commonDetails?.budgetRange || "-"}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">New</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => {
                                                    alert(JSON.stringify(app.serviceDetails, null, 2));
                                                }}>
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.commonDetails?.email, `Re: ${app.serviceCategory} Inquiry`)}>
                                                    <Mail className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('technology-applications', app._id)}>
                                                    <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('technology-applications', app._id, fetchTechApplications)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TechApplicationsSection;
