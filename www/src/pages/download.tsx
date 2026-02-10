import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

export default function DownloadPage() {
    const t = useTranslations("Download");

    return (
        <>
            <Head>
                <title>{t("title")} | Lovics</title>
                <meta name="description" content={t("meta_desc")} />
            </Head>

            <Navbar />

            <main className="min-h-screen bg-white pt-24 pb-12 px-2 sm:px-4">
                <div className="relative w-full container mx-auto bg-gray-50 rounded-[2.5rem] overflow-hidden min-h-[85vh] flex flex-col items-center justify-center text-center border border-gray-100">
                    {/* Background Gradient & Effects */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/hero-gradient.jpg"
                            alt="Background Gradient"
                            className="w-full h-full object-cover opacity-40 mix-blend-normal"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/80"></div>
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                    {/* Content */}
                    <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <span className="inline-block py-2 px-4 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-purple-700 font-medium text-sm mb-8 shadow-sm">
                            {t("badge")}
                        </span>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                            {t("main_title_1")} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                {t("main_title_highlight")}
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            {t("description")}
                        </p>

                        {/* Classic Store Badges with Custom SVGs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                            {/* App Store Badge - Black Button with White Icon */}
                            <Link
                                href="#"
                                className="group relative overflow-hidden flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/20 min-w-[200px] border border-transparent"
                            >
                                <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlSpace="preserve"
                                    width="814"
                                    height="1000"
                                    viewBox="0 0 814 1000"
                                    className="w-8 h-8 fill-current"
                                >
                                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                                </svg>
                                <div className="text-left flex flex-col">
                                    <span className="text-[0.6rem] font-medium leading-none mb-1 opacity-80">
                                        {t("app_store_label")}
                                    </span>
                                    <span className="text-xl font-bold leading-none tracking-wide">
                                        {t("app_store_title")}
                                    </span>
                                </div>
                            </Link>

                            {/* Google Play Badge - White Button with Colorful Icon */}
                            <Link
                                href="#"
                                className="group relative overflow-hidden flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50 min-w-[200px]"
                            >
                                <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-black/5 to-transparent z-10" />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    shapeRendering="geometricPrecision"
                                    textRendering="geometricPrecision"
                                    imageRendering="optimizeQuality"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    viewBox="0 0 466 511.98"
                                    className="w-8 h-8"
                                >
                                    <g id="Layer_x0020_1">
                                        <path
                                            fill="#EA4335"
                                            fillRule="nonzero"
                                            d="M199.9 237.8l-198.5 232.37c7.22,24.57 30.16,41.81 55.8,41.81 11.16,0 20.93,-2.79 29.3,-8.37l0 0 244.16 -139.46 -130.76 -126.35z"
                                        />
                                        <path
                                            fill="#FBBC04"
                                            fillRule="nonzero"
                                            d="M433.91 205.1l0 0 -104.65 -60 -111.61 110.22 113.01 108.83 104.64 -58.6c18.14,-9.77 30.7,-29.3 30.7,-50.23 -1.4,-20.93 -13.95,-40.46 -32.09,-50.22z"
                                        />
                                        <path
                                            fill="#34A853"
                                            fillRule="nonzero"
                                            d="M199.42 273.45l129.85 -128.35 -241.37 -136.73c-8.37,-5.58 -19.54,-8.37 -30.7,-8.37 -26.5,0 -50.22,18.14 -55.8,41.86 0,0 0,0 0,0l198.02 231.59z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            fillRule="nonzero"
                                            d="M1.39 41.86c-1.39,4.18 -1.39,9.77 -1.39,15.34l0 397.64c0,5.57 0,9.76 1.4,15.34l216.27 -214.86 -216.28 -213.46z"
                                        />
                                    </g>
                                </svg>
                                <div className="text-left flex flex-col">
                                    <span className="text-[0.6rem] font-medium leading-none mb-1 opacity-80 uppercase text-gray-500">
                                        {t("google_play_label")}
                                    </span>
                                    <span className="text-xl font-bold leading-none tracking-wide text-gray-900">
                                        {t("google_play_title")}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../messages/${locale}.json`)).default,
        },
    };
}
