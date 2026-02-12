import { BottomSheetContent } from "@/components/BottomSheetContent";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { useVault } from "@/context/vault";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BottomSheet, Button, Input, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { alert } from "@/lib/alert";

export default function SettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        data: vault,
        vaultId,
        refetch,
        password: currentPassword,
        lockVault,
    } = useVault();

    const [title, setTitle] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("folder");
    const [selectedColor, setSelectedColor] = useState("#9f27f5");
    const [selectedTheme, setSelectedTheme] = useState("default");
    const [isLoading, setIsLoading] = useState(false);

    // Bottom Sheet States
    const [isIconSheetOpen, setIsIconSheetOpen] = useState(false);
    const [isColorSheetOpen, setIsColorSheetOpen] = useState(false);
    const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
    const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

    // Password Change State
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (vault) {
            setTitle(vault.title);
            setSelectedIcon(vault.icon);
            setSelectedColor(vault.color);
            setSelectedTheme(vault.theme);
        }
    }, [vault]);

    const icons = [
        "folder",
        "heart",
        "star",
        "cloud",
        "moon",
        "sunny",
        "planet",
        "briefcase",
        "book",
        "game-controller",
        "musical-notes",
        "videocam",
        "camera",
        "map",
        "gift",
        "trophy",
        "wallet",
        "card",
    ];

    const colors = [
        "#9f27f5", // Purple
        "#f5275d", // Red
        "#f5a827", // Orange
        "#27f55d", // Green
        "#27d9f5", // Blue
        "#2727f5", // Indigo
        "#ef4444",
        "#f97316",
        "#eab308",
        "#84cc16",
        "#06b6d4",
        "#6366f1",
        "#ec4899",
    ];

    const themes = [
        {
            id: "default",
            name: t("vaultSettings.themeDefault"),
            color: "#f3f4f6",
        },
        { id: "dark", name: t("vaultSettings.themeDark"), color: "#1f2937" },
        {
            id: "nature",
            name: t("vaultSettings.themeNature"),
            color: "#dcfce7",
        },
        { id: "space", name: t("vaultSettings.themeSpace"), color: "#312e81" },
    ];

    const handleUpdateVault = async () => {
        try {
            setIsLoading(true);

            const response = await api
                .put(`/vaults/${vaultId}`, {
                    title,
                    icon: selectedIcon,
                    color: selectedColor,
                    theme: selectedTheme,
                })
                .then((response) => response.data)
                .catch((error) => error.response?.data);

            if (!response?.success) {
                alert(
                    t("common.error"),
                    response?.message || t("vaultSettings.updateError"),
                );
                return;
            }

            await refetch("vault");
            alert(t("common.success"), t("vaultSettings.successUpdated"));
        } catch (e) {
            console.error("Güncelleme hatası:", e);
            alert(t("common.error"), t("favorites.genericError"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteVault = () => {
        alert(
            t("vaultSettings.deleteTitle"),
            t("vaultSettings.deleteConfirm"),
            [
                {
                    text: t("common.cancel"),
                    variant: "secondary",
                    onPress: (setIsOpen) => setIsOpen(false),
                },
                {
                    text: t("vaultSettings.delete"),
                    variant: "danger-soft",
                    onPress: async (setIsOpen) => {
                        try {
                            setIsLoading(true);
                            const response = await api
                                .delete(`/vaults/${vaultId}`)
                                .then((res) => res.data)
                                .catch((err) => err.response?.data);

                            if (!response?.success) {
                                alert(
                                    t("common.error"),
                                    response?.message ||
                                        t("vaultSettings.deleteError"),
                                );
                                return;
                            }
                            setIsOpen(false);
                            router.replace("/(app)");
                        } catch (e) {
                            console.error("Silme hatası:", e);
                            alert(
                                t("common.error"),
                                t("favorites.genericError"),
                            );
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
        );
    };

    const ListItem = ({
        label,
        value,
        icon,
        iconColor,
        onPress,
        colorPreview,
    }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center h-14 px-4 bg-white border-b border-gray-100 last:border-0 active:bg-gray-50"
        >
            <View
                className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${!colorPreview ? "bg-gray-100" : ""}`}
                style={colorPreview ? { backgroundColor: colorPreview } : {}}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={18}
                        color={iconColor || "#374151"}
                    />
                )}
            </View>
            <Text className="flex-1 text-base text-gray-900">{label}</Text>
            {value && <Text className="mr-2 text-gray-500">{value}</Text>}
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
    );

    if (!vault) return null;

    return (
        <Container>
            <Header
                title={t("vaultSettings.title")}
                onBack={() => router.back()}
            />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Vault Preview */}
                <View className="items-center justify-center py-8">
                    <View
                        className="w-24 h-24 rounded-3xl items-center justify-center mb-4 shadow-sm"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <Ionicons
                            name={selectedIcon as any}
                            size={48}
                            color="white"
                        />
                    </View>
                    <TextField>
                        <Input
                            value={title}
                            onChangeText={setTitle}
                            className="text-center text-2xl font-bold text-gray-900 border-b-2 border-gray-100 w-64"
                            placeholder={t(
                                "vaultSettings.vaultNamePlaceholder",
                            )}
                        />
                    </TextField>
                </View>

                {/* Settings Sections */}
                <View className="px-4 gap-6">
                    {/* Appearance */}
                    <View>
                        <Text className="text-sm font-bold text-gray-500 uppercase mb-2 ml-1">
                            {t("vaultSettings.appearanceSection")}
                        </Text>
                        <View className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                            <ListItem
                                label={t("vaultSettings.iconLabel")}
                                icon={selectedIcon}
                                onPress={() => setIsIconSheetOpen(true)}
                            />
                            <ListItem
                                label={t("vaultSettings.colorLabel")}
                                colorPreview={selectedColor}
                                onPress={() => setIsColorSheetOpen(true)}
                            />
                            <ListItem
                                label={t("vaultSettings.themeLabel")}
                                value={
                                    themes.find((t) => t.id === selectedTheme)
                                        ?.name
                                }
                                icon="color-palette"
                                onPress={() => setIsThemeSheetOpen(true)}
                            />
                        </View>
                    </View>

                    {/* Actions */}
                    <Button
                        size="lg"
                        onPress={handleUpdateVault}
                        className="w-full shadow-sm mt-2"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <Button.Label className="text-white font-bold text-lg">
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                t("vaultSettings.saveButton")
                            )}
                        </Button.Label>
                    </Button>

                    <TouchableOpacity
                        onPress={handleDeleteVault}
                        className="w-full py-4 items-center justify-center mt-2 bg-red-50 rounded-2xl border border-red-100"
                    >
                        <Text className="text-red-500 font-semibold text-base">
                            {t("vaultSettings.deleteVaultButton")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Icon Picker Sheet */}
            <BottomSheet
                isOpen={isIconSheetOpen}
                onOpenChange={setIsIconSheetOpen}
            >
                <BottomSheet.Trigger />
                <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheetContent>
                        <BottomSheet.Title>
                            {t("vaultSettings.selectIconTitle")}
                        </BottomSheet.Title>
                        <ScrollView
                            className="max-h-80 mt-4"
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="flex-row flex-wrap gap-4 justify-center pb-8">
                                {icons.map((icon) => (
                                    <TouchableOpacity
                                        key={icon}
                                        onPress={() => {
                                            setSelectedIcon(icon);
                                            setIsIconSheetOpen(false);
                                        }}
                                        className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${selectedIcon === icon ? "border-accent bg-accent/10" : "border-gray-100 bg-gray-50"}`}
                                    >
                                        <Ionicons
                                            name={icon as any}
                                            size={28}
                                            color={
                                                selectedIcon === icon
                                                    ? selectedColor
                                                    : "#374151"
                                            }
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </BottomSheetContent>
                </BottomSheet.Portal>
            </BottomSheet>

            {/* Color Picker Sheet */}
            <BottomSheet
                isOpen={isColorSheetOpen}
                onOpenChange={setIsColorSheetOpen}
            >
                <BottomSheet.Trigger />
                <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheetContent>
                        <BottomSheet.Title>
                            {t("vaultSettings.selectColorTitle")}
                        </BottomSheet.Title>
                        <View className="flex-row flex-wrap gap-4 justify-center mt-4 pb-8">
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => {
                                        setSelectedColor(color);
                                        setIsColorSheetOpen(false);
                                    }}
                                    className={`w-12 h-12 rounded-full items-center justify-center ${selectedColor === color ? "ring-2 ring-offset-2 ring-black" : ""}`}
                                    style={{ backgroundColor: color }}
                                >
                                    {selectedColor === color && (
                                        <Ionicons
                                            name="checkmark"
                                            size={24}
                                            color="white"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BottomSheetContent>
                </BottomSheet.Portal>
            </BottomSheet>

            {/* Theme Picker Sheet */}
            <BottomSheet
                isOpen={isThemeSheetOpen}
                onOpenChange={setIsThemeSheetOpen}
            >
                <BottomSheet.Trigger />
                <BottomSheet.Portal>
                    <BottomSheet.Overlay />
                    <BottomSheetContent>
                        <BottomSheet.Title>
                            {t("vaultSettings.selectThemeTitle")}
                        </BottomSheet.Title>
                        <View className="flex-row justify-between mt-4 gap-2 pb-8">
                            {themes.map((theme) => (
                                <TouchableOpacity
                                    key={theme.id}
                                    onPress={() => {
                                        setSelectedTheme(theme.id);
                                        setIsThemeSheetOpen(false);
                                    }}
                                    className={`flex-1 items-center p-2 rounded-xl border-2 ${selectedTheme === theme.id ? "border-black bg-gray-50" : "border-transparent"}`}
                                >
                                    <View
                                        className="w-full h-16 rounded-lg mb-2"
                                        style={{ backgroundColor: theme.color }}
                                    />
                                    <Text className="text-xs font-medium">
                                        {theme.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BottomSheetContent>
                </BottomSheet.Portal>
            </BottomSheet>
        </Container>
    );
}
