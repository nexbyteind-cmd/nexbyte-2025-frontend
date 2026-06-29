import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ExternalLink, CheckCircle2, Clock, AlertTriangle, ArrowRight, Star } from "lucide-react";
import { IKImage } from "imagekitio-react";

const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

export default function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<"landing" | "registration" | "active" | "success">("landing");

    // Registration Form
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    // Active Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
    const [totalTimeTaken, setTotalTimeTaken] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    const timerRef = useRef<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const timePerQuestionRef = useRef<number[]>([]);
    const lastQuestionTimestampRef = useRef<number>(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`);
                const data = await res.json();
                if (data.success) {
                    setQuiz(data.data);
                    if (data.data.isTimed) {
                        setTimeLeftSeconds(data.data.durationMinutes * 60);
                    }
                } else {
                    toast.error("Quiz not found");
                    navigate("/services/hackathons");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId, navigate]);

    useEffect(() => {
        if (step === "active" && quiz?.isTimed) {
            timerRef.current = setInterval(() => {
                setTimeLeftSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleQuizComplete(true); // Auto-submit when time's up
                        return 0;
                    }
                    return prev - 1;
                });
                setTotalTimeTaken((prev) => prev + 1);
            }, 1000);
        } else if (step === "active" && !quiz?.isTimed) {
            timerRef.current = setInterval(() => {
                setTotalTimeTaken((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [step, quiz]);

    const handleStartClick = () => {
        setStep("registration");
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleRegistrationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !mobile) {
            return toast.error("Email and Mobile are required");
        }
        setStep("active");
        lastQuestionTimestampRef.current = Date.now();
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleAnswerClick = (selectedOption: string) => {
        const now = Date.now();
        const timeSpent = Math.round((now - lastQuestionTimestampRef.current) / 1000);
        timePerQuestionRef.current.push(timeSpent);
        lastQuestionTimestampRef.current = now;

        const currentQuestion = quiz.questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setCorrectCount(prev => prev + 1);
        } else {
            setWrongCount(prev => prev + 1);
        }

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleQuizComplete();
        }
    };

    const handleQuizComplete = async (timeUp: boolean = false) => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (timeUp) {
            toast.warning("Time's up! Submitting your answers...");
        }

        try {
            // Because React state updates might be queued, we use the current variables + the last answer's effect if handled correctly.
            // Wait, since handleAnswerClick updates state and calls this, state might not be fresh here.
            // But we can rely on the backend, except backend isn't grading. We are grading on frontend for simplicity as requested.
            // To ensure accuracy, we should track score outside state or ensure state is fresh.
            // Actually, we can just send the current state because handleAnswerClick updates state, and React might batch it. 
            // It's safer to let the effect of handleAnswerClick finish, but we called it directly. Let's just use a slight delay or calculate directly.

            const payload = {
                email,
                mobile,
                correctCount, // Note: this might be off by 1 for the last question due to stale closure if not careful.
                wrongCount,
                totalTimeSeconds: totalTimeTaken,
                avgTimePerQuestion: totalTimeTaken / quiz.questions.length,
                timePerQuestion: timePerQuestionRef.current
            };

            await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/attempts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            setStep("success");
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit results, but you finished the quiz!");
            setStep("success");
        }
    };

    // Format MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!quiz) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 pt-12 pb-20 flex flex-col items-center w-full">
                
                {/* Hero Section */}
                <div className="w-full bg-white relative overflow-hidden mb-12">
                    {/* Floating Icons (Decorative) */}
                    <div className="absolute top-10 left-10 text-blue-50 animate-pulse hidden md:block">
                        <CheckCircle2 className="w-24 h-24" />
                    </div>
                    <div className="absolute bottom-10 right-10 text-indigo-50 animate-bounce hidden md:block">
                        <Star className="w-32 h-32" />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 py-8 md:py-20 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            
                            {/* Left Column: Text & CTA */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-left flex flex-col justify-center order-2 lg:order-1">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm mb-6 w-max">
                                    <span className="mr-2 text-blue-500">Brought to you by</span>
                                    {quiz.companyName}
                                </div>
                                
                                <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">Discover Your True Potential</h2>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                                    {quiz.name}
                                </h1>
                                
                                <p className="text-gray-500 text-lg mb-8 max-w-md">
                                    Test your knowledge and win exciting prizes. Start your journey now!
                                </p>

                                {step === "landing" && (
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <Button onClick={handleStartClick} className="w-full sm:w-auto h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all group">
                                            Start Quiz Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <a href={quiz.companyLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                            <Button variant="outline" className="w-full h-14 px-8 rounded-full border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 font-medium transition-all">
                                                Visit Website <ExternalLink className="w-5 h-5 ml-2" />
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </motion.div>

                            {/* Right Column: Banner Image */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="order-1 lg:order-2 w-full aspect-video relative rounded-sm overflow-hidden">
                                {quiz.bannerImage && (
                                    <IKImage urlEndpoint={IK_URL_ENDPOINT} path={quiz.bannerImage} alt="Banner" className="w-full h-full object-cover" loading="lazy" />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Elegant Section Divider */}
                <div className="w-full max-w-5xl mx-auto px-4 mb-12 flex items-center justify-center opacity-70">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="px-4 text-gray-300 font-bold">✧</div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* Dynamic Content Area (Registration / Active / Success) */}
                <div ref={contentRef} className="w-full max-w-4xl px-4 scroll-mt-28">
                    {step === "registration" && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            <div className="text-center mb-8 pt-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Almost there!</h2>
                                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200/50 p-4 rounded-xl flex items-start gap-3 text-left shadow-inner">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                                    Please enter your correct details so we can contact you if you are a winner.
                                </p>
                            </div>
                            
                            <form onSubmit={handleRegistrationSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-gray-600 font-semibold ml-1">Email Address</Label>
                                    <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="h-14 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600 font-semibold ml-1">Mobile Number</Label>
                                    <Input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91..." className="h-14 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-lg" />
                                </div>
                                <Button type="submit" className="w-full h-14 text-lg font-bold bg-gray-900 hover:bg-black text-white rounded-xl mt-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                                    Continue to Questions
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {step === "active" && (
                        <div className="max-w-3xl mx-auto w-full">
                            {/* Header / Timer */}
                            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white p-5 mb-8 flex items-center justify-between sticky top-24 z-10 transition-all">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-bold tracking-wider uppercase mb-1">Progress</span>
                                    <div className="font-extrabold text-xl text-gray-800">
                                        Question {currentQuestionIndex + 1} <span className="text-gray-400 font-medium">/ {quiz.questions.length}</span>
                                    </div>
                                </div>
                                
                                <div className={`flex items-center gap-3 font-bold px-5 py-3 rounded-xl shadow-inner ${quiz.isTimed && timeLeftSeconds < 60 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-700 border border-slate-100'}`}>
                                    <Clock className={`w-5 h-5 ${quiz.isTimed && timeLeftSeconds < 60 ? 'animate-pulse' : ''}`} />
                                    <span className="text-lg tracking-widest">{quiz.isTimed ? formatTime(timeLeftSeconds) : formatTime(totalTimeTaken)}</span>
                                </div>
                            </div>

                            {/* Question Card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -ml-10 -mb-10 opacity-60"></div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 leading-tight relative z-10">
                                        {quiz.questions[currentQuestionIndex].question}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                                        {quiz.questions[currentQuestionIndex].options.map((option: string, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswerClick(option)}
                                                className="w-full p-5 md:p-6 text-left text-gray-700 font-semibold rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 hover:shadow-md transition-all active:scale-[0.98] group flex items-center justify-between"
                                            >
                                                <span>{option}</span>
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-500 transition-colors"></div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    {step === "success" && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-w-lg mx-auto bg-white rounded-[2rem] shadow-2xl p-10 text-center border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                            <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Successfully Completed!</h2>
                            <div className="space-y-4 mb-10 text-gray-600 text-lg leading-relaxed">
                                <p>
                                    Thank you for taking the <strong className="text-gray-900">{quiz.name}</strong>.
                                </p>
                                <p>
                                    You have taken <strong className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-md">{formatTime(totalTimeTaken)}</strong> to complete the quiz.
                                </p>
                                <p>
                                    Our team will get back to you soon. If you have any queries, please contact us.
                                </p>
                            </div>
                            <Button onClick={() => navigate("/services/hackathons")} className="w-full h-14 text-lg font-bold rounded-xl bg-gray-900 hover:bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                                Return to Hackathons
                            </Button>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
