import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import LanguageSelector from "./LanguageSelector";

const Footer = () => {
    const t = useTranslations("Footer");
    const router = useRouter();

    return (
        <footer className="bg-white pt-20 pb-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Pre-Footer CTA */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-pink-50 to-purple-50 p-12 md:p-20 text-center mb-24">
                    {/* Decorative Blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/50 rounded-full blur-[80px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/50 rounded-full blur-[80px] -z-10" />

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        {t("cta_title1")} <br />{" "}
                        <span className="italic font-serif text-purple-600">
                            {t("cta_highlight")}
                        </span>{" "}
                        {t("cta_title2")}
                    </h2>
                    <p className="text-gray-600 mb-10 max-w-xl mx-auto">
                        {t("cta_desc")}
                    </p>
                    <button className="bg-gradient-to-br flex items-center gap-4 px-8 py-4 rounded-full from-gray-900 to-black text-white inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b border-zinc-950/35 shadow-md shadow-zinc-950/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 mx-auto">
                        {t("cta_button")} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                lovics.
                            </span>
                        </Link>

                        {/* Language Switcher */}
                        <LanguageSelector />
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">
                            {t("resources")}
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li>
                                <Link
                                    href="https://github.com/voilabs/lovics"
                                    className="hover:text-purple-600 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t("open_source")}
                                </Link>
                            </li>
                            <li>
                                <div className="text-gray-400 transition-colors disabled">
                                    <span className="line-through">
                                        {t("mac")}
                                    </span>
                                    <span className="text-xs bg-purple-600 text-purple-50 px-3 py-1 rounded-full font-semibold ml-2">
                                        {t("coming_soon")}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div className="text-gray-400 transition-colors disabled">
                                    <span className="line-through">
                                        {t("windows")}
                                    </span>
                                    <span className="text-xs bg-purple-600 text-purple-50 px-3 py-1 rounded-full font-semibold ml-2">
                                        {t("coming_soon")}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <Link
                                    href="/download"
                                    className="hover:text-purple-600 transition-colors"
                                >
                                    {t("android")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/download"
                                    className="hover:text-purple-600 transition-colors"
                                >
                                    {t("ios")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">
                            {t("support")}
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li>
                                <Link
                                    href="/terms-of-use"
                                    className="hover:text-purple-600 transition-colors"
                                >
                                    {t("terms")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="hover:text-purple-600 transition-colors"
                                >
                                    {t("privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/content-removal-policy"
                                    className="hover:text-purple-600 transition-colors"
                                >
                                    {t("removal")}
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/consent-statement"
                                    className="hover:text-purple-600 transition-colors"
                                >
                                    {t("consent")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">
                            {t("contact")}
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li>support@lovics.app</li>
                            <li>{t("location")}</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Lovics. {t("rights")}
                    </p>
                    <div className="flex gap-6">{t("voilabs_product")}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
