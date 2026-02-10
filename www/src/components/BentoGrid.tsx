import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

const BentoGrid = () => {
    const t = useTranslations("BentoGrid");
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                {/* Large Left Card - Vertical */}
                <div className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-3xl">
                    <Image
                        src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070"
                        alt={t("alt_city")}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                        <h3 className="text-white text-xl font-bold mb-1">
                            {t("public_collections")}
                        </h3>
                        <p className="text-gray-200 text-sm">
                            {t("public_desc")}
                        </p>
                    </div>
                </div>

                {/* Top Right Card - Horizontal */}
                <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl min-h-[250px] md:min-h-0">
                    <Image
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2072"
                        alt={t("alt_nature")}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                            <ArrowUpRight className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-1">
                            {t("encrypted_memories")}
                        </h3>
                        <p className="text-gray-200 text-sm">
                            {t("encrypted_desc")}
                        </p>
                    </div>
                </div>

                {/* Bottom Right Card 1 - Text/Link */}
                <div className="md:col-span-1 md:row-span-1 bg-purple-50 rounded-3xl p-8 flex flex-col justify-between group hover:bg-purple-100 transition-colors">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {t("private_vault")}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {t("private_desc")}
                        </p>
                    </div>
                    <Link
                        href="#"
                        className="text-purple-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                        {t("learn_more")} <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Bottom Right Card 2 - Image */}
                <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl min-h-[200px] md:min-h-0">
                    <Image
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2152"
                        alt={t("alt_portrait")}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl">
                        <p className="text-xs font-semibold text-gray-800">
                            {t("testimonial")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
