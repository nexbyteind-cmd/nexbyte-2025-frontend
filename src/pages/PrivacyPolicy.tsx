import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-32 pb-20">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-8 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        </div>

                        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                            <p className="text-muted-foreground leading-relaxed">
                                NEXBYTE DIGITAL AND TECHNOLOGY SERVICES respects your privacy and is committed to protecting the personal information of users, clients, candidates, interns, and partners who interact with our website, platforms, and services. We collect information such as name, email address, phone number, company details, resumes, project submissions, and other relevant data only when voluntarily provided through contact forms, service inquiries, registrations, applications, or event participation.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                The information collected is used solely for service delivery purposes, including digital marketing execution, software and technology solutions, staffing and recruitment processes, internship and training management, hackathon participation, communication, customer support, and legal or operational requirements. We do not sell, rent, or trade personal information to third parties. Data may be shared only with trusted partners or service providers strictly for business operations, confidentiality, and compliance purposes.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                We implement reasonable technical and organizational security measures to protect personal data against unauthorized access, misuse, loss, or disclosure. While we strive to safeguard information, no method of transmission over the internet is 100% secure, and users acknowledge this risk when sharing information with us.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                Our website may use cookies and analytics tools to enhance user experience, analyze traffic, improve services, and optimize marketing efforts. Users may choose to disable cookies through their browser settings; however, some features may not function properly as a result.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                By using our services, website, or submitting information, users consent to the collection and use of information as described in this Privacy Policy. We reserve the right to update or modify this policy at any time, and continued use of our services constitutes acceptance of such changes.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
