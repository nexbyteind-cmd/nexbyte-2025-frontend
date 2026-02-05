import { Sparkles } from "lucide-react";
import { FaPython, FaDatabase } from "react-icons/fa";
import { SiOracle, SiMysql, SiPostgresql } from "react-icons/si";

export interface CategoryTheme {
    icon: any;
    gradient: string;
    tagline: string;
    textColor: string;
    accentColor: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
    "All": {
        icon: Sparkles,
        gradient: "from-slate-900 via-purple-900 to-slate-900",
        tagline: "Explore the latest in technology and database management",
        textColor: "text-purple-400",
        accentColor: "bg-purple-500"
    },
    "Python": {
        icon: FaPython,
        gradient: "from-blue-900 via-green-900 to-blue-900",
        tagline: "Master the language of data and possibilities",
        textColor: "text-green-400",
        accentColor: "bg-green-500"
    },
    "ORACLE DBA": {
        icon: SiOracle,
        gradient: "from-red-900 via-orange-900 to-red-900",
        tagline: "High-performance enterprise database solutions",
        textColor: "text-orange-400",
        accentColor: "bg-orange-500"
    },
    "SQL SERVER DBA": {
        icon: FaDatabase,
        gradient: "from-slate-900 via-red-900 to-slate-900",
        tagline: "Powering mission-critical applications",
        textColor: "text-red-400",
        accentColor: "bg-red-500"
    },
    "MY SQL": {
        icon: SiMysql,
        gradient: "from-blue-900 via-cyan-900 to-blue-900",
        tagline: "The world's most popular open-source database",
        textColor: "text-cyan-400",
        accentColor: "bg-cyan-500"
    },
    "POSTGRESS": {
        icon: SiPostgresql,
        gradient: "from-slate-900 via-blue-900 to-slate-900",
        tagline: "The world's most advanced open source relational database",
        textColor: "text-blue-400",
        accentColor: "bg-blue-500"
    }
};
