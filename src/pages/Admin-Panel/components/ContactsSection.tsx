import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Contact {
    _id: string;
    submittedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}

interface ContactsSectionProps {
    contacts: Contact[];
    showControls?: boolean;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ contacts }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Inquiries</CardTitle>
                <CardDescription>
                    Manage messages from the contact form.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {contacts.length === 0 ? (
                    <div className="text-center py-8 text-black">No contacts yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow key={contact._id}>
                                        <TableCell>{new Date(contact.submittedAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
                                        <TableCell>{contact.email}</TableCell>
                                        <TableCell>{contact.subject}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={contact.message}>{contact.message}</TableCell>
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

export default ContactsSection;
