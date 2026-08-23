import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Code, Database, PlayCircle, Terminal, Mail, KeyRound, Loader2, Info } from "lucide-react";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClassesLogin = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setStep("otp");
            } else {
                setError(data.message || "Failed to request OTP. Please try again.");
            }
        } catch (err) {
            setError("Network error. Ensure the backend is running.");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/classes/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("classes_token", data.token);
                navigate("/classes/dashboard");
            } else {
                setError(data.message || "Invalid OTP.");
            }
        } catch (err) {
            setError("Network error.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
            <Navbar />
            
            {/* Floating Decorative Elements */}
            <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center opacity-70 animate-bounce" style={{ animationDuration: '4s' }}>
                <Code className="w-10 h-10 text-blue-400" />
            </div>
            <div className="absolute bottom-1/4 right-20 w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center opacity-70 animate-pulse" style={{ animationDuration: '6s' }}>
                <Database className="w-12 h-12 text-yellow-400" />
            </div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-50 rounded-full flex items-center justify-center opacity-60 animate-bounce" style={{ animationDuration: '5s' }}>
                <Terminal className="w-6 h-6 text-green-400" />
            </div>
            <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center opacity-60 animate-pulse" style={{ animationDuration: '7s' }}>
                <PlayCircle className="w-8 h-8 text-purple-400" />
            </div>

            <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 relative z-10">
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    
                    {/* Left side: Information/Branding */}
                    <div className="bg-blue-600 p-12 flex flex-col justify-center text-white relative overflow-hidden hidden md:flex">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Terminal className="w-32 h-32" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4 z-10">NexByte Classes</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-md z-10">
                            Access premium software engineering, backend architecture, and database mastery modules.
                        </p>
                        <div className="space-y-4 z-10">
                            <div className="flex items-center gap-3 text-blue-50">
                                <CheckCircleIcon /> Expert-led tech videos
                            </div>
                            <div className="flex items-center gap-3 text-blue-50">
                                <CheckCircleIcon /> Secure enterprise learning environment
                            </div>
                            <div className="flex items-center gap-3 text-blue-50">
                                <CheckCircleIcon /> Access restricted to approved learners
                            </div>
                        </div>
                    </div>

                    {/* Right side: Login Form */}
                    <div className="p-10 md:p-14 flex flex-col justify-center">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                            <p className="text-gray-500">Sign in to your learning workspace</p>
                        </div>

                        {step === "email" ? (
                            <form onSubmit={handleRequestOtp} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white text-gray-900"
                                            placeholder="developer@domain.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Access Code"}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Access Code (OTP)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white text-gray-900 tracking-widest font-mono text-lg"
                                            placeholder="123456"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                        <Info className="w-4 h-4" /> Sent to {email}
                                    </p>
                                </div>

                                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Enter Workspace"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep("email"); setError(""); }}
                                    className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    Use a different email
                                </button>
                            </form>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">
                                Need access? Contact your administrator at info@nexbyteind.com
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const CheckCircleIcon = () => (
    <svg className="w-5 h-5 text-blue-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export default ClassesLogin;
