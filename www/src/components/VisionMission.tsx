import { Target, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

const VisionMission = () => {
    const t = useTranslations("VisionMission");
    return (
        <section
            id="about"
            className="pt-24 pb-12 bg-white relative overflow-hidden"
        >
            {/* Decorative Background Element */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 -translate-y-1/2 opacity-60" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hakkımızda Section */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        {t("story_title")}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t("story_p1")}{" "}
                        <span className="font-semibold text-gray-900">
                            {t("story_highlight1")}
                        </span>{" "}
                        {t("story_p2")}{" "}
                        <span className="font-semibold text-gray-900">
                            {t("story_highlight2")}
                        </span>{" "}
                        {t("story_p3")}{" "}
                        <span className="italic font-serif text-purple-600 font-medium">
                            {t("story_highlight3")}
                        </span>
                    </p>
                </div>

                {/* Vision & Mission Cards */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Vizyon Card */}
                    <div className="p-8 rounded-3xl bg-gray-50">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {t("vision_title")}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {t("vision_p1")}{" "}
                            <span className="font-semibold text-gray-900">
                                {t("vision_highlight")}
                            </span>{" "}
                            {t("vision_p2")}
                        </p>
                    </div>

                    {/* Misyon Card */}
                    <div className="p-8 rounded-3xl bg-gray-50">
                        <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {t("mission_title")}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {t("mission_p1")}{" "}
                            <span className="font-semibold text-gray-900">
                                {t("mission_highlight")}
                            </span>{" "}
                            {t("mission_p2")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
