import Container from "@/components/Container";
import Header from "@/components/Header";
import { useAuthContext } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { Button, Input, TextField } from "heroui-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, View } from "react-native";

export default function AccountSettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useAuthContext();
    const [name, setName] = useState(user?.name?.split(":")[0] || "");
    const [surname, setSurname] = useState(user?.name?.split(":")[1] || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim())
            return Alert.alert(
                t("common.error"),
                t("settingsAccount.errorNameRequired"),
            );

        setIsLoading(true);
        try {
            const { error } = await authClient.updateUser({
                name: name.trim() + ":" + surname.trim(),
            });

            if (error) {
                Alert.alert("Hata", error.message || "Güncelleme başarısız.");
            } else {
                Alert.alert(
                    t("common.success"),
                    t("settingsAccount.successUpdated"),
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
                title={t("settingsAccount.title")}
                onBack={() => router.back()}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="gap-6 mt-4">
                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("settingsAccount.firstNameLabel")}
                        </Text>
                        <TextField>
                            <Input
                                placeholder={t(
                                    "settingsAccount.firstNamePlaceholder",
                                )}
                                value={name}
                                onChangeText={setName}
                                className="h-12 flex items-center px-4"
                                variant="secondary"
                            />
                        </TextField>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("settingsAccount.lastNameLabel")}
                        </Text>
                        <TextField>
                            <Input
                                placeholder={t(
                                    "settingsAccount.lastNamePlaceholder",
                                )}
                                value={surname}
                                onChangeText={setSurname}
                                className="h-12 flex items-center px-4"
                                variant="secondary"
                            />
                        </TextField>
                    </View>

                    <View>
                        <Text className="font-medium ml-1 mb-2 text-foreground">
                            {t("settingsAccount.emailLabel")}
                        </Text>
                        <TextField>
                            <Input
                                value={user?.email || ""}
                                editable={false}
                                className="h-12 flex items-center px-4 opacity-70"
                                variant="secondary"
                            />
                        </TextField>
                        <Text className="text-xs text-muted-foreground ml-1 mt-1">
                            {t("settingsAccount.emailWarning")}
                        </Text>
                    </View>

                    <Button
                        onPress={handleSave}
                        size="lg"
                        className="mt-4"
                        isDisabled={isLoading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {t("settingsAccount.saveButton")}
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}
