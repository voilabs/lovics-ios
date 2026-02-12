import { api } from "@/lib/api";
import { Encrypter } from "@/lib/encrypter"; // Encrypter sınıfını import ettik
import { useRouter } from "expo-router";
import {
    Button,
    cn,
    Input,
    Switch,
    TextField,
    useThemeColor,
} from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { alert } from "@/lib/alert";

const COLORS = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#14B8A6", // Teal
];

const ICONS = [
    "folder",
    "lock-closed",
    "image",
    "document-text",
    "briefcase",
    "heart",
    "star",
    "cloud",
    "shield",
    "key",
];

const themes = ["default", "dark", "nature", "space"];

export default function NewVaultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const primaryColor = useThemeColor("accent");

    const [title, setTitle] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(themes[0]);

    // YENİ: Kasa Şifresi State'leri
    const [vaultPassword, setVaultPassword] = useState("");
    const [confirmVaultPassword, setConfirmVaultPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) {
            return alert(t("common.error"), t("newVault.errorNameRequired"));
        }

        // Şifre kontrolü
        if (isEncrypted) {
            if (vaultPassword.length < 6) {
                return alert(
                    t("common.error"),
                    t("newVault.errorPasswordLength"),
                );
            }
            if (vaultPassword !== confirmVaultPassword) {
                return alert(
                    t("common.error"),
                    t("newVault.errorPasswordMismatch"),
                );
            }
        }

        setIsLoading(true);
        try {
            let encryptedVaultKey: string | undefined;
            let salt: string | undefined;

            // 1. Eğer şifreliyse, Encrypter ile anahtarları üret
            if (isEncrypted) {
                // Yeni bir Encrypter başlat (Salt otomatik üretilir)
                const encrypter = new Encrypter(vaultPassword);

                // Master Key oluştur ve şifrele
                const { wrappedKey } = encrypter.generateMasterKey();

                // Verileri hazırla
                encryptedVaultKey = wrappedKey;
                salt = encrypter.getSalt()!;
            }

            // 2. Sunucuya gönder
            const res = await api.post("/vaults", {
                title: title.trim(),
                icon: selectedIcon,
                color: selectedColor,
                theme: selectedTheme,
                isEncrypted,

                // Şifreli veri alanları (create-vault.ts bu alanları bekliyor)
                encryptedVaultKey,
                salt,
            });

            if (res.data?.success) {
                router.replace("/(app)");
            }
        } catch (error: any) {
            console.error(error);
            const msg =
                error.response?.data?.message || t("newVault.createError");
            alert(t("common.error"), msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Header title={t("newVault.title")} onBack={() => router.back()} />

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Önizleme */}
                <View className="items-center my-6">
                    <View
                        className="w-24 h-24 rounded-3xl items-center justify-center mb-2 shadow-lg"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <Ionicons
                            name={selectedIcon as any}
                            size={40}
                            color="white"
                        />
                    </View>
                    <Text className="font-bold text-xl text-foreground">
                        {title || t("newVault.vaultNameLabel")}
                    </Text>
                </View>

                {/* Form */}
                <View className="flex-col gap-6">
                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("newVault.vaultNameLabel")}
                        </Text>
                        <TextField>
                            <Input
                                placeholder={t("newVault.vaultNamePlaceholder")}
                                value={title}
                                onChangeText={setTitle}
                                variant="secondary"
                            />
                        </TextField>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("newVault.colorLabel")}
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="py-2"
                        >
                            <View className="flex-row gap-3 px-1">
                                {COLORS.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full ${selectedColor === color ? "border-2 border-foreground" : ""}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("newVault.iconLabel")}
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="py-2"
                        >
                            <View className="flex-row gap-3 px-1">
                                {ICONS.map((icon) => (
                                    <TouchableOpacity
                                        key={icon}
                                        onPress={() => setSelectedIcon(icon)}
                                        className={`w-10 h-10 rounded-xl items-center justify-center bg-content2 ${selectedIcon === icon ? "border-2 border-primary bg-primary/10" : ""}`}
                                    >
                                        <Ionicons
                                            name={icon as any}
                                            size={20}
                                            color={
                                                selectedIcon === icon
                                                    ? primaryColor
                                                    : "#666"
                                            }
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("newVault.themeLabel")}
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="py-2"
                        >
                            <View className="flex-row gap-3 px-1">
                                {themes.map((theme) => (
                                    <TouchableOpacity
                                        key={theme}
                                        onPress={() => setSelectedTheme(theme)}
                                        className={cn(
                                            `w-36 aspect-square rounded-xl items-center justify-center bg-background-secondary`,
                                            {
                                                "border-2 border-accent":
                                                    selectedTheme === theme,
                                                "bg-gray-900": theme === "dark",
                                                "bg-green-100":
                                                    theme === "nature",
                                                "bg-indigo-900":
                                                    theme === "space",
                                                "bg-gray-100":
                                                    theme === "light",
                                            },
                                        )}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <View className="bg-background-secondary p-4 rounded-xl flex-row items-center justify-between">
                        <View className="flex-1 mr-4">
                            <View className="flex-row items-center gap-2">
                                <Ionicons
                                    name="shield-checkmark"
                                    size={18}
                                    color={isEncrypted ? primaryColor : "#666"}
                                />
                                <Text className="font-bold text-lg text-foreground">
                                    {t("newVault.encryptionTitle")}
                                </Text>
                            </View>
                            <Text className="text-sm text-muted mt-1">
                                {t("newVault.encryptionDescription")}
                            </Text>
                        </View>
                        <Switch
                            isSelected={isEncrypted}
                            onSelectedChange={setIsEncrypted}
                        />
                    </View>

                    {/* Şifreleme Alanları (Sadece isEncrypted ise göster) */}
                    {isEncrypted && (
                        <View className="bg-background-secondary p-4 rounded-xl flex-col gap-4 border border-foreground/5">
                            <View>
                                <Text className="font-medium ml-1 text-foreground mb-2">
                                    {t("newVault.vaultPasswordLabel")}
                                </Text>
                                <TextField>
                                    <Input
                                        placeholder={t(
                                            "newVault.vaultPasswordPlaceholder",
                                        )}
                                        value={vaultPassword}
                                        onChangeText={setVaultPassword}
                                        secureTextEntry
                                    />
                                </TextField>
                            </View>
                            <View>
                                <Text className="font-medium ml-1 text-foreground mb-2">
                                    {t("newVault.confirmPasswordLabel")}
                                </Text>
                                <TextField>
                                    <Input
                                        placeholder={t(
                                            "newVault.confirmPasswordPlaceholder",
                                        )}
                                        value={confirmVaultPassword}
                                        onChangeText={setConfirmVaultPassword}
                                        secureTextEntry
                                    />
                                </TextField>
                            </View>
                            <Text className="text-xs text-orange-500 font-medium">
                                {t("newVault.encryptionWarning")}
                            </Text>
                        </View>
                    )}

                    <Button
                        onPress={handleCreate}
                        size="lg"
                        className="mt-4"
                        isDisabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {t("newVault.createButton")}
                            </Text>
                        )}
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}
