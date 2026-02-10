import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ReactLenis } from "lenis/react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";

const outfit = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <main className={outfit.className}>
            <ReactLenis root />
            <NextIntlClientProvider
                locale={router.locale}
                timeZone="Europe/Istanbul"
                messages={pageProps.messages}
            >
                <Component {...pageProps} />
            </NextIntlClientProvider>
        </main>
    );
}
