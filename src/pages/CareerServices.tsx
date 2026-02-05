import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight, ArrowRight, Loader2, CheckCircle2,
    Briefcase, Code, GraduationCap, Laptop, BookOpen,
    Target, Star, Users, Globe, Award, HelpCircle, UserCheck,
    Check, Rocket, TrendingUp, Zap, Shield, Menu,
    Database, Server, Globe as GlobeIcon, Cloud, Terminal, Cpu
} from "lucide-react";
import { FaPython, FaReact, FaNodeJs, FaJava, FaAws, FaDocker, FaLinux, FaGitAlt } from "react-icons/fa";
import { SiMongodb, SiPostgresql, SiKubernetes, SiTypescript } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_THEMES } from "@/lib/themes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- TYPES ---
interface CareerRole {
    role: string;
    description: string;
}

interface CareerPathStep {
    title: string;
    description: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface Technology {
    _id: string;
    name: string;
    tagline: string;
    intro: string;
    overview: string;
    roleOpportunities: CareerRole[];
    expertGuidance: string;
    benefits: string[];
    careerPath: CareerPathStep[];
    toolsCovered: string[];
    faqs: FAQ[];
    ctaText: string;
    sections?: any[];
    sectionVisibility?: {
        overview?: boolean;
        roles?: boolean;
        curriculum?: boolean;
        benefits?: boolean;
        expertGuidance?: boolean;
        faqs?: boolean;
    };
}

// Reusable Tech List Component
const TechList = ({
    technologies,
    selectedTechId,
    onSelect,
    isLoading,
    accentColor = "bg-indigo-600"
}: {
    technologies: Technology[] | undefined;
    selectedTechId: string | null;
    onSelect: (id: string) => void;
    isLoading: boolean;
    accentColor?: string;
}) => {
    return (
        <div className="space-y-1">
            {isLoading ? (
                <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-5 h-5 text-slate-400" /></div>
            ) : (
                technologies?.map((tech) => (
                    <button
                        key={tech._id}
                        onClick={() => onSelect(tech._id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group
                        ${selectedTechId === tech._id
                                ? `${accentColor} text-white shadow-md transform scale-105`
                                : "text-slate-600 hover:bg-slate-50 hover:pl-4"
                            }`}
                    >
                        <span>{tech.name}</span>
                        {selectedTechId === tech._id && <ChevronRight className="w-4 h-4" />}
                    </button>
                ))
            )}
        </div>
    );
};

const CareerServices = () => {
    const { toast } = useToast();
    const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
    const [enquiryForm, setEnquiryForm] = useState({
        name: "", email: "", phone: "", status: "Fresher", role: "Aspiring Developer", timeSlot: "", notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false); // Mobile sidebar state

    // Fetch Technologies (Sidebar)
    const { data: technologies, isLoading: techsLoading } = useQuery({
        queryKey: ["career-technologies"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/career/technologies`);
            const json = await res.json();
            return json.data as Technology[];
        },
    });

    // Fetch Selected Technology Details
    const { data: selectedTech, isLoading: techDetailsLoading } = useQuery({
        queryKey: ["career-technology", selectedTechId],
        queryFn: async () => {
            if (!selectedTechId) return null;
            const res = await fetch(`${API_BASE_URL}/api/career/technologies/${selectedTechId}`);
            const json = await res.json();
            return json.data as Technology;
        },
        enabled: !!selectedTechId,
    });

    useEffect(() => {
        if (technologies && technologies.length > 0 && !selectedTechId) {
            setSelectedTechId(technologies[0]._id);
        }
    }, [technologies, selectedTechId]);

    const handleTechSelect = (id: string) => {
        setSelectedTechId(id);
        setIsSheetOpen(false); // Close mobile sheet on select
    };

    const currentTheme = selectedTech ? (CATEGORY_THEMES[selectedTech.name] || CATEGORY_THEMES["All"]) : CATEGORY_THEMES["All"];
    const CurrentIcon = currentTheme.icon;

    const handleEnquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTech) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/career/enquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...enquiryForm, technology: selectedTech.name }),
            });

            const result = await response.json();
            if (result.success) {
                toast({ title: "Success", description: "Your enquiry has been submitted successfully!" });
                setEnquiryForm({ name: "", email: "", phone: "", status: "Fresher", role: "", timeSlot: "", notes: "" });
                setIsModalOpen(false);
            } else {
                toast({ title: "Error", description: "Failed to submit enquiry.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-neutral-900 flex flex-col">
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* COMPACT BANNER */}
            <div className={`relative overflow-hidden bg-gradient-to-r ${currentTheme.gradient} text-white transition-all duration-700 mt-16 py-12`}>
                {/* Floating Icons Background */}
                <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                    {[FaPython, FaReact, FaNodeJs, FaJava, FaAws, FaDocker, SiMongodb, SiPostgresql, SiKubernetes, SiTypescript, FaLinux, FaGitAlt].map((Icon, i) => (
                        <Icon
                            key={i}
                            className="absolute animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${Math.random() * 30 + 20}px`,
                                animationDuration: `${Math.random() * 15 + 15}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: 0.35
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md ${currentTheme.textColor} text-xs font-semibold mb-4 border border-white/10 shadow-lg`}>
                            <CurrentIcon className="w-3.5 h-3.5" />
                            <span>Transform Your Career</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                            Career Services & Training
                        </h1>
                        <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto font-light leading-relaxed">
                            {currentTheme.tagline || "Expert-led programs designed to bridge the gap between learning and employment."}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* INFO BAR - Horizontal Stats */}
            <div className="bg-indigo-50/50 border-b border-indigo-100 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-8 text-center text-sm">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-medium text-slate-700">50+ Interns Placed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-700">95% Success Rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-slate-700">Industry Recognized</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-700">100% Career Guidance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 container mx-auto px-4 lg:px-6 py-8">
                {/* Mobile Sidebar Trigger */}
                <div className="lg:hidden mb-6">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full flex justify-between items-center border-slate-300 text-slate-700">
                                <span className="flex items-center gap-2">
                                    <Menu className="w-4 h-4" />
                                    <span>Select Career Track</span>
                                </span>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    Career Tracks
                                </h3>
                                <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                                    <TechList
                                        technologies={technologies}
                                        selectedTechId={selectedTechId}
                                        onSelect={handleTechSelect}
                                        isLoading={techsLoading}
                                        accentColor={currentTheme.accentColor}
                                    />
                                </ScrollArea>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 text-left">

                    {/* SIDEBAR - Desktop Sticky */}
                    <nav className="hidden lg:block w-full lg:w-56 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-4">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                                Career Tracks
                            </h3>
                            <ScrollArea className="h-[calc(100vh-220px)]">
                                <TechList
                                    technologies={technologies}
                                    selectedTechId={selectedTechId}
                                    onSelect={handleTechSelect}
                                    isLoading={techsLoading}
                                    accentColor={currentTheme.accentColor}
                                />
                            </ScrollArea>
                        </div>
                    </nav>

                    {/* MAIN CONTENT - Landing Page Style */}
                    <main className="flex-1 min-w-0">
                        {techDetailsLoading ? (
                            <div className="h-96 flex justify-center items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            </div>
                        ) : selectedTech ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedTech._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8 pb-12"
                                >
                                    {/* HERO SECTION */}
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex md:items-start gap-4 mb-4 flex-col md:flex-row">
                                            <div className={`w-12 h-12 rounded-xl ${currentTheme.accentColor} flex items-center justify-center flex-shrink-0 text-white shadow-lg`}>
                                                <CurrentIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${currentTheme.accentColor} bg-opacity-10 ${currentTheme.textColor} text-xs font-semibold mb-2`}>
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Enrollment Open</span>
                                                </div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                                    {selectedTech.tagline || `Master ${selectedTech.name}`}
                                                </h2>
                                                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                                                    {selectedTech.intro}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                                <DialogTrigger asChild>
                                                    <Button className={`w-full sm:w-auto ${currentTheme.accentColor} hover:opacity-90 text-white px-6 py-2.5 rounded-lg font-medium border-0`}>
                                                        {selectedTech.ctaText || "Get Started"} <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white border-none rounded-2xl w-[95vw] sm:w-full">
                                                    <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto">
                                                        <div className="hidden md:flex w-1/3 bg-indigo-600 items-center justify-center p-8">
                                                            <div className="text-white text-center">
                                                                <Rocket className="w-12 h-12 mb-4 mx-auto" />
                                                                <h3 className="text-xl font-bold mb-2">Launch Your Career</h3>
                                                                <p className="text-indigo-100 text-sm">Expert guidance for your success</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 p-6 md:p-8">
                                                            <DialogHeader className="mb-4 text-left">
                                                                <DialogTitle className="text-2xl font-bold text-slate-900">Book Free Consultation</DialogTitle>
                                                                <DialogDescription>
                                                                    Fill out the form and our experts will contact you.
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <form onSubmit={handleEnquirySubmit} className="space-y-4">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    <div className="space-y-1.5">
                                                                        <Label htmlFor="name">Full Name</Label>
                                                                        <Input id="name" required className="bg-slate-50" value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} />
                                                                    </div>
                                                                    <div className="space-y-1.5">
                                                                        <Label htmlFor="phone">Phone</Label>
                                                                        <Input id="phone" type="tel" required className="bg-slate-50" value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label htmlFor="email">Email</Label>
                                                                    <Input id="email" type="email" required className="bg-slate-50" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label htmlFor="status">Status</Label>
                                                                    <select id="status" className="flex h-10 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm" value={enquiryForm.status} onChange={(e) => setEnquiryForm({ ...enquiryForm, status: e.target.value })}>
                                                                        <option value="Fresher">Fresher / Student</option>
                                                                        <option value="Experienced">Experienced</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label htmlFor="notes">Message (Optional)</Label>
                                                                    <Textarea id="notes" className="bg-slate-50 min-h-[70px]" value={enquiryForm.notes} onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })} />
                                                                </div>

                                                                <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10">
                                                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Submit Enquiry"}
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                        </div>
                                    </div>

                                    {/* OVERVIEW */}
                                    {selectedTech.overview && selectedTech.sectionVisibility?.overview !== false && (
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                                            <div className="flex items-center gap-2 mb-4">
                                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                                <h3 className="text-xl font-bold text-slate-900">Program Overview</h3>
                                            </div>
                                            <div
                                                className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: selectedTech.overview }}
                                            />
                                        </div>
                                    )}

                                    {/* CAREER OPPORTUNITIES - Grid */}
                                    {selectedTech.roleOpportunities?.length > 0 && selectedTech.sectionVisibility?.roles !== false && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Briefcase className="w-5 h-5 text-blue-600" />
                                                <h3 className="text-xl font-bold text-slate-900">Career Opportunities</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedTech.roleOpportunities.map((role, idx) => (
                                                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 transition-colors">
                                                        <h4 className="text-base font-semibold text-slate-900 mb-1.5">{role.role}</h4>
                                                        <p className="text-sm text-slate-600 leading-relaxed">{role.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* CURRICULUM - Timeline */}
                                    {selectedTech.careerPath?.length > 0 && selectedTech.sectionVisibility?.curriculum !== false && (
                                        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Target className="w-5 h-5 text-indigo-600" />
                                                <h3 className="text-xl font-bold text-slate-900">Learning Roadmap</h3>
                                            </div>
                                            <div className="space-y-5">
                                                {selectedTech.careerPath.map((step, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
                                                                {idx + 1}
                                                            </div>
                                                            {idx !== selectedTech.careerPath.length - 1 && (
                                                                <div className="w-0.5 flex-1 bg-slate-200 my-1.5"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-2">
                                                            <h4 className="text-base font-semibold text-slate-900 mb-1">{step.title}</h4>
                                                            <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* BENEFITS & TOOLS - Side by Side */}
                                    {(selectedTech.sectionVisibility?.benefits !== false) && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Benefits */}
                                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Zap className="w-5 h-5 text-amber-500" />
                                                    <h3 className="text-lg font-bold text-slate-900">Key Benefits</h3>
                                                </div>
                                                <ul className="space-y-2.5">
                                                    {selectedTech.benefits?.map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-sm">
                                                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                            <span className="text-slate-700">{benefit}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Tools */}
                                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Code className="w-5 h-5 text-blue-600" />
                                                    <h3 className="text-lg font-bold text-slate-900">Tools & Technologies</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTech.toolsCovered?.map((tool, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* EXPERT GUIDANCE */}
                                    {selectedTech.expertGuidance && selectedTech.sectionVisibility?.expertGuidance !== false && (
                                        <div className="bg-indigo-600 rounded-2xl p-6 text-white">
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                                    <UserCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold mb-2">Expert Guidance</h3>
                                                    <p className="text-sm text-indigo-100 leading-relaxed italic">
                                                        "{selectedTech.expertGuidance}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* FAQs */}
                                    {selectedTech.faqs?.length > 0 && selectedTech.sectionVisibility?.faqs !== false && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <HelpCircle className="w-5 h-5 text-slate-500" />
                                                <h3 className="text-xl font-bold text-slate-900">FAQs</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {selectedTech.faqs.map((faq, i) => (
                                                    <Accordion key={i} type="single" collapsible>
                                                        <AccordionItem value={`item-${i}`} className="border border-slate-200 rounded-xl px-5 bg-white">
                                                            <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline py-4 text-sm">
                                                                {faq.question}
                                                            </AccordionTrigger>
                                                            <AccordionContent className="text-slate-600 pb-4 text-sm leading-relaxed">
                                                                {faq.answer}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* FINAL CTA */}
                                    <div className="bg-slate-100 rounded-2xl p-8 text-center">
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Ready to Start Your Journey?</h4>
                                        <p className="text-sm text-slate-600 mb-4">Book a free consultation with our career experts today</p>
                                        <Button
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium"
                                        >
                                            Schedule Consultation
                                        </Button>
                                    </div>

                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="h-96 flex flex-col justify-center items-center text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                                <Rocket className="w-12 h-12 text-slate-300 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-700 mb-1">Select a Career Path</h3>
                                <p className="text-sm text-slate-500 max-w-sm">
                                    Choose a technology from the sidebar to explore details
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>


            <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                        10% { opacity: 0.3; }
                        90% { opacity: 0.3; }
                        100% { transform: translateY(-100px) rotate(20deg); opacity: 0; }
                    }
                    .animate-float {
                        animation-name: float;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                    }
                `}</style>

            <Footer />
        </div >
    );
};

export default CareerServices;