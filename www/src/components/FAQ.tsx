import { useTranslations } from "next-intl";

const FAQ = () => {
    const t = useTranslations("FAQ");
    const faqs = [
        {
            question: t("q1"),
            answer: t("a1"),
        },
        {
            question: t("q2"),
            answer: t("a2"),
        },
        {
            question: t("q3"),
            answer: t("a3"),
        },
        {
            question: t("q4"),
            answer: t("a4"),
        },
        {
            question: t("q5"),
            answer: t("a5"),
        },
        {
            question: t("q6"),
            answer: t("a6"),
        },
        {
            question: t("q7"),
            answer: t("a7"),
        },
        {
            question: t("q8"),
            answer: t("a8"),
        },
    ];

    return (
        <section id="faq" className="py-24 bg-white/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                    {t("title_part1")}{" "}
                    <span className="italic font-serif text-purple-600">
                        {t("title_highlight")}
                    </span>
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group border border-gray-200 rounded-2xl bg-white overflow-hidden open:border-purple-200 transition-colors"
                        >
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                <span className="font-medium text-gray-900">
                                    {faq.question}
                                </span>
                                <span className="transition group-open:rotate-180">
                                    <svg
                                        fill="none"
                                        height="24"
                                        shapeRendering="geometricPrecision"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                        width="24"
                                    >
                                        <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>
                            <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
