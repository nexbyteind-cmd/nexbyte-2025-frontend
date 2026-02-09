import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, Trash2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface MarketingApplicationsSectionProps {
    marketingApplications: any[];
    fetchMarketingApplications: () => void;
    resendingId: string | null;
    handleResendEmail: (collectionRoute: string, id: string) => void;
    openEmailModal: (email: string, subject: string) => void;
    handleDeleteRecord: (collectionRoute: string, id: string, refreshFn: () => void) => void;
    showControls?: boolean;
}

const MarketingApplicationsSection: React.FC<MarketingApplicationsSectionProps> = ({
    marketingApplications,
    fetchMarketingApplications,
    resendingId,
    handleResendEmail,
    openEmailModal,
    handleDeleteRecord
}) => {

    const handleDownloadMarketingCSV = () => {
        if (marketingApplications.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Name", "Email", "Company", "Service", "Budget", "Message"];
        const rows = marketingApplications.map(app => {
            return [
                new Date(app.submittedAt).toLocaleDateString(),
                app.name,
                app.email,
                app.companyName,
                app.serviceType,
                app.budget,
                app.message
            ].map(f => `"${f || ''}"`).join(",");
        });
        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `marketing_leads_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Marketing Leads</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadMarketingCSV} className="text-green-600 border-green-200">
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchMarketingApplications}>
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {marketingApplications.length === 0 ? <p className="text-center py-8">No marketing leads found.</p> : (
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {marketingApplications.map((app, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-xs text-muted-foreground">{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{app.clientDetails.businessName}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{app.clientDetails.fullName}</span>
                                                <span className="text-xs text-muted-foreground">{app.clientDetails.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell><span className="text-primary font-medium">{app.clientDetails.selectedService}</span></TableCell>
                                        <TableCell>{app.clientDetails.monthlyBudgetRange}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => alert(JSON.stringify(app.digitalMarketingRequirements, null, 2))}>
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEmailModal(app.clientDetails?.email, `Re: ${app.clientDetails?.selectedService} Strategy`)}>
                                                    <Mail className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Re-trigger Email" disabled={resendingId === app._id} onClick={() => handleResendEmail('marketing-applications', app._id)}>
                                                    <RefreshCw className={`w-4 h-4 text-orange-500 ${resendingId === app._id ? 'animate-spin' : ''}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('marketing-applications', app._id, fetchMarketingApplications)}>
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

export default MarketingApplicationsSection;
