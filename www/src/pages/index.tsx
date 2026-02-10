import Head from "next/head";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import VisionMission from "@/components/VisionMission";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <>
            <Head>
                <title>{t("title")}</title>
                <meta name="description" content={t("description")} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen bg-white flex flex-col gap-24 md:gap-32 tracking-tight text-gray-900">
                <Navbar />
                <Hero />
                <BentoGrid />
                <VisionMission />
                <Features />
                <FAQ />
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
