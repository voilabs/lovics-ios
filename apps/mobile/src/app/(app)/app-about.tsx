import Container from "@/components/Container";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cn } from "heroui-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Constants from "expo-constants";
// @ts-ignore
import splashScreen from "@/../assets/splashscreen.png";

export default function AppAboutScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const version = Constants.expoConfig?.version || "1.0.0";

    const links = [
        {
            label: t("appAbout.website"),
            url: "https://lovics.app",
            icon: "globe-outline",
        },
        {
            label: t("appAbout.privacyPolicy"),
            url: "https://lovics.app/privacy",
            icon: "lock-closed-outline",
        },
        {
            label: t("appAbout.termsOfUse"),
            url: "https://lovics.app/terms",
            icon: "document-text-outline",
        },
        // {
        //     label: "Lisanslar",
        //     url: "https://lovics.app/licenses",
        //     icon: "ribbon-outline",
        // },
    ];

    const handlePress = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <Container>
            <Header title={t("appAbout.title")} onBack={() => router.back()} />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center justify-center py-8">
                    <Image source={splashScreen} className="w-36 h-36" />
                    <Text className="text-2xl font-bold text-foreground">
                        {t("appAbout.appName")}
                    </Text>
                    <Text className="text-muted-foreground mt-1">
                        {t("appAbout.versionPrefix")} {version}
                    </Text>
                </View>

                <View className="flex flex-col gap-4 px-4">
                    {links.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-center h-14 bg-white border border-background-tertiary rounded-xl px-4"
                            onPress={() => handlePress(link.url)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={link.icon as any}
                                size={22}
                                color="#374151"
                                style={{ marginRight: 12 }}
                            />
                            <Text className="flex-1 text-base font-medium text-foreground">
                                {link.label}
                            </Text>
                            <Ionicons
                                name="open-outline"
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mt-8 px-8">
                    <Text className="text-center text-xs text-muted-foreground">
                        {t("appAbout.copyright", {
                            year: new Date().getFullYear(),
                        })}
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
}
