import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const PhoneMockup = ({
    className = "",
    rotate = 0,
    delay = 0,
    imgSrc,
}: {
    className?: string;
    rotate?: number;
    delay?: number;
    imgSrc?: string;
}) => (
    <div
        className={`relative overflow-hidden w-[280px] h-[580px] bg-black rounded-[3rem] border-8 border-black transition-all duration-700 ease-out ${className}`}
        style={{
            transform: `rotate(${rotate}deg)`,
            transitionDelay: `${delay}ms`,
        }}
    >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-6 z-1 bg-black rounded-b-full"></div>
        {/* Screen Content */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {imgSrc ? (
                <img
                    src={imgSrc}
                    alt="App Screenshot"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                    <img
                        src="https://placehold.co/280x580"
                        className="w-full h-full object-cover"
                        alt=""
                    />
                </div>
            )}
        </div>
    </div>
);

const Hero = () => {
    const t = useTranslations("Hero");
    return (
        <section
            id="home"
            className="relative overflow-hidden bg-white m-2 h-[calc(100vh-1rem)] rounded-2xl"
        >
            <img
                src="/hero-gradient.jpg"
                alt="Hero Gradient"
                className="absolute top-0 left-0 w-full h-full object-cover z-10 mix-blend-normal opacity-50"
            />

            <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 h-full items-center">
                    {/* Left Column: Text */}
                    <div className="text-left flex flex-col justify-center order-2 lg:order-1">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-gray-900 mb-6 leading-[1.1]">
                            {t("title")} <br />
                            <span className="text-gray-900">
                                {t("subtitle1")}
                            </span>{" "}
                            <span className="italic font-serif text-purple-600 block mt-2">
                                {t("subtitle2")}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                            {t("description_part1")}{" "}
                            <span className="font-semibold text-gray-900">
                                {t("description_highlight")}
                            </span>{" "}
                            {t("description_part2")}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <Link
                                href="/download"
                                className="bg-gradient-to-br flex items-center gap-4 px-8 py-4 rounded-full from-purple-600 to-purple-800 text-white inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b border-zinc-950/35 shadow-md shadow-zinc-950/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95"
                            >
                                {t("cta")}
                                {/* <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> */}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: 3 Phone Mockups */}
                    <div className="hidden lg:flex justify-center items-center relative order-1 lg:order-2 perspective-[2000px]">
                        <div className="absolute left-0 -translate-x-12 z-10 opacity-90 scale-90">
                            <PhoneMockup
                                rotate={-10}
                                delay={100}
                                imgSrc="/in_app_1.jpg"
                            />
                        </div>

                        {/* Right Phone (45deg) */}
                        <div className="absolute right-0 translate-x-12 z-10 opacity-90 scale-90">
                            <PhoneMockup
                                rotate={10}
                                delay={200}
                                imgSrc="/in_app_3.jpg"
                            />
                        </div>

                        {/* Center Phone (0deg) */}
                        <div className="z-20 relative">
                            <PhoneMockup
                                rotate={0}
                                imgSrc="/in_app_2.jpg"
                                className="shadow-black shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
        </section>
    );
};

export default Hero;
