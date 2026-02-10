import Container from "@/components/Container";
import { useAuthContext } from "@/context/auth-context";
import { VaultContextProvider } from "@/context/vault";
import { useContainer } from "@/hooks/use-container";
import { Ionicons } from "@expo/vector-icons";
import {
    Stack,
    useLocalSearchParams,
    usePathname,
    useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "heroui-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AppLayout() {
    const { vaultId } = useLocalSearchParams<{ vaultId: string }>();
    const backgroundColor = useThemeColor("background");
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
        useContainer({
            removeTopAndBottom: true,
            removeAutoFlex: true,
        });

    return (
        <VaultContextProvider vaultId={vaultId}>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor,
                    },
                }}
                initialRouteName="index"
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="password" />
                <Stack.Screen name="upload" />
                <Stack.Screen name="[itemId]/index" />
            </Stack>
        </VaultContextProvider>
    );
}

function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
        useContainer({});

    const items = [
        {
            name: "Anasayfa",
            icon: "home-outline",
            href: "/",
        },
        {
            name: "Ara",
            icon: "search-outline",
            href: "/search",
        },
        {
            name: "Geçmiş",
            icon: "time-outline",
            href: "/history",
        },
        {
            name: "Profil",
            icon: "person-outline",
            href: "/profile",
        },
    ];

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <View style={styles.navContainer}>
            <View style={styles.navBar}>
                <View
                    style={{
                        paddingLeft,
                        paddingRight,
                        paddingBottom,
                    }}
                    className="flex-row items-center justify-between flex-1"
                >
                    {items.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <TouchableOpacity
                                key={item.name}
                                activeOpacity={0.7}
                                style={[
                                    styles.navItem,
                                    active && styles.navItemActive,
                                ]}
                                onPress={() =>
                                    router.push(("/(app)" + item.href) as any)
                                }
                                className="flex-1 items-center justify-center"
                            >
                                <Ionicons
                                    name={
                                        (active
                                            ? item.icon.replace("-outline", "")
                                            : item.icon) as any
                                    }
                                    size={24}
                                    color={active ? "#6366f1" : "#9ca3af"}
                                />
                                {/* <Text
                                    style={
                                        active
                                            ? styles.navLabelActive
                                            : styles.navLabel
                                    }
                                    className="text-xs"
                                >
                                    {item.name}
                                </Text> */}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    navContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
    },
    navBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 15,
    },
    navItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        gap: 8,
    },
    navItemActive: {
        backgroundColor: "#e0e7ff", // indigo-50
    },
    navLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#9ca3af", // indigo-500
    },
    navLabelActive: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6366f1", // indigo-500
    },
});
