import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselProps {
    children: React.ReactNode[];
}

const Carousel = ({ children }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!children || children.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % children.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
    };

    return (
        <div className="container mx-auto px-4 relative max-w-7xl">
            <div className="relative overflow-hidden min-h-[380px] px-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex justify-center w-full"
                    >
                        {children[currentIndex]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {children.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg text-gray-700 hover:text-primary hover:scale-110 hover:bg-white transition-all z-20 hover:shadow-xl"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg text-gray-700 hover:text-primary hover:scale-110 hover:bg-white transition-all z-20 hover:shadow-xl"
                        aria-label="Next slide"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {children.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 rounded-full ${
                                    index === currentIndex
                                        ? 'bg-primary w-8 h-2'
                                        : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Carousel;
