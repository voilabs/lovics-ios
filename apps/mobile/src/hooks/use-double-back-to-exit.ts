import React, { useCallback, useRef } from "react";
import { BackHandler } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { alert } from "@/lib/alert";
import { useTranslation } from "react-i18next";

export const useDoubleBackToExit = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const lastPressTimeRef = useRef<number>(0);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const now = Date.now();
                const state = navigation.getState();

                // 1. Senaryo: Kullanıcı zaten ana sayfada (stack boş)
                // 2. Senaryo: Kullanıcı çok hızlı (2 saniye içinde) iki kere geri bastı
                if (
                    state.index === 0 ||
                    now - lastPressTimeRef.current < 2000
                ) {
                    alert(
                        t("common.exitAppTitle"),
                        t("common.exitAppMessage"),
                        [
                            {
                                text: t("common.cancel"),
                                onPress: (setIsOpen) => setIsOpen(false),
                                variant: "danger-soft",
                            },
                            {
                                text: t("common.exit"),
                                onPress: () => BackHandler.exitApp(),
                                variant: "primary",
                            },
                        ],
                    );

                    // Zamanı sıfırlıyoruz ki Alert açıkken bir daha basarsa tekrar tetiklenmesin
                    lastPressTimeRef.current = 0;
                    return true;
                }

                // İlk basışta zamanı kaydet ve normal geri gitmesine izin ver
                lastPressTimeRef.current = now;
                return false;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);
        }, [navigation]),
    );
};
