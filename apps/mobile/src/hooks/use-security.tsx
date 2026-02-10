import { clearSensitiveCache } from "@/lib/cleanup";
import { useEffect, useState } from "react";
import * as ScreenCapture from "expo-screen-capture";
import { AppState, View } from "react-native";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { useVault } from "@/context/vault";
import { useRouter } from "expo-router";

const styles = StyleSheet.create({
    blurLayer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "#000000",
    },
});

export const useSecurity = () => {
    const [isBlurred, setIsBlurred] = useState(false);
    const router = useRouter();
    useEffect(() => clearSensitiveCache(), []);
    useEffect(() => {
        // ScreenCapture.preventScreenCaptureAsync();
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                if (nextAppState === "active") {
                    setIsBlurred(false);
                } else {
                    setIsBlurred(true);
                    clearSensitiveCache();
                }
            },
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return {
        blueView: isBlurred ? <View style={styles.blurLayer} /> : null,
    };
};
