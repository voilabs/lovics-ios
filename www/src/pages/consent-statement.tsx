import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { GetStaticPropsContext } from "next";

export default function ConsentStatement() {
    const t = useTranslations("ConsentStatement");

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
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <p className="mb-4">
                                        {t.rich("section1_text", {
                                            strong: (children) => (
                                                <strong>{children}</strong>
                                            ),
                                        })}
                                    </p>
                                    <ul className="space-y-2 mb-0 list-none pl-0">
                                        <li className="flex gap-3 items-start">
                                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2.5 shrink-0" />
                                            <span>{t("section1_list1")}</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2.5 shrink-0" />
                                            <span>{t("section1_list2")}</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2.5 shrink-0" />
                                            <span>{t("section1_list3")}</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        2
                                    </span>
                                    {t("section2_title")}
                                </h2>
                                <p className="mb-6">{t("section2_desc")}</p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                                            {t("section2_box1_title")}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {t("section2_box1_desc")}
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                                            {t("section2_box2_title")}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {t.rich("section2_box2_desc", {
                                                strong: (children) => (
                                                    <strong>{children}</strong>
                                                ),
                                            })}
                                        </p>
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
                                <div className="bg-orange-50 border-l-4 border-orange-200 p-6 rounded-r-xl">
                                    <h3 className="font-bold text-orange-900 mb-2">
                                        {t("section3_box_title")}
                                    </h3>
                                    <p className="text-orange-900/80 text-sm leading-relaxed mb-0">
                                        {t.rich("section3_box_desc", {
                                            strong: (children) => (
                                                <strong>{children}</strong>
                                            ),
                                        })}
                                    </p>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                                        4
                                    </span>
                                    {t("section4_title")}
                                </h2>
                                <ul className="space-y-4 list-none pl-0">
                                    <li className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
                                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2.5 shrink-0" />
                                        <span className="text-gray-700 text-sm">
                                            <strong>
                                                {t("section4_list1_label")}
                                            </strong>{" "}
                                            {t("section4_list1_text")}
                                        </span>
                                    </li>
                                    <li className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
                                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2.5 shrink-0" />
                                        <span className="text-gray-700 text-sm">
                                            <strong>
                                                {t("section4_list2_label")}
                                            </strong>{" "}
                                            {t("section4_list2_text")}
                                        </span>
                                    </li>
                                </ul>
                            </section>

                            <div className="mt-16 bg-gray-900 text-white p-8 rounded-3xl text-center shadow-xl shadow-gray-900/10">
                                <p className="text-lg md:text-xl font-medium leading-relaxed mb-0">
                                    {t("agreement_text")}
                                </p>
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
