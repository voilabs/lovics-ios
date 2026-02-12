import { useTranslation } from "react-i18next";
import { KeyboardShifter } from "@/components/KeyboardShifter";
import { useAuthContext } from "@/context/auth-context";
import { useContainer } from "@/hooks/use-container";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "heroui-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function AppLayout() {
    const backgroundColor = useThemeColor("background");
    const { user } = useAuthContext();
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
        useContainer({
            removeTopAndBottom: true,
            removeAutoFlex: true,
        });

    return (
        <>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor,
                        marginBottom: 80,
                    },
                }}
                initialRouteName="index"
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="favorites" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="search" />
                <Stack.Screen name="new-vault" />
                <Stack.Screen name="app-about" />
                <Stack.Screen name="settings/index" />
                <Stack.Screen name="settings/account" />
                <Stack.Screen name="settings/security" />
                <Stack.Screen name="browser" />
            </Stack>
            <Navigation />
        </>
    );
}

function Navigation() {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const items = [
        {
            nameKey: "_layout.albums",
            icon: "albums-outline",
            activeIcon: "albums",
            href: "/",
        },
        {
            nameKey: "_layout.explore", // Kullanıcı isteği: Keşfet
            icon: "compass-outline",
            activeIcon: "compass",
            href: "/search",
        },
        {
            nameKey: "_layout.favorites",
            icon: "heart-outline",
            activeIcon: "heart",
            href: "/favorites",
        },
        {
            nameKey: "_layout.profile",
            icon: "person-outline",
            activeIcon: "person",
            href: "/profile",
        },
    ];

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <View
            className="absolute left-4 right-4 bg-background-secondary rounded-full flex-row items-center justify-between px-8 h-16 shadow-lg shadow-background-secondary/25 border border-background-tertiary"
            style={{ bottom: Math.max(insets.bottom, 24) }}
        >
            {items.map((item) => {
                const active = isActive(item.href);
                return (
                    <TouchableOpacity
                        key={item.href}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (active) return;
                            router.push(("/(app)" + item.href) as any);
                        }}
                        className="items-center justify-center gap-1"
                    >
                        <Ionicons
                            name={(active ? item.activeIcon : item.icon) as any}
                            size={24}
                            color={active ? "#000000" : "#6b7280"} // white vs gray-500
                        />
                        <Text
                            className={`text-[10px] font-medium ${
                                active ? "text-black" : "text-gray-500"
                            }`}
                        >
                            {t(item.nameKey)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
