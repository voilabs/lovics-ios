import Container from "@/components/Container";
import Header from "@/components/Header";
import { useAuthContext } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Avatar, Button, cn } from "heroui-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const router = useRouter();

    const menuItems = [
        {
            title: t("profile.accountSection"),
            items: [
                {
                    icon: "settings-outline",
                    label: t("profile.settingsItem"),
                    onPress: () => {
                        router.push("/settings" as any);
                    },
                },
                {
                    icon: "log-out-outline",
                    label: t("profile.signOutItem"),
                    color: "red",
                    onPress: () => {
                        authClient.signOut();
                        router.replace("/");
                    },
                },
            ],
        },
        {
            title: t("profile.appSection"),
            items: [
                {
                    icon: "information-circle-outline",
                    label: t("profile.aboutItem"),
                    onPress: () => {
                        router.replace("/(app)/app-about");
                    },
                },
            ],
        },
    ];

    return (
        <Container>
            <Header subtitle={t("profile.subtitle")} />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* User Profile Section */}
                <View className="items-center justify-center mt-6 mb-8">
                    <Avatar alt={user?.name || ""} size="lg" className="mb-2">
                        <Avatar.Image src={user?.image as string} />
                        <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
                    </Avatar>
                    <Text className="text-2xl font-bold text-foreground">
                        {user?.name?.replace(":", " ")}
                    </Text>
                    <Text className="text-muted-foreground text-base mt-1">
                        {user?.email}
                    </Text>
                </View>

                <View className="flex flex-col gap-6">
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
                                            "flex-row items-center h-16 p-4",
                                            {
                                                "rounded-t-2xl rounded-b-lg":
                                                    isFirst && !isSingle,
                                                "rounded-lg":
                                                    isMiddle && !isSingle,
                                                "rounded-2xl": isSingle,
                                                "rounded-b-2xl rounded-t-lg":
                                                    isLast && !isSingle,
                                                "mb-1": !isLast,
                                                "text-red-400 border border-background-tertiary":
                                                    subItem.color === "red",
                                                "bg-white border border-background-tertiary":
                                                    subItem.color !== "red",
                                            },
                                        )}
                                        onPress={subItem.onPress}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            className={cn(
                                                "w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4",
                                                {
                                                    "bg-red-400/10":
                                                        subItem.color === "red",
                                                },
                                            )}
                                        >
                                            <Ionicons
                                                name={subItem.icon as any}
                                                size={20}
                                                color={
                                                    subItem.color === "red"
                                                        ? "#ef4444"
                                                        : "#374151"
                                                }
                                            />
                                        </View>
                                        <Text
                                            className={cn(
                                                "flex-1 text-base font-medium text-inherit",
                                                {
                                                    "text-red-400":
                                                        subItem.color === "red",
                                                },
                                            )}
                                        >
                                            {subItem.label}
                                        </Text>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color={
                                                subItem.color === "red"
                                                    ? "#ef4444"
                                                    : "#9ca3af"
                                            }
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
