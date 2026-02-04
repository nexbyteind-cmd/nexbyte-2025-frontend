import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import {
    FaGoogle, FaWhatsapp, FaRocket, FaStar, FaGlobe, FaMapMarkerAlt,
    FaUsers, FaChartLine, FaCheckCircle, FaArrowRight
} from "react-icons/fa";
import {
    TrendingUp, BarChart3, MessageSquare, Zap, ShieldCheck,
    ChevronDown, ChevronUp, Sparkles, Star
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// Simplified Google Colors
const GOOGLE_COLORS = {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC04',
    green: '#34A853'
};

// Simplified Floating Review Card
const ReviewCard = ({ name, text, delay, color }: { name: string, text: string, delay: number, color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 max-w-[220px] absolute hidden lg:block"
        style={{
            top: `${Math.random() * 50 + 20}%`,
            right: `${Math.random() * 20 + 5}%`,
            zIndex: 1,
            borderLeft: `3px solid ${color}`
        }}
    >
        <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] uppercase"
                style={{ background: color }}>
                {name[0]}
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-800">{name}</p>
                <div className="flex text-yellow-400 text-[8px] gap-0.5">
                    {[...Array(5)].map((_, i) => <FaStar key={i} fill="#FBBC04" />)}
                </div>
            </div>
        </div>
        <p className="text-[9px] text-gray-600 leading-tight">{text}</p>
    </motion.div>
);

const GoogleReviewsMarketing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        fullName: "", whatsappNumber: "", email: "", businessName: "",
        mapsLink: "", location: "", startDate: "", message: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/exclusive-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Application Received! We will be in touch shortly.");
                setFormData({
                    fullName: "", whatsappNumber: "", email: "", businessName: "",
                    mapsLink: "", location: "", startDate: "", message: ""
                });
                setIsFormOpen(false);
            } else {
                toast.error("Submission failed. Please try again.");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/918247872473?text=${encodeURIComponent("Hi, I want to grow my Google Reviews.")}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans selection:bg-blue-50 selection:text-blue-900">
            <Navbar />

            {/* --- SECTION 1: HERO --- */}
            <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
                <div className="container px-4 relative z-10 mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:w-1/2 text-center lg:text-left"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider mb-6 border bg-white shadow-sm text-blue-600 border-blue-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                #1 RATED GROWTH STRATEGY
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-4 text-slate-900 leading-tight">
                                Turn Google Reviews <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Into Revenue.
                                </span>
                            </h1>

                            <p className="text-base lg:text-lg text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Dominate local SEO, build unshakeable trust, and automate your reputation management.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                                <Button
                                    onClick={() => setIsFormOpen(true)}
                                    className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                                >
                                    Get Started Now <FaArrowRight className="ml-2 text-xs" />
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleWhatsAppClick}
                                    className="h-12 px-6 rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold text-sm transition-all"
                                >
                                    <FaWhatsapp className="mr-2 text-lg" /> Chat on WhatsApp
                                </Button>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">U{i}</div>
                                    ))}
                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-white text-[8px]">+2k</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400 text-[10px]">
                                        {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                    </div>
                                    <span>4.9/5 Rating</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Visual Element */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative h-[400px] w-full hidden md:block"
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Background Circle */}
                                <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-50 blur-3xl" />

                                {/* Center Card */}
                                <div className="relative w-[280px] h-[280px] bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center z-10 border border-slate-100">
                                    <FaGoogle className="text-5xl mb-4 text-blue-500" />
                                    <p className="text-6xl font-black text-slate-800 tracking-tighter">4.9</p>
                                    <div className="flex text-xl justify-center my-3 gap-1">
                                        {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Average Rating</p>
                                </div>

                                {/* Simplified Floating Cards */}
                                <ReviewCard name="Sanjay A." text="Revenue doubled in 2 weeks!" delay={0.6} color={GOOGLE_COLORS.blue} />
                                <ReviewCard name="Rahul K." text="Highly recommended!" delay={0.8} color={GOOGLE_COLORS.green} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: TRUST STRIP --- */}
            <section className="py-8 border-y border-slate-100 bg-slate-50/50">
                <div className="container mx-auto px-4">
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by 500+ Businesses</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                        {['Retail', 'Hospitality', 'Healthcare', 'Real Estate', 'Education'].map((industry, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                <FaCheckCircle className="text-blue-500" /> {industry}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: VISUAL GROWTH GRAPH --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Numbers Don't Lie.</h2>
                        <p className="text-sm text-slate-500">See the difference a proactive reputation strategy makes.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                        {/* Without Optimization */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-600 mb-6 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400" /> Without Us
                            </h3>
                            <div className="space-y-4">
                                {[{ l: 'Traffic', w: '30%' }, { l: 'Trust', w: '45%' }, { l: 'Leads', w: '20%' }].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-16 text-xs font-medium text-slate-500">{item.l}</div>
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div style={{ width: item.w }} className="h-full bg-slate-400 rounded-full" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">{item.w}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* With Our Strategy */}
                        <div className="bg-blue-600 rounded-2xl p-6 shadow-xl text-white transform md:scale-105 border-4 border-blue-100">
                            <h3 className="text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2 text-blue-100">
                                <div className="w-2 h-2 rounded-full bg-blue-200 animate-pulse" /> With Our Strategy
                            </h3>
                            <div className="space-y-5">
                                {[{ l: 'Traffic', w: '95%' }, { l: 'Trust', w: '98%' }, { l: 'Leads', w: '92%' }].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-16 text-xs font-medium text-blue-100">{item.l}</div>
                                        <div className="flex-1 h-2 bg-blue-900/30 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: item.w }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-white">{item.w}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: FEATURES GRID --- */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Everything You Need to Scale</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { icon: FaGoogle, title: "Google Authority", desc: "Climb Maps rankings with a consistent stream of optimized/rich reviews." },
                            { icon: MessageSquare, title: "Automated Responses", desc: "Never leave a review unanswered. We help you manage replies." },
                            { icon: ShieldCheck, title: "Negative Filtering", desc: "Protect your brand. Catch unhappy customers before they post public reviews." },
                            { icon: BarChart3, title: "Analytics Dashboard", desc: "Track your growth with weekly reports on views, clicks, and calls." },
                            { icon: FaGlobe, title: "SEO Optimization", desc: "Reviews are indexed content. We optimize them for 'Near Me' searches." },
                            { icon: Zap, title: "Instant Setup", desc: "No complex integrations. We get your review engine running in 24 hours." },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-4">
                                    <feature.icon />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: HOW IT WORKS --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                        <div className="md:w-1/2">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Simple Process.</h2>
                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "Audit & Strategy", desc: "We analyze your profile and identify growth opportunities." },
                                    { step: "02", title: "Campaign Launch", desc: "We initiate outreach methods to your customer base." },
                                    { step: "03", title: "Watch You Grow", desc: "Sit back as ranking climbs and revenue increases." }
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="text-xl font-bold text-blue-100 w-10 text-right">{s.step}</div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 mb-1">{s.title}</h4>
                                            <p className="text-xs text-slate-500">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center relative shadow-inner">
                                <div className="absolute inset-4 border border-dashed border-slate-200 rounded-full animate-spin-slow" />
                                <FaChartLine className="text-5xl text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 6: FAQ --- */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Common Questions</h2>
                    <div className="space-y-3">
                        {[
                            { q: "Is this safe for my Google Profile?", a: "Absolutely. We strictly adhere to Google's guidelines. Our methods focus on generating genuine reviews." },
                            { q: "How fast will I see results?", a: "Most clients see their first new reviews coming in within 48-72 hours of launching the campaign." },
                            { q: "Do you handle negative reviews?", a: "Yes. Our system includes a 'feedback gate' that directs unhappy customers to a private feedback form." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-800 hover:bg-slate-50 transition-colors"
                                >
                                    {faq.q}
                                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4 text-xs text-slate-500"
                                        >
                                            {faq.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 7: FINAL CTA --- */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow?</h2>
                    <p className="text-slate-400 text-base mb-8">Stop losing customers to competitors. Build your reputation now.</p>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        size="lg"
                        className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 rounded-full shadow-lg"
                    >
                        Start Your Growth <FaRocket className="ml-2" />
                    </Button>
                </div>
            </section>

            {/* --- MODAL FORM --- */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white border-0 shadow-2xl rounded-xl">
                    <div className="bg-slate-900 p-5 text-white text-center">
                        <DialogTitle className="text-xl font-bold">Claim Your Spot</DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs mt-1">
                            Limited availability per city.
                        </DialogDescription>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-bold text-slate-600 uppercase">Full Name</Label>
                                <Input required name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-slate-600 uppercase">WhatsApp / Mobile</Label>
                                <Input required name="whatsappNumber" placeholder="+91 99999 99999" value={formData.whatsappNumber} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-bold text-slate-600 uppercase">Email Address</Label>
                                <Input required name="email" type="email" placeholder="you@company.com" value={formData.email} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-slate-600 uppercase">Business Name</Label>
                                <Input required name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-600 uppercase">Google / Website Link</Label>
                            <Input required name="mapsLink" placeholder="https://g.page/..." value={formData.mapsLink} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-bold text-slate-600 uppercase">Location</Label>
                                <Input required name="location" placeholder="City / Area" value={formData.location} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-slate-600 uppercase">Start Date</Label>
                                <Input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="h-9 text-sm bg-slate-50 border-slate-200" />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-bold text-slate-600 uppercase">Additional Message (Optional)</Label>
                            <Textarea name="message" placeholder="I want more reviews..." value={formData.message} onChange={handleInputChange} className="bg-slate-50 border-slate-200 text-sm resize-none" rows={2} />
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-lg text-sm mt-2">
                            {submitting ? "Processing..." : "Submit Application"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default GoogleReviewsMarketing;
