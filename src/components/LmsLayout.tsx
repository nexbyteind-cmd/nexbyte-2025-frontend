import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, ExternalLink } from "lucide-react";

interface LmsLayoutProps {
    children: React.ReactNode;
    userEmail?: string;
    showSignOut?: boolean;
}

const LmsLayout = ({ children, userEmail, showSignOut = true }: LmsLayoutProps) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("classes_token");
        navigate("/classes");
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* LMS Workspace Header */}
            <header className="bg-white border-b border-gray-200 h-[64px] flex items-center flex-shrink-0 sticky top-0 z-50">
                <div className="w-full px-4 md:px-6 flex items-center justify-between">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-gray-900 text-sm tracking-tight">NexByte Learning</span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide">WORKSPACE</span>
                        </div>
                    </div>

                    {/* Right: Navigation */}
                    <div className="flex items-center gap-1 md:gap-3">
                        <a
                            href="/"
                            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100"
                        >
                            <ExternalLink className="w-3 h-3" />
                            NexByteind
                        </a>
                        {userEmail && (
                            <span className="hidden md:block text-xs text-gray-400 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md max-w-[160px] truncate">
                                {userEmail}
                            </span>
                        )}
                        {showSignOut && (
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 border border-gray-200 hover:border-red-200"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden sm:block">Sign Out</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default LmsLayout;
