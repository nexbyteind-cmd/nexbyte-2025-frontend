import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Terms of Service</h1>
                        </div>

                        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms of Service govern the use of services provided by NEXBYTE DIGITAL AND TECHNOLOGY SERVICES, including digital marketing solutions, software and technology development, IT staffing and recruitment, internships and training programs, and hackathons or innovation events. By accessing our website or engaging with our services, users agree to comply with these terms and all applicable laws and regulations.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                All services are provided based on mutually agreed scopes, timelines, and deliverables. Digital marketing results, software performance, hiring outcomes, internship placements, or hackathon results may vary depending on multiple factors, and NEXBYTE does not guarantee specific outcomes unless explicitly stated in a written agreement.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                Users, clients, candidates, interns, and participants agree to provide accurate and lawful information and to not misuse our services for fraudulent, illegal, or unethical activities. Any violation may result in termination of services without notice.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                Intellectual property including content, designs, software, marketing materials, training modules, certificates, and branding created by NEXBYTE remain the property of the company unless otherwise agreed in writing. Unauthorized reproduction, redistribution, or commercial use is strictly prohibited.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                NEXBYTE DIGITAL AND TECHNOLOGY SERVICES shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use our services, including but not limited to data loss, business interruption, or opportunity loss.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to modify, suspend, or discontinue any service, internship program, event, or platform at any time without prior notice. Continued use of our services after changes to these Terms constitutes acceptance of the revised terms.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
