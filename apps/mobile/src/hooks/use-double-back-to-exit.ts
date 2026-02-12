import { useCallback, useRef } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { alert } from "@/lib/alert";
import { useTranslation } from "react-i18next";
import { useToast } from "heroui-native";
import { useRouter } from "expo-router";
export const useDoubleBackToExit = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const lastPressTimeRef = useRef<number>(0);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const now = Date.now();
                const DOUBLE_PRESS_DELAY = 2000;

                if (now - lastPressTimeRef.current < DOUBLE_PRESS_DELAY) {
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
                    lastPressTimeRef.current = 0;
                    return true;
                }
                if (router.canGoBack()) return false;

                lastPressTimeRef.current = now;
                return true;
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress,
            );

            return () => subscription.remove();
        }, [t, navigation]),
    );
};
