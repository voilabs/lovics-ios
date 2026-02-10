import Container from "@/components/Container";
import Header from "@/components/Header";
import { useVault } from "@/context/vault";
import { Encrypter } from "@/lib/encrypter";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Input, TextField } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PasswordScreen() {
    const { t } = useTranslation();
    const [passwordInput, setPasswordInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    const { vaultId, setMasterKey, data: vault } = useVault();

    const handleUnlock = async () => {
        if (!passwordInput) return;
        setError(null);
        setIsLoading(true);

        try {
            const targetKey = vault.encryptedVaultKey || vault.wrappedKey;

            if (!targetKey) {
                throw new Error(t("vaultPassword.errorKeyNotFound"));
            }

            const encrypter = new Encrypter(passwordInput, vault.salt);
            const isUnlocked = encrypter.unlockVault(targetKey);

            if (!isUnlocked) {
                throw new Error(t("vaultPassword.errorWrongPassword"));
            }

            const rawMasterKey = encrypter.getRawMasterKey();
            setMasterKey(rawMasterKey);

            router.replace(`/(app)/vaults/${vaultId}` as any);
        } catch (err: any) {
            console.error("Unlock Error:", err);
            setError(err.message || t("vaultPassword.errorFailed"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Header onBack={() => router.back()} />
            <View className="flex-1 justify-center">
                <View className="items-center mb-10">
                    <View
                        className="w-24 h-24 rounded-4xl items-center justify-center mb-6"
                        style={{ backgroundColor: `${vault.color}20` }}
                    >
                        <Ionicons
                            name="shield-checkmark"
                            size={40}
                            color={vault.color}
                        />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                        {vault.title}
                    </Text>
                    <Text className="text-gray-500 text-center px-8">
                        {vault.isMember
                            ? t("vaultPassword.descriptionMember")
                            : t("vaultPassword.descriptionOwner")}
                    </Text>
                </View>

                <View className="w-full gap-4 px-4">
                    <TextField>
                        <Input
                            placeholder={t("vaultPassword.passwordPlaceholder")}
                            value={passwordInput}
                            onChangeText={setPasswordInput}
                            secureTextEntry
                            variant="secondary"
                            className="bg-content2 text-center text-lg h-14"
                            autoFocus
                        />
                    </TextField>

                    {error && (
                        <Text className="text-red-500 text-center text-sm">
                            {error}
                        </Text>
                    )}

                    <Button
                        size="lg"
                        onPress={handleUnlock}
                        className="w-full shadow-sm mt-2"
                        isDisabled={!passwordInput || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {t("vaultPassword.unlockButton")}
                            </Text>
                        )}
                    </Button>
                </View>

                {/* Spacer to push content up slightly */}
                <View style={{ height: insets.bottom + 40 }} />
            </View>
        </Container>
    );
}
