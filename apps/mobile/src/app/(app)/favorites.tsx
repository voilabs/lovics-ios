import Container from "@/components/Container";
import Header from "@/components/Header";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { Button, SkeletonGroup } from "heroui-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import { VaultItem, type Vault } from "@/components/VaultItem";

export default function Favorites() {
    const { t } = useTranslation();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFavorites = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get("/favorites");
            if (res.data?.success) {
                setFavorites(res.data.data);
            } else {
                setError(t("favorites.fetchError"));
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || t("favorites.genericError"));
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, []),
    );

    return (
        <Container>
            <Header subtitle={t("favorites.subtitle")} />

            <View className="flex-1">
                {isLoading ? (
                    <SkeletonGroup>
                        <SkeletonGroup.Item className="w-full h-24 rounded-t-3xl rounded-b-xl mb-1" />
                        <SkeletonGroup.Item className="w-full h-24 rounded-xl mb-1" />
                        <SkeletonGroup.Item className="w-full h-24 rounded-xl mb-1" />
                        <SkeletonGroup.Item className="w-full h-24 rounded-b-3xl rounded-t-xl" />
                    </SkeletonGroup>
                ) : error ? (
                    <View className="flex-1 items-center justify-center gap-6 mb-6 p-6 bg-red-400/5 rounded-3xl border border-red-400/20">
                        <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center">
                            <Ionicons
                                name="alert-circle"
                                size={40}
                                color="#ef4444"
                            />
                        </View>
                        <Text className="text-lg font-medium text-gray-900 text-center">
                            {error}
                        </Text>
                        <Button
                            onPress={fetchFavorites}
                            variant="secondary"
                            className="px-8"
                        >
                            <Text className="font-semibold">
                                {t("favorites.retry")}
                            </Text>
                        </Button>
                    </View>
                ) : (
                    <FlatList
                        data={favorites}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <VaultItem
                                item={item}
                                position={
                                    favorites.length === 1
                                        ? "single"
                                        : index === 0
                                          ? "first"
                                          : index === favorites.length - 1
                                            ? "last"
                                            : "middle"
                                }
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center gap-6 mb-6 p-6 bg-surface-secondary rounded-3xl border border-surface-tertiary mt-4">
                                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
                                    <Ionicons
                                        name="heart-outline"
                                        size={40}
                                        color="#9ca3af"
                                    />
                                </View>
                                <View className="items-center gap-2">
                                    <Text className="text-xl font-bold text-gray-900 text-center">
                                        {t("favorites.emptyTitle")}
                                    </Text>
                                    <Text className="text-gray-500 text-center px-4">
                                        {t("favorites.emptyDescription")}
                                    </Text>
                                </View>
                                <Button
                                    onPress={() => router.push("/(app)")}
                                    variant="primary"
                                    className="px-8"
                                >
                                    <Text className="font-semibold px-4 text-white">
                                        {t("favorites.exploreVaults")}
                                    </Text>
                                </Button>
                            </View>
                        }
                        refreshing={isLoading}
                        onRefresh={fetchFavorites}
                    />
                )}
            </View>
        </Container>
    );
}
