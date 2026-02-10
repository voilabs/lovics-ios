import Header from "@/components/Header";
import { useAuthContext } from "@/context/auth-context";
import { useVaults } from "@/context/use-vaults";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, cn, SkeletonGroup } from "heroui-native";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Container from "@/components/Container";
import { VaultItem } from "@/components/VaultItem";

export default function Home() {
    const { t } = useTranslation();
    const { vaults, isLoading, error, refetch } = useVaults();
    const { user } = useAuthContext();

    return (
        <Container>
            <Header
                subtitle={t("home.welcomeBack", {
                    name: user?.name.replace(":", " "),
                })}
            />

            <View className="flex-1 flex flex-col gap-2">
                <View className="flex flex-row items-center justify-between gap-4">
                    <Text className="text-2xl font-bold">
                        {t("home.myVaults")}
                    </Text>
                    <Button
                        onPress={() => router.push("/new-vault")}
                        variant="secondary"
                        size="sm"
                    >
                        <Ionicons name="add" size={20} />
                        <Text className="text-base">{t("home.newVault")}</Text>
                    </Button>
                </View>
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
                        <View className="items-center gap-2">
                            <Text className="text-xl font-bold text-gray-900">
                                {t("home.errorTitle")}
                            </Text>
                            <Text className="text-gray-500 text-center px-4">
                                {typeof error === "string"
                                    ? error
                                    : (error as any)?.message ||
                                      JSON.stringify(error)}
                            </Text>
                        </View>
                        <Button
                            onPress={refetch}
                            variant="secondary"
                            className="px-8"
                        >
                            <Text className="font-semibold">
                                {t("home.retry")}
                            </Text>
                        </Button>
                    </View>
                ) : (
                    <FlatList
                        data={vaults}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <VaultItem
                                item={item}
                                position={
                                    index === 0
                                        ? "first"
                                        : index === vaults.length - 1
                                          ? "last"
                                          : "middle"
                                }
                            />
                        )}
                        onRefresh={() => refetch()}
                        refreshing={isLoading}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 2 }}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center gap-6 mb-6 p-6 bg-surface-secondary rounded-3xl border border-background-tertiary">
                                <View className="w-20 h-20 rounded-full bg-accent-soft text-accent items-center justify-center">
                                    <Ionicons name="alert-circle" size={40} />
                                </View>
                                <View className="items-center gap-2">
                                    <Text className="text-xl font-bold text-gray-900 text-center">
                                        {t("home.emptyTitle")}
                                    </Text>
                                    <Text className="text-gray-500 text-center px-4">
                                        {t("home.emptyDescription")}
                                    </Text>
                                </View>
                                <Button
                                    onPress={() => router.push("/new-vault")}
                                    variant="primary"
                                    className="px-8"
                                >
                                    <Text className="font-semibold">
                                        {t("home.createFirstVault")}
                                    </Text>
                                </Button>
                            </View>
                        }
                    />
                )}
            </View>
        </Container>
    );
}
