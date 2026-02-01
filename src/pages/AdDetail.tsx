import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config";
import { IKContext, IKImage } from "imagekitio-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ExternalLink,
    Calendar,
    Info,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Linkedin,
    Youtube,
    MessageCircle,
    Users,

} from "lucide-react";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;


const AdDetail = () => {
    const { slug } = useParams();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/news/ads/${slug}`);
                const data = await res.json();
                if (data.success) setAd(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchAd();
    }, [slug]);

    useEffect(() => {
        if (!ad?.images || ad.images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((p) => (p + 1) % ad.images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [ad]);

    if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
    if (!ad) return <div className="min-h-screen grid place-items-center">Ad not found</div>;

    // --- THEME CONFIGURATION ---
    const THEMES: any = {
        "palette-1": {
            name: "Gold & Dark",
            accent: "text-amber-500",
            bgAccent: "bg-amber-500",
            bgAccentLight: "bg-amber-500/10",
            borderAccent: "border-amber-500",
            buttonText: "text-black",
            hoverText: "hover:text-amber-500",
            ring: "ring-amber-500",
        },
        "palette-2": {
            name: "Blue & Clean",
            accent: "text-sky-500",
            bgAccent: "bg-sky-500",
            bgAccentLight: "bg-sky-500/10",
            borderAccent: "border-sky-500",
            buttonText: "text-white",
            hoverText: "hover:text-sky-500",
            ring: "ring-sky-500",
        },
        "palette-3": {
            name: "Vibrant & Modern",
            accent: "text-pink-500",
            bgAccent: "bg-pink-500",
            bgAccentLight: "bg-pink-500/10",
            borderAccent: "border-pink-500",
            buttonText: "text-white",
            hoverText: "hover:text-pink-500",
            ring: "ring-pink-500",
        },
    };

    const theme = THEMES[ad.colorPalette] || THEMES["palette-1"];
    const isLight = ad.themeMode === "light";
    const bgMain = isLight ? "bg-white" : "bg-zinc-950";
    const textMain = isLight ? "text-zinc-900" : "text-zinc-200";
    const cardBg = isLight ? "bg-white border-zinc-200 shadow-lg" : "bg-zinc-900 border-zinc-800 shadow-xl";
    const mutedText = isLight ? "text-zinc-500" : "text-zinc-400";
    const navText = isLight ? "bg-white/80 border-b border-zinc-200 text-black" : "bg-zinc-900 border-b border-zinc-800 text-white"; // Assuming Navbar handles its own transparency, but we can wrap it or pass props. For now, we adjust container.
    const heroBg = isLight ? "bg-zinc-50 border-b border-zinc-200" : "bg-zinc-900 border-b border-zinc-800";

    return (
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey}>
            <div className={`min-h-screen ${bgMain} ${textMain}`}>
                <Navbar />

                {/* ================= HERO ================= */}
                <header className={`pt-32 pb-20 px-4 ${heroBg}`}>
                    <div className="container mx-auto">
                        <Link
                            to="/ads-listing"
                            className="inline-flex items-center text-sm opacity-70 mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Listings
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            {/* LEFT */}
                            <div className="space-y-6">
                                <span className={`inline-block px-3 py-1 text-xs border ${theme.borderAccent} ${theme.accent} rounded-full`}>
                                    {ad.category}
                                </span>

                                <h1 className="text-4xl md:text-6xl font-extrabold">
                                    {ad.title}
                                </h1>

                                <p className={`text-xl opacity-80 ${mutedText}`}>
                                    {ad.shortDescription}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {ad.externalLinks?.map((l: any, i: number) => (
                                        <a key={i} href={l.url} target="_blank">
                                            <Button className={`${theme.bgAccent} ${theme.buttonText} font-bold hover:opacity-90`}>
                                                {l.label}
                                                <ExternalLink className="ml-2 w-4 h-4" />
                                            </Button>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="space-y-4">
                                {/* HOT NEWS */}
                                {ad.hotNews && (
                                    <div className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center animate-pulse">
                                        {ad.hotNews}
                                    </div>
                                )}

                                {/* IMAGE */}
                                <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentImageIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <IKImage
                                                path={ad.images?.[currentImageIndex]}
                                                className="w-full h-full object-contain"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ================= META / CONTACT / LOCATION ================= */}
                <section className="container mx-auto px-4 -mt-16 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* POSTED + CATEGORY */}
                        <div className={`${cardBg} rounded-2xl p-6 space-y-5 transition-colors`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${theme.bgAccentLight} flex items-center justify-center`}>
                                    <Calendar className={`w-6 h-6 ${theme.accent}`} />
                                </div>
                                <div>
                                    <p className={`text-sm ${mutedText}`}>Posted On</p>
                                    <p className={`text-lg font-semibold ${isLight ? 'text-black' : 'text-white'}`}>
                                        {new Date(ad.postedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${theme.bgAccentLight} flex items-center justify-center`}>
                                    <Info className={`w-6 h-6 ${theme.accent}`} />
                                </div>
                                <div>
                                    <p className={`text-sm ${mutedText}`}>Category</p>
                                    <p className={`text-lg font-semibold ${isLight ? 'text-black' : 'text-white'}`}>
                                        {ad.category}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {ad.contactDetails?.communityLink && (
                                    <a href={ad.contactDetails.communityLink} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className={`w-full ${isLight ? 'border-zinc-300' : 'border-zinc-700'} hover:bg-zinc-100 dark:hover:bg-zinc-800`}>
                                            <Users className="w-5 h-5 mr-2" />
                                            Join Community
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* CONTACT CARD */}
                        <div className={`${cardBg} rounded-2xl p-6 space-y-6 transition-colors`}>
                            <h3 className={`text-lg font-semibold ${isLight ? 'text-black' : 'text-white'}`}>Contact</h3>

                            {/* Phone & Telephone - Side by Side */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {ad.contactDetails?.phone && (
                                    <a href={`tel:${ad.contactDetails.phone}`} className={`flex-1 flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-zinc-100 hover:bg-zinc-200' : 'bg-zinc-800 hover:bg-zinc-700'} transition-colors`}>
                                        <div className={`p-2 rounded-full ${theme.bgAccentLight}`}>
                                            <Phone className={`w-4 h-4 ${theme.accent}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs opacity-70">Phone</span>
                                            <span className="font-medium text-sm">{ad.contactDetails.phone}</span>
                                        </div>
                                    </a>
                                )}

                                {ad.contactDetails?.telephone && (
                                    <a href={`tel:${ad.contactDetails.telephone}`} className={`flex-1 flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-zinc-100 hover:bg-zinc-200' : 'bg-zinc-800 hover:bg-zinc-700'} transition-colors`}>
                                        <div className={`p-2 rounded-full ${theme.bgAccentLight}`}>
                                            <Phone className={`w-4 h-4 ${theme.accent}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs opacity-70">Telephone</span>
                                            <span className="font-medium text-sm">{ad.contactDetails.telephone}</span>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Email - Full Width Row */}
                            {ad.contactDetails?.email && (
                                <a href={`mailto:${ad.contactDetails.email}`} className={`w-full flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-zinc-100 hover:bg-zinc-200' : 'bg-zinc-800 hover:bg-zinc-700'} transition-colors`}>
                                    <div className={`p-2 rounded-full ${theme.bgAccentLight}`}>
                                        <Mail className={`w-4 h-4 ${theme.accent}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs opacity-70">Email</span>
                                        <span className="font-medium text-sm">{ad.contactDetails.email}</span>
                                    </div>
                                </a>
                            )}



                            {/* WhatsApp & Community Buttons */}
                            <div className="grid grid-cols-1 gap-3">
                                {ad.contactDetails?.whatsapp && (
                                    <a href={ad.contactDetails.whatsapp.includes('chat.whatsapp.com') ? ad.contactDetails.whatsapp : `https://wa.me/${ad.contactDetails.whatsapp}`} target="_blank" rel="noreferrer">
                                        <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold">
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            Chat on WhatsApp
                                        </Button>
                                    </a>
                                )}

                            </div>
                        </div>

                        {/* LOCATION CARD */}
                        <div className={`${cardBg} rounded-2xl p-6 space-y-4 transition-colors`}>
                            <h3 className={`text-lg font-semibold ${isLight ? 'text-black' : 'text-white'}`}>Location</h3>

                            {ad.contactDetails?.address ? (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <MapPin className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        <p className={`text-sm leading-relaxed ${mutedText}`}>
                                            {ad.contactDetails.address}
                                        </p>
                                    </div>

                                    {ad.contactDetails?.mapLink && (
                                        <a href={ad.contactDetails.mapLink} target="_blank" rel="noreferrer" className="block">
                                            <Button variant="outline" className={`w-full ${isLight ? 'border-zinc-300 hover:bg-zinc-100 text-zinc-700' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'}`}>
                                                <ExternalLink className="mr-2 w-4 h-4" />
                                                Get Directions
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className={`text-sm italic ${mutedText}`}>No location details available.</p>
                            )}

                            {/* Social Icons */}
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-5">
                                    Follow us on social media
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {ad.socialLinks?.facebook && (
                                        <a href={ad.socialLinks.facebook} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${theme.bgAccentLight} transition-colors group`}>
                                            <Facebook className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        </a>
                                    )}
                                    {ad.socialLinks?.twitter && (
                                        <a href={ad.socialLinks.twitter} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${theme.bgAccentLight} transition-colors group`}>
                                            <Twitter className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        </a>
                                    )}
                                    {ad.socialLinks?.instagram && (
                                        <a href={ad.socialLinks.instagram} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${theme.bgAccentLight} transition-colors group`}>
                                            <Instagram className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        </a>
                                    )}
                                    {ad.socialLinks?.whatsapp && (
                                        <a href={ad.socialLinks.whatsapp} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${theme.bgAccentLight} transition-colors group`}>
                                            <MessageCircle className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        </a>
                                    )}
                                    {ad.socialLinks?.linkedin && (
                                        <a href={ad.socialLinks.linkedin} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${theme.bgAccentLight} transition-colors group`}>
                                            <Linkedin className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        </a>
                                    )}
                                    {ad.socialLinks?.youtube && (
                                        <a href={ad.socialLinks.youtube} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${theme.bgAccentLight} transition-colors group`}>
                                            <Youtube className={`w-5 h-5 mt-0.5 ${theme.accent} shrink-0`} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ================= CONTENT ================= */}
                <main className="container mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold mb-6">About This Offer</h2>
                        <div className="whitespace-pre-wrap opacity-80">
                            {ad.description}
                        </div>
                    </div>
                    <div className={`${cardBg} rounded-2xl p-6 h-fit sticky top-24`}>
                        <h3 className="text-xl font-bold mb-4">Key Highlights</h3>
                        <ul className="space-y-3">
                            {ad.highlights?.map((h: string, i: number) => (
                                <li key={i} className="flex gap-3">
                                    <CheckCircle className={`w-4 h-4 ${theme.accent} mt-1`} />
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>

                {/* ================= IMAGE GALLERY ================= */}
                {ad.images?.length > 1 && (
                    <section className="container mx-auto px-4 pb-24 space-y-8">

                        <h2 className="text-3xl font-bold text-center">
                            Image Gallery
                        </h2>

                        {/* ===== DESKTOP GRID ===== */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {ad.images.map((img: string, i: number) => (
                                <div
                                    key={i}
                                    className="aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 hover:shadow-2xl transition"
                                >
                                    <IKImage
                                        path={img}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ===== MOBILE SLIDER ===== */}
                        <div className="md:hidden relative">

                            {/* IMAGE */}
                            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mobileIndex}
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IKImage
                                            path={ad.images[mobileIndex]}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* LEFT BUTTON */}
                            <button
                                onClick={() =>
                                    setMobileIndex(
                                        mobileIndex === 0 ? ad.images.length - 1 : mobileIndex - 1
                                    )
                                }
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full"
                            >
                                ‹
                            </button>

                            {/* RIGHT BUTTON */}
                            <button
                                onClick={() =>
                                    setMobileIndex((mobileIndex + 1) % ad.images.length)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full"
                            >
                                ›
                            </button>

                            {/* DOTS */}
                            <div className="flex justify-center gap-2 mt-4">
                                {ad.images.map((_: any, i: number) => (
                                    <span
                                        key={i}
                                        onClick={() => setMobileIndex(i)}
                                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === mobileIndex ? `${theme.bgAccent} w-6` : "bg-zinc-600"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                    </section>
                )}


                <Footer />
            </div>
        </IKContext>
    );
};

export default AdDetail;
