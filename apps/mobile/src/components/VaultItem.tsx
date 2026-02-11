import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { cn } from "heroui-native";
import { Text, TouchableOpacity, View } from "react-native";

export type Vault = {
    id: string;
    title: string;
    mediaCount: number;
    year: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    iconColor: string;
    isEncrypted: boolean;
};

export const VaultItem = ({
    item,
    position,
}: {
    item: Vault;
    position: "first" | "last" | "middle" | "single";
}) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            className={cn(
                "flex-row items-center bg-white p-4 border border-background-tertiary h-24",
                {
                    "rounded-t-3xl rounded-b-xl": position === "first",
                    "rounded-b-3xl rounded-t-xl": position === "last",
                    "rounded-xl":
                        position === "middle" || position === "single",
                    "mb-1": position !== "last" && position !== "single",
                },
            )}
            activeOpacity={0.8}
            onPress={() => {
                if (item.isEncrypted) {
                    router.push(`/(app)/vaults/${item.id}/password` as any);
                } else {
                    router.push(`/(app)/vaults/${item.id}` as any);
                }
            }}
        >
            <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${item.color}`}
            >
                <Ionicons name={item.icon} size={24} color={item.iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                    {item.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">{item.year}</Text>
            </View>
            {item.isEncrypted && (
                <Ionicons name="lock-closed" size={16} color="#374151" />
            )}
        </TouchableOpacity>
    );
};
