import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Navbar = () => {
    const t = useTranslations("Navbar");
    return (
        <nav className="absolute top-4 w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
                    {/* Logo (Left) */}
                    <div className="flex items-center justify-start">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                lovics.
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu (Center) */}
                    <div className="hidden md:flex items-center justify-center space-x-8">
                        <Link
                            href="/#home"
                            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            {t("home")}
                        </Link>
                        <Link
                            href="/#about"
                            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            {t("about")}
                        </Link>
                        <Link
                            href="/#faq"
                            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            {t("faq")}
                        </Link>
                    </div>

                    {/* Buttons (Right) */}
                    <div className="flex items-center justify-end space-x-4"></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
