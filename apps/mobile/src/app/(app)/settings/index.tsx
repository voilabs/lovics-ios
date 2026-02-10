import Container from "@/components/Container";
import Header from "@/components/Header";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cn } from "heroui-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const menuItems = [
        {
            title: t("settingsIndex.generalSection"),
            items: [
                {
                    icon: "person-outline",
                    label: t("settingsIndex.accountInfoItem"),
                    onPress: () => router.push("/settings/account"),
                },
                {
                    icon: "shield-checkmark-outline",
                    label: t("settingsIndex.securityItem"),
                    onPress: () => router.push("/settings/security"),
                },
            ],
        },
    ];

    return (
        <Container>
            <Header
                title={t("settingsIndex.title")}
                onBack={() => router.back()}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex flex-col gap-6 mt-4">
                    {menuItems.map((item, index) => (
                        <View key={index} className="space-y-3">
                            <Text className="text-lg font-bold mb-2 ml-1">
                                {item.title}
                            </Text>
                            {item.items.map((subItem, subIndex) => {
                                const isFirst =
                                    item.items.length > 1 && subIndex === 0;
                                const isLast =
                                    item.items.length > 1 &&
                                    subIndex === item.items.length - 1;
                                const isMiddle = !isFirst && !isLast;
                                const isSingle = item.items.length === 1;
                                return (
                                    <TouchableOpacity
                                        key={subIndex}
                                        className={cn(
                                            "flex-row items-center h-16 p-4 border border-background-tertiary",
                                            {
                                                "rounded-t-2xl rounded-b-lg":
                                                    isFirst && !isSingle,
                                                "rounded-lg":
                                                    isMiddle && !isSingle,
                                                "rounded-2xl": isSingle,
                                                "rounded-b-2xl rounded-t-lg":
                                                    isLast && !isSingle,
                                                "mb-1": !isLast,
                                            },
                                        )}
                                        onPress={subItem.onPress}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            className={cn(
                                                "w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4",
                                            )}
                                        >
                                            <Ionicons
                                                name={subItem.icon as any}
                                                size={20}
                                                color={"#374151"}
                                            />
                                        </View>
                                        <Text
                                            className={cn(
                                                "flex-1 text-base font-medium text-inherit",
                                            )}
                                        >
                                            {subItem.label}
                                        </Text>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color={"#9ca3af"}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
}
