import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Loader2, ArrowRight, Check, BookOpen, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/config";

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
                setError(data.message || "Failed to request OTP. Please check your email and try again.");
            }
        } catch {
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
                setError(data.message || "Invalid OTP. Please try again.");
            }
        } catch {
            setError("Network error.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Minimal header */}
            <header className="h-[64px] border-b border-gray-100 flex items-center px-6 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-gray-900 text-sm tracking-tight">NexByte Learning</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide">WORKSPACE</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <a href="/" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                        <ExternalLink className="w-3 h-3" /> Back to NexByteind
                    </a>
                </div>
            </header>

            {/* Main: two-column login */}
            <div className="flex-1 flex">
                {/* Left panel */}
                <div className="hidden lg:flex flex-col justify-between bg-[#0f172a] text-white w-[420px] flex-shrink-0 p-12 relative overflow-hidden">
                    {/* Background texture */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }} />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Approved Access Only
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                            Your Learning<br />Workspace
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Access premium software engineering modules, backend architecture deep-dives, and expert-led video courses.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        {[
                            "Expert-led technical video courses",
                            "Progress tracking across all modules",
                            "Secure, invite-only access",
                            "Class discussion and Q&A"
                        ].map(item => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-blue-400" />
                                </div>
                                <span className="text-slate-400 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: form */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-sm">
                        {step === "email" ? (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
                                    <p className="text-gray-500 text-sm">Enter your approved email to receive a one-time access code.</p>
                                </div>

                                <form onSubmit={handleRequestOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 transition-all"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>Send Access Code <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </form>

                                <p className="text-center text-xs text-gray-400 mt-6">
                                    Need access?{" "}
                                    <a href="mailto:info@nexbyteind.com" className="text-blue-600 hover:underline">
                                        Contact your administrator
                                    </a>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <KeyRound className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter access code</h2>
                                    <p className="text-gray-500 text-sm">
                                        We sent a 6-digit code to <strong className="text-gray-700">{email}</strong>
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Access code</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900 font-mono tracking-[0.3em] text-center text-xl transition-all"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Enter Workspace"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setStep("email"); setError(""); }}
                                        className="w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors py-2"
                                    >
                                        ← Use a different email
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassesLogin;
