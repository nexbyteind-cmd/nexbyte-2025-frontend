import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    BookOpen, LayoutDashboard, GraduationCap, PlayCircle,
    CheckCircle2, BarChart2, LogOut, ExternalLink, Menu, X
} from "lucide-react";

interface LmsWorkspaceLayoutProps {
    children: React.ReactNode;
    userEmail?: string;
}

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/classes/dashboard" },
    { label: "My Learning", icon: GraduationCap, href: "/classes/dashboard?view=learning" },
    { label: "Continue Learning", icon: PlayCircle, href: "/classes/dashboard?view=continue" },
    { label: "Completed", icon: CheckCircle2, href: "/classes/dashboard?view=completed" },
    { label: "My Progress", icon: BarChart2, href: "/classes/dashboard?view=progress" },
];

const LmsWorkspaceLayout = ({ children, userEmail }: LmsWorkspaceLayoutProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("classes_token");
        navigate("/classes");
    };

    const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "L";

    const isActive = (href: string) => {
        const [path, qs] = href.split("?");
        const searchParams = new URLSearchParams(qs || "");
        const view = searchParams.get("view");
        const currentView = new URLSearchParams(location.search).get("view");

        if (location.pathname !== path) return false;
        if (!view && !currentView) return true;
        return view === currentView;
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-900 leading-none">NexByte Learning</div>
                    <div className="text-[10px] text-gray-400 font-medium tracking-widest mt-0.5">WORKSPACE</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 space-y-0.5">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                to={item.href}
                                onClick={() => setDrawerOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                    active
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                                }`}
                            >
                                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User + footer */}
            <div className="border-t border-gray-100 px-4 py-4 flex-shrink-0 space-y-2">
                {userEmail && (
                    <div className="flex items-center gap-2.5 px-1 py-1.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {avatarLetter}
                        </div>
                        <span className="text-xs text-gray-500 truncate flex-1">{userEmail}</span>
                    </div>
                )}
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Sign out
                </button>
                <a
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    Back to NexByteind.com
                </a>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-[#F6F7F9]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-gray-200 h-full">
                <SidebarContent />
            </aside>

            {/* Mobile drawer overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Mobile sidebar drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200 z-50 flex flex-col md:hidden transform transition-transform duration-200 ${
                    drawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    onClick={() => setDrawerOpen(false)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
                <SidebarContent />
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile topbar */}
                <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200 flex-shrink-0">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                            <BookOpen style={{ width: 13, height: 13, color: 'white' }} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">NexByte Learning</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {avatarLetter}
                    </div>
                </div>

                {/* Scrollable main content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default LmsWorkspaceLayout;
