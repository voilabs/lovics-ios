import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, Check } from "lucide-react";
import Link from "next/link";

const languages = [
    { code: "tr", name: "Türkçe", countryCode: "TR" },
    { code: "en", name: "English", countryCode: "US" },
];

export default function LanguageSelector() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentLang =
        languages.find((l) => l.code === router.locale) || languages[0];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 min-w-[160px] justify-between border cursor-pointer
                    ${
                        isOpen
                            ? "bg-white border-purple-200 ring-4 ring-purple-50/50 text-purple-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50/50 hover:text-gray-900"
                    }
                `}
            >
                <div className="flex items-center gap-1.5 opacity-90">
                    <span className="text-sm font-semibold leading-none tracking-tight">
                        {currentLang.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium leading-none opacity-60 ml-0.5">
                        ({currentLang.countryCode})
                    </span>
                </div>
                <ChevronUp
                    className={`w-3.5 h-3.5 text-gray-400 opacity-60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-full left-0 mb-2 min-w-[240px] bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden z-50 p-1.5"
                    >
                        {languages.map((lang) => {
                            const isActive = router.locale === lang.code;
                            return (
                                <Link
                                    key={lang.code}
                                    href={router.asPath}
                                    locale={lang.code}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-150 mb-0.5 last:mb-0
                                        ${
                                            isActive
                                                ? "bg-purple-50 text-purple-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    <span className="text-sm">{lang.name}</span>
                                    {isActive && (
                                        <Check className="w-3.5 h-3.5 text-purple-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
