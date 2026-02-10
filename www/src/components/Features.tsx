import { ShieldCheck, Lock, Globe, Key } from "lucide-react";
import { useTranslations } from "next-intl";

const Features = () => {
    const t = useTranslations("Features");
    const features = [
        {
            icon: <Lock className="w-8 h-8 text-gray-900" />,
            title: t("title_1"),
            description: t("desc_1"),
            visual: (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                    <div className="relative w-48 h-48 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                        <div className="absolute inset-0 bg-gray-50/50 rounded-2xl" />
                        <div className="relative bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <Lock className="w-10 h-10 text-purple-600" />
                        </div>
                        {/* Decorative UI Lines */}
                        <div className="absolute top-4 left-4 right-4 h-2 bg-gray-100 rounded-full" />
                        <div className="absolute top-8 left-4 right-12 h-2 bg-gray-100 rounded-full" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-purple-100 rounded-full" />
                    </div>
                </div>
            ),
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-gray-900" />,
            title: t("title_2"),
            description: t("desc_2"),
            visual: (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                    <div className="relative w-64 h-40 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 p-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-1 border border-green-100">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="w-32 h-2.5 bg-gray-100 rounded-full" />
                        <div className="w-24 h-2.5 bg-gray-100 rounded-full" />

                        <div className="absolute -right-3 -top-3 w-8 h-8 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: <Globe className="w-8 h-8 text-gray-900" />,
            title: t("title_3"),
            description: t("desc_3"),
            visual: (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="absolute inset-0 border border-gray-100 rounded-full" />
                        <div className="absolute inset-8 border border-gray-100 rounded-full" />
                        <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center relative z-10">
                            <Globe className="w-8 h-8 text-blue-600" />
                        </div>
                        {/* Floating elements */}
                        <div className="absolute top-2 right-10 w-10 h-10 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-purple-100" />
                        </div>
                        <div className="absolute bottom-4 left-8 w-8 h-8 bg-white border border-gray-100 rounded-full shadow-sm flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-blue-100" />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: <Key className="w-8 h-8 text-gray-900" />,
            title: t("title_4"),
            description: t("desc_4"),
            visual: (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                    <div className="relative flex items-center gap-4">
                        <div className="w-20 h-28 bg-white border border-gray-100 rounded-xl shadow-sm -rotate-3 flex flex-col p-3 gap-2">
                            <div className="w-full h-16 bg-gray-50 rounded-lg" />
                            <div className="w-10 h-2 bg-gray-100 rounded-full" />
                        </div>
                        <div className="w-20 h-28 bg-white border border-purple-100 rounded-xl shadow-md rotate-3 z-10 flex flex-col p-3 gap-2 items-center justify-center">
                            <Key className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-semibold text-purple-600 tracking-wider uppercase mb-3">
                        {t("label")}
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
                        {t("main_title_1")} <br className="hidden md:block" />
                        {t("main_title_2")}
                    </h3>
                    <p className="text-xl text-gray-500 leading-relaxed">
                        {t("main_desc")}
                    </p>
                </div>

                {/* Feature Grid - Mixed Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden ${
                                index === 1 || index === 2
                                    ? "md:col-span-2"
                                    : "md:col-span-1"
                            }`}
                        >
                            {/* Visual Area - Taller & Cleaner */}
                            <div className="h-80 w-full overflow-hidden">
                                {feature.visual}
                            </div>

                            {/* Content Area */}
                            <div className="px-10 pb-10 pt-6">
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
