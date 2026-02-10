import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

export default function ContentRemovalPolicy() {
    const t = useTranslations("ContentRemovalPolicy");

    return (
        <>
            <Head>
                <title>{t("title")} | Lovics</title>
                <meta name="description" content={t("meta_desc")} />
            </Head>
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-20">
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 py-2 px-4 rounded-full inline-block mb-6 border border-purple-100">
                                {t("badge")}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                                {t("main_title")}
                            </h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                {t("description")}
                            </p>
                        </div>

                        <div className="prose prose-lg prose-purple max-w-none text-gray-600">
                            <p className="lead text-xl text-gray-700 mb-12">
                                {t("lead")}
                            </p>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        1
                                    </span>
                                    {t("section1_title")}
                                </h2>
                                <p className="mb-4">{t("section1_desc")}</p>
                                <ul className="grid sm:grid-cols-2 gap-3 list-none pl-0">
                                    {[
                                        t.raw("section1_items")[0],
                                        t.raw("section1_items")[1],
                                        t.raw("section1_items")[2],
                                        t.raw("section1_items")[3],
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-gray-100"
                                        >
                                            <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />{" "}
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        2
                                    </span>
                                    {t("section2_title")}
                                </h2>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {t("section2_box1_title")}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {t("section2_box1_desc")}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {t("section2_box2_title")}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
                                            {t.raw("section2_tags")[0]}
                                        </span>
                                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100">
                                            {t.raw("section2_tags")[1]}
                                        </span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                                            {t.raw("section2_tags")[2]}
                                        </span>
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
                                <div className="bg-gray-900 text-white p-6 rounded-2xl border border-gray-800 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gray-800 rounded-lg">
                                            <svg
                                                className="w-6 h-6 text-green-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">
                                                {t("section3_box_title")}
                                            </h3>
                                            <p className="text-gray-400 text-xs text-opacity-80">
                                                {t("section3_box_desc")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-gray-800">
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-2">
                                                {t("section3_note_title")}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                {t.rich("section3_note_desc", {
                                                    strong: (children) => (
                                                        <span className="text-white font-bold">
                                                            {children}
                                                        </span>
                                                    ),
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500 italic">
                                            {t("section3_footer")}
                                        </div>
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
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {t("section4_box1_title")}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {t("section4_box1_desc")}
                                        </p>
                                        <a
                                            href="mailto:support@lovics.app"
                                            className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700"
                                        >
                                            support@lovics.app
                                            <span aria-hidden="true">
                                                &rarr;
                                            </span>
                                        </a>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                                            {t("section4_box2_title")}
                                        </h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {t("section4_box2_desc")}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                                <p>{t("footer_note")}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
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
