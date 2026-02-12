import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function PrivacyPolicy() {
    const t = useTranslations("PrivacyPolicy");
    const searchParams = useSearchParams();

    const isInApp = useMemo(() => {
        return searchParams.get("in_app") === "true";
    }, [searchParams]);

    return (
        <>
            <Head>
                <title>{t("title")} | Lovics</title>
                <meta name="description" content={`Lovics ${t("title")}`} />
            </Head>
            <main className="min-h-screen bg-white">
                {!isInApp && <Navbar />}
                <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-20">
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 py-2 px-4 rounded-full inline-block mb-6 border border-purple-100">
                                {t("last_updated")}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                                {t("title")}
                            </h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                {t("subtitle")}
                            </p>
                        </div>

                        <div className="prose prose-lg prose-purple max-w-none text-gray-600">
                            <p className="lead text-xl text-gray-700 mb-12">
                                {t("intro_lead")}
                            </p>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        1
                                    </span>
                                    {t("section1_title")}
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                            {t("section1_subtitle1")}
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            {(
                                                t.raw(
                                                    "section1_list1",
                                                ) as string[]
                                            ).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            {t("section1_subtitle2")}
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            {(
                                                t.raw(
                                                    "section1_list2",
                                                ) as string[]
                                            ).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 italic text-center">
                                    {t("section1_note")}
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        2
                                    </span>
                                    {t("section2_title")}
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {t("section2_subtitle1")}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {t("section2_desc1")}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {(
                                                    t.raw(
                                                        "section2_tags1",
                                                    ) as string[]
                                                ).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="hidden md:block w-px bg-gray-100 self-stretch"></div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {t("section2_subtitle2")}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {t("section2_desc2")}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {(
                                                    t.raw(
                                                        "section2_tags2",
                                                    ) as string[]
                                                ).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-green-50 text-green-700 border border-green-100 text-xs rounded-md"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        3
                                    </span>
                                    {t("section3_title")}
                                </h2>
                                <ul className="grid sm:grid-cols-2 gap-3 list-none pl-0">
                                    {(t.raw("section3_list") as string[]).map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-700 text-sm"
                                            >
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />{" "}
                                                {item}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        4
                                    </span>
                                    {t("section4_title")}
                                </h2>
                                <p className="mb-6">
                                    {t("section4_text")}{" "}
                                    <strong>{t("section4_highlight")}</strong>{" "}
                                    {t("section4_text2")}
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-200 p-4 rounded-r-xl">
                                    <h3 className="font-bold text-yellow-900 mb-1">
                                        {t("section4_box_title")}
                                    </h3>
                                    <p className="text-yellow-800 text-sm">
                                        {t("section4_box_text")}
                                    </p>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        5
                                    </span>
                                    {t("section5_title")}
                                </h2>
                                <p className="mb-4">{t("section5_text")}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(t.raw("section5_list") as string[]).map(
                                        (right, i) => (
                                            <span
                                                key={i}
                                                className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                                            >
                                                {right}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </section>

                            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                                <p className="text-gray-500 mb-2">
                                    {t("contact_text")}
                                </p>
                                <a
                                    href="mailto:kvkk@lovics.app"
                                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
                                >
                                    kvkk@lovics.app
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {!isInApp && <Footer />}
            </main>
        </>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            messages: (await import(`../../messages/${locale}.json`)).default,
        },
    };
}
