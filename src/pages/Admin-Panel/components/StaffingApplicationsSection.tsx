import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, Trash2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface StaffingApplicationsSectionProps {
    staffingApplications: any[];
    fetchStaffingApplications: () => void;
    resendingId: string | null;
    handleResendEmail: (collectionRoute: string, id: string) => void;
    openEmailModal: (email: string, subject: string) => void;
    handleDeleteRecord: (collectionRoute: string, id: string, refreshFn: () => void) => void;
    showControls?: boolean;
}

const StaffingApplicationsSection: React.FC<StaffingApplicationsSectionProps> = ({
    staffingApplications,
    fetchStaffingApplications,
    resendingId,
    handleResendEmail,
    openEmailModal,
    handleDeleteRecord
}) => {

    const handleDownloadStaffingCSV = () => {
        if (staffingApplications.length === 0) return toast.error("No data to download");

        const headers = [
            "Date", "Service Category", "Company Name", "Contact Person", "Email", "Phone",
            "Industry", "Size", "Timeline", "Budget", "Specific Requirements"
        ];

        const rows = staffingApplications.map(app => {
            const date = new Date(app.submittedAt).toLocaleDateString();
            const specific = JSON.stringify(app.staffingRequirements).replace(/"/g, "'"); // Escape quotes

            return [
                date,
                app.serviceCategory,
                app.companyDetails?.companyName,
                app.companyDetails?.contactPerson,
                app.companyDetails?.email,
                app.companyDetails?.phone,
                app.companyDetails?.industry,
                app.companyDetails?.companySize,
                app.companyDetails?.hiringTimeline,
                app.companyDetails?.budgetRange,
                specific
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `staffing_applications_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Staffing Requests</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadStaffingCSV} className="text-green-600 border-green-200">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchStaffingApplications}>
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {staffingApplications.length === 0 ? (
                    <div className="text-center py-8 text-black">No staffing requests yet.</div>
                ) : (
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffingApplications.map((app, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(app.submittedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell><span className="font-semibold text-primary">{app.serviceCategory}</span></TableCell>
                                        <TableCell>{app.companyDetails?.companyName}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{app.companyDetails?.contactPerson}</span>
                                                <span className="text-xs text-muted-foreground">{app.companyDetails?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{app.companyDetails?.phone}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => {
                                                    alert(JSON.stringify(app.staffingRequirements, null, 2));
                                                }}>
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.companyDetails?.email, `Re: ${app.serviceCategory} Request`)}>
                                                    <Mail className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('staffing-applications', app._id)}>
                                                    <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('staffing-applications', app._id, fetchStaffingApplications)}>
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

export default StaffingApplicationsSection;
