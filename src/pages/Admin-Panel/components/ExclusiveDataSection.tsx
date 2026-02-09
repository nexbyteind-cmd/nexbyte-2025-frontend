import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ExclusiveDataSectionProps {
    exclusiveData: any[];
    fetchExclusiveData: () => void;
    handleDeleteRecord: (collectionRoute: string, id: string, refreshFn: () => void) => void;
    showControls?: boolean;
}

const ExclusiveDataSection: React.FC<ExclusiveDataSectionProps> = ({
    exclusiveData,
    fetchExclusiveData,
    handleDeleteRecord
}) => {

    const handleDownloadExclusiveCSV = () => {
        if (exclusiveData.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Full Name", "WhatsApp", "Business Name", "Location", "Start Date", "Maps Link", "Message"];
        const rows = exclusiveData.map(item => {
            return [
                new Date(item.submittedAt).toLocaleDateString(),
                item.fullName,
                item.whatsappNumber,
                item.businessName,
                item.location,
                item.startDate,
                item.mapsLink,
                item.message
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `exclusive_data_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Exclusive Data (Google Reviews Leads)</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadExclusiveCSV} className="text-green-600 border-green-200">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchExclusiveData}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {exclusiveData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No data found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Maps Link</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exclusiveData.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{new Date(item.submittedAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{item.fullName}</TableCell>
                                        <TableCell>{item.whatsappNumber}</TableCell>
                                        <TableCell>{item.businessName}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>{item.startDate}</TableCell>
                                        <TableCell>
                                            <a href={item.mapsLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                View <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord('exclusive-data', item._id, fetchExclusiveData)}>
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

export default ExclusiveDataSection;
