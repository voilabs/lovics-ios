import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function TermsOfUse() {
    const t = useTranslations("TermsOfUse");
    return (
        <>
            <Head>
                <title>{t("title")} | Lovics</title>
                <meta name="description" content={`Lovics ${t("title")}`} />
            </Head>
            <main className="min-h-screen bg-white">
                <Navbar />
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

                        {/* Content */}
                        <div className="prose prose-lg prose-purple max-w-none text-gray-600">
                            <p className="lead text-xl text-gray-700 mb-8">
                                {t("intro_lead")}
                            </p>
                            <p className="mb-12">{t("intro_text")}</p>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        1
                                    </span>
                                    {t("section1_title")}
                                </h2>
                                <p className="mb-4">{t("section1_text")}</p>
                                <ul className="space-y-3 mb-6 list-none pl-0">
                                    {(t.raw("section1_list") as string[]).map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                                <p className="text-gray-500 italic text-sm border-l-4 border-gray-200 pl-4">
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
                                <ul className="space-y-4 list-none pl-0">
                                    {(t.raw("section2_list") as string[]).map(
                                        (item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5 border border-gray-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                </div>
                                                <span>{item}</span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        3
                                    </span>
                                    {t("section3_title")}
                                </h2>

                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                                            {t("section3_subtitle1")}
                                        </h3>
                                        <ul className="space-y-2 text-sm">
                                            {(
                                                t.raw(
                                                    "section3_list1",
                                                ) as string[]
                                            ).map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex gap-2"
                                                >
                                                    <span className="text-purple-600">
                                                        •
                                                    </span>{" "}
                                                    {item.replace("• ", "")}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-gray-900 text-white p-6 rounded-2xl border border-gray-800">
                                        <h3 className="text-lg font-bold text-white mb-3">
                                            {t("section3_subtitle2")}
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            {(
                                                t.raw(
                                                    "section3_list2",
                                                ) as string[]
                                            ).map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex gap-2"
                                                >
                                                    <span className="text-green-400">
                                                        •
                                                    </span>{" "}
                                                    {item.replace("• ", "")}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        4
                                    </span>
                                    {t("section4_title")}
                                </h2>

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 ml-11">
                                        {t("section4_subtitle1")}
                                    </h3>
                                    <p className="ml-11 mb-2">
                                        {t("section4_text1")}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 ml-11">
                                        {t("section4_subtitle2")}
                                    </h3>
                                    <div className="bg-orange-50 border-l-4 border-orange-200 p-4 ml-11 rounded-r-xl">
                                        <p className="text-orange-900 font-medium mb-2">
                                            {t("section4_box_title")}
                                        </p>
                                        <ul className="space-y-2 text-orange-800 text-sm list-disc pl-4">
                                            {(
                                                t.raw(
                                                    "section4_box_list",
                                                ) as string[]
                                            ).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
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
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {(t.raw("section5_list") as string[]).map(
                                        (item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg text-red-700 font-medium text-sm"
                                            >
                                                <span className="text-red-500">
                                                    ✕
                                                </span>{" "}
                                                {item}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        6
                                    </span>
                                    {t("section6_title")}
                                </h2>
                                <p className="mb-6">{t("section6_text")}</p>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        {t("section6_box_title")}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {t("section6_box_text")}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(
                                            t.raw("section6_tags") as string[]
                                        ).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-xs text-gray-500">
                                        {t("section6_note")}
                                    </p>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        7
                                    </span>
                                    {t("section7_title")}
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {t("section7_subtitle1")}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t("section7_text1")}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {t("section7_subtitle2")}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t("section7_text2")}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">
                                            {t("section7_subtitle3")}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {t("section7_text3")}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                                <p className="text-gray-500 mb-2">
                                    {t("contact_text")}
                                </p>
                                <a
                                    href="mailto:support@lovics.app"
                                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
                                >
                                    support@lovics.app
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
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
