import Container from "@/components/Container";
import Header from "@/components/Header";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { Button, Input, TextField } from "heroui-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, View } from "react-native";

export default function SecuritySettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return Alert.alert(
                t("common.error"),
                t("settingsSecurity.errorAllFields"),
            );
        }

        if (newPassword.length < 8) {
            return Alert.alert(
                t("common.error"),
                t("settingsSecurity.errorPasswordLength"),
            );
        }

        if (newPassword !== confirmPassword) {
            return Alert.alert(
                t("common.error"),
                t("settingsSecurity.errorMismatch"),
            );
        }

        setIsLoading(true);
        try {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                Alert.alert(
                    t("common.error"),
                    error.message || t("settingsSecurity.errorFailed"),
                );
            } else {
                Alert.alert(
                    t("common.success"),
                    t("settingsSecurity.successUpdated"),
                );
                router.back();
            }
        } catch (e) {
            console.error(e);
            Alert.alert(t("common.error"), t("favorites.genericError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Header
                title={t("settingsSecurity.title")}
                onBack={() => router.back()}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="gap-6 mt-4">
                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("settingsSecurity.currentPasswordLabel")}
                        </Text>
                        <TextField>
                            <Input
                                placeholder={t(
                                    "settingsSecurity.currentPasswordPlaceholder",
                                )}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                className="h-12 flex items-center px-4"
                                variant="secondary"
                            />
                        </TextField>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("settingsSecurity.newPasswordLabel")}
                        </Text>
                        <TextField>
                            <Input
                                placeholder={t(
                                    "settingsSecurity.newPasswordPlaceholder",
                                )}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                className="h-12 flex items-center px-4"
                                variant="secondary"
                            />
                        </TextField>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("settingsSecurity.confirmPasswordLabel")}
                        </Text>
                        <TextField>
                            <Input
                                placeholder={t(
                                    "settingsSecurity.confirmPasswordPlaceholder",
                                )}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                className="h-12 flex items-center px-4"
                                variant="secondary"
                            />
                        </TextField>
                    </View>

                    <Button
                        onPress={handleSave}
                        size="lg"
                        className="mt-4"
                        isDisabled={isLoading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {t("settingsSecurity.updateButton")}
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}
