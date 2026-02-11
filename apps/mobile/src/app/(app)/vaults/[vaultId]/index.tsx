import Container from "@/components/Container";
import { EncryptedImage } from "@/components/EncryptedImage";
import Header from "@/components/Header";
import { useVault } from "@/context/vault";
import { useContainer } from "@/hooks/use-container";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BottomSheet, Button, Input } from "heroui-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "@/lib/api";
import { Encrypter } from "@/lib/encrypter";
import { BottomSheetContent } from "@/components/BottomSheetContent";

export default function Page() {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        vaultId,
        data: vault,
        contents,
        refetch,
        isLoading,
        refreshing,
        setPassword,
        isMember,
        isPrimaryOwner,
        lockVault,
        getNextPageOfContents,
        hasMore,
        masterKey,
    } = useVault({ withContent: true });

    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const { paddingRight, paddingBottom } = useContainer({});

    // Password State
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

    // Favorite State
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

    // Fetch favorite status
    useEffect(() => {
        if (!vaultId) return;
        const checkFavorite = async () => {
            try {
                const res = await api.get("/favorites");
                if (res.data?.success) {
                    const favorites = res.data.data;
                    const isFav = favorites.some((f: any) => f.id === vaultId);
                    setIsFavorite(isFav);
                }
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setIsLoadingFavorite(false);
            }
        };
        checkFavorite();
    }, [vaultId]);

    const toggleFavorite = async () => {
        try {
            // Optimistic update
            const newStatus = !isFavorite;
            setIsFavorite(newStatus);

            const res = await api.post(`/favorites/${vaultId}`);
            if (!res.data?.success) {
                // Revert if failed
                setIsFavorite(!newStatus);
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            setIsFavorite(!isFavorite); // Revert
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword)
            return Alert.alert(
                t("common.error"),
                t("vaultDetail.errorPasswordEmpty"),
            );

        try {
            if (newPassword !== confirmPassword) {
                return Alert.alert(
                    t("common.error"),
                    t("vaultDetail.errorMismatch"),
                );
            }
            setIsChangingPassword(true);
            const unlocked = Encrypter.fromMasterKey(masterKey);

            if (!unlocked) throw new Error(t("vaultDetail.errorLocked"));

            const { newWrappedKey, newSalt } =
                unlocked.reWrapMasterKey(newPassword);

            const response = await api
                .put(`/vaults/${vaultId}/change-password`, {
                    encryptedVaultKey: newWrappedKey,
                    salt: newSalt,
                })
                .then((res) => res.data)
                .catch((err) => err.response?.data);

            if (!response?.success) {
                Alert.alert(
                    t("common.error"),
                    response?.message || t("vaultPassword.errorFailed"),
                );
                return;
            }

            Alert.alert(t("common.success"), t("vaultDetail.successUpdated"));
            setNewPassword("");
            lockVault();
        } catch (e) {
            console.error("Şifre değiştirme hatası:", e);
            Alert.alert(t("common.error"), t("favorites.genericError"));
        } finally {
            setIsChangingPassword(false);
            setIsPasswordSheetOpen(false);
        }
    };

    return (
        <Container>
            <Header
                title={vault?.title}
                onBack={() => router.back()}
                rightContent={
                    <View className="flex-row items-center gap-2">
                        {!isMember && (
                            <Button
                                onPress={toggleFavorite}
                                variant="ghost" // If this fails, will try 'ghost' or check other files.
                                isIconOnly
                                size="sm"
                                className="rounded-full"
                                isDisabled={isLoadingFavorite}
                            >
                                <Ionicons
                                    name={
                                        isFavorite ? "heart" : "heart-outline"
                                    }
                                    size={24}
                                    color={isFavorite ? "#ef4444" : "black"}
                                />
                            </Button>
                        )}
                        {isMember ? (
                            <BottomSheet
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                            >
                                <BottomSheet.Trigger asChild>
                                    <Button
                                        variant="secondary"
                                        isIconOnly
                                        size="sm"
                                        className="rounded-full"
                                        onPress={() => setIsOpen(true)}
                                    >
                                        <Ionicons
                                            name="ellipsis-horizontal"
                                            size={18}
                                            color="black"
                                        />
                                    </Button>
                                </BottomSheet.Trigger>
                                <BottomSheet.Portal>
                                    <BottomSheet.Overlay />
                                    <BottomSheetContent>
                                        <View className="flex-1 flex-row items-center justify-center">
                                            <BottomSheet.Title>
                                                {t("vaultDetail.optionsTitle")}
                                            </BottomSheet.Title>

                                            <BottomSheet.Close className="absolute right-0" />
                                        </View>
                                        <View className="flex-1 flex-col items-center gap-2 mt-4 justify-center">
                                            {isMember && (
                                                <>
                                                    {vault?.isEncrypted && (
                                                        <>
                                                            <TouchableOpacity
                                                                className="flex-row items-center justify-start gap-4 w-full bg-background-secondary rounded-xl p-4 text-sm"
                                                                onPress={() => {
                                                                    lockVault();
                                                                }}
                                                            >
                                                                <Ionicons
                                                                    name="lock-closed"
                                                                    size={20}
                                                                    color="black"
                                                                />
                                                                <Text className="text-base">
                                                                    {t(
                                                                        "vaultDetail.lockVault",
                                                                    )}
                                                                </Text>
                                                            </TouchableOpacity>

                                                            <BottomSheet
                                                                className="w-full"
                                                                isOpen={
                                                                    isPasswordSheetOpen
                                                                }
                                                                onOpenChange={
                                                                    setIsPasswordSheetOpen
                                                                }
                                                            >
                                                                <BottomSheet.Trigger
                                                                    asChild
                                                                    onPress={() => {
                                                                        setIsPasswordSheetOpen(
                                                                            true,
                                                                        );
                                                                        setCurrentPassword(
                                                                            "",
                                                                        );
                                                                        setNewPassword(
                                                                            "",
                                                                        );
                                                                        setConfirmPassword(
                                                                            "",
                                                                        );
                                                                        setIsOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    <TouchableOpacity className="flex-row items-center justify-start gap-4 w-full bg-background-secondary rounded-xl p-4 text-sm">
                                                                        <Ionicons
                                                                            name="key"
                                                                            size={
                                                                                20
                                                                            }
                                                                            color="black"
                                                                        />
                                                                        <Text className="text-base">
                                                                            {t(
                                                                                "vaultDetail.changePassword",
                                                                            )}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </BottomSheet.Trigger>
                                                                <BottomSheet.Portal>
                                                                    <BottomSheet.Overlay />
                                                                    <BottomSheetContent>
                                                                        <BottomSheet.Title>
                                                                            {t(
                                                                                "vaultDetail.setNewPasswordTitle",
                                                                            )}
                                                                        </BottomSheet.Title>
                                                                        <View className="mt-4 pb-8 flex-col gap-4">
                                                                            <Text className="text-red-400 bg-red-400/10 rounded-xl p-4">
                                                                                {t(
                                                                                    "vaultDetail.passwordChangeWarning",
                                                                                )}
                                                                            </Text>
                                                                            <View className="flex-col gap-2">
                                                                                <Input
                                                                                    placeholder={t(
                                                                                        "vaultDetail.currentPasswordPlaceholder",
                                                                                    )}
                                                                                    value={
                                                                                        currentPassword
                                                                                    }
                                                                                    onChangeText={
                                                                                        setCurrentPassword
                                                                                    }
                                                                                    secureTextEntry
                                                                                    variant="secondary"
                                                                                />
                                                                                <Input
                                                                                    placeholder={t(
                                                                                        "vaultDetail.newPasswordPlaceholder",
                                                                                    )}
                                                                                    value={
                                                                                        newPassword
                                                                                    }
                                                                                    onChangeText={
                                                                                        setNewPassword
                                                                                    }
                                                                                    secureTextEntry
                                                                                    variant="secondary"
                                                                                />
                                                                                <Input
                                                                                    placeholder={t(
                                                                                        "vaultDetail.confirmPasswordPlaceholder",
                                                                                    )}
                                                                                    value={
                                                                                        confirmPassword
                                                                                    }
                                                                                    onChangeText={
                                                                                        setConfirmPassword
                                                                                    }
                                                                                    secureTextEntry
                                                                                    variant="secondary"
                                                                                />
                                                                            </View>

                                                                            <Button
                                                                                size="lg"
                                                                                onPress={
                                                                                    handleChangePassword
                                                                                }
                                                                                isDisabled={
                                                                                    isChangingPassword
                                                                                }
                                                                            >
                                                                                <Button.Label className="text-white font-bold">
                                                                                    {isChangingPassword
                                                                                        ? t(
                                                                                              "vaultDetail.updating",
                                                                                          )
                                                                                        : t(
                                                                                              "vaultDetail.updatePasswordButton",
                                                                                          )}
                                                                                </Button.Label>
                                                                            </Button>
                                                                        </View>
                                                                    </BottomSheetContent>
                                                                </BottomSheet.Portal>
                                                            </BottomSheet>
                                                        </>
                                                    )}
                                                    {isPrimaryOwner && (
                                                        <>
                                                            <TouchableOpacity
                                                                className="flex-row items-center justify-start gap-4 w-full bg-background-secondary rounded-xl p-4 text-sm"
                                                                onPress={() => {
                                                                    setIsOpen(
                                                                        false,
                                                                    );
                                                                    router.push(
                                                                        `/(app)/vaults/${vaultId}/invite`,
                                                                    );
                                                                }}
                                                            >
                                                                <Ionicons
                                                                    name="person-add"
                                                                    size={20}
                                                                    color="black"
                                                                />
                                                                <Text className="text-base">
                                                                    {t(
                                                                        "vaultDetail.addMember",
                                                                    )}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                className="flex-row items-center justify-start gap-4 w-full bg-background-secondary rounded-xl p-4 text-sm"
                                                                onPress={() => {
                                                                    setIsOpen(
                                                                        false,
                                                                    );
                                                                    router.push(
                                                                        `/(app)/vaults/${vaultId}/settings`,
                                                                    );
                                                                }}
                                                            >
                                                                <Ionicons
                                                                    name="settings"
                                                                    size={20}
                                                                    color="black"
                                                                />
                                                                <Text className="text-base">
                                                                    {t(
                                                                        "vaultDetail.settings",
                                                                    )}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    </BottomSheetContent>
                                </BottomSheet.Portal>
                            </BottomSheet>
                        ) : null}
                    </View>
                }
            />

            <FlatList
                data={contents}
                keyExtractor={(item) => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: paddingBottom + 80 }}
                columnWrapperStyle={{ gap: 1 }}
                renderItem={({ item }) => {
                    let files = (item.thumbnails || []).slice(0, 4);
                    if (
                        files.length === 0 &&
                        item.mimeType?.startsWith("image/")
                    ) {
                        files = [
                            {
                                url: item.url,
                                path: item.path,
                                mimeType: item.mimeType,
                                iv: item.iv,
                            },
                        ];
                    }
                    return (
                        <TouchableOpacity
                            className="w-[33%] aspect-square mb-1"
                            onPress={() => {
                                router.push(
                                    `/(app)/vaults/${vaultId}/${item.id}`,
                                );
                            }}
                            activeOpacity={0.7}
                            style={{ flex: 1, margin: 0.5 }}
                        >
                            <View className="flex-1 rounded-xl overflow-hidden bg-gray-100 relative items-center justify-center border border-background-tertiary">
                                {files.length === 0 ? (
                                    <Ionicons
                                        name="image-outline"
                                        size={32}
                                        color="#9ca3af"
                                    />
                                ) : (
                                    <View className="flex-row flex-wrap w-full h-full">
                                        {files.map(
                                            (file: any, index: number) => {
                                                // Grid yerleşim mantığı (1-4 arası resim için)
                                                let width = "w-1/2";
                                                let height = "h-1/2";

                                                if (files.length === 1) {
                                                    width = "w-full";
                                                    height = "h-full";
                                                } else if (files.length === 2) {
                                                    width = "w-1/2";
                                                    height = "h-full";
                                                } else if (files.length === 3) {
                                                    if (index === 0) {
                                                        width = "w-full";
                                                        height = "h-1/2";
                                                    } else {
                                                        width = "w-1/2";
                                                        height = "h-1/2";
                                                    }
                                                }

                                                return (
                                                    <View
                                                        key={`${item.id}-${index}`}
                                                        className={`${width} ${height} p-px`}
                                                    >
                                                        <EncryptedImage
                                                            src={file.url}
                                                            mimeType={
                                                                file.mimeType
                                                            }
                                                            path={file.path}
                                                            ivHex={file.iv}
                                                            resizeMode="contain"
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                            }}
                                                        />
                                                    </View>
                                                );
                                            },
                                        )}
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
                onEndReached={() => {
                    if (hasMore) {
                        getNextPageOfContents();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="w-full py-10 items-center justify-center">
                            <Ionicons
                                name="albums-outline"
                                size={48}
                                color="#e5e7eb"
                            />
                            <Text className="text-gray-400 mt-2 text-center text-sm">
                                {t("vaultDetail.emptyTitle")}
                                {"\n"}
                                {t("vaultDetail.emptyDescription")}
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    hasMore ? (
                        <View className="py-4">
                            <ActivityIndicator
                                size="small"
                                color={vault?.color || "#6366f1"}
                            />
                        </View>
                    ) : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => refetch("contents")}
                        tintColor={vault?.color || "#6366f1"}
                    />
                }
            />

            {/* Floating Action Button */}
            <View
                className="absolute"
                style={{ bottom: paddingBottom, right: paddingRight }}
            >
                <TouchableOpacity
                    onPress={() =>
                        router.push(`/(app)/vaults/${vaultId}/upload`)
                    }
                    className="w-14 h-14 rounded-full shadow-lg items-center justify-center"
                    style={{ backgroundColor: vault?.color || "#6366f1" }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </Container>
    );
}
