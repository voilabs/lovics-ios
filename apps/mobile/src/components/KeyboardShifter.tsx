import React, { useState, useEffect, useRef } from "react";
import {
    Animated,
    Keyboard,
    Platform,
    StyleSheet,
    View,
    Dimensions,
} from "react-native";

export const KeyboardShifter = ({
    children,
    offset = 0,
}: {
    children: React.ReactNode;
    offset?: number;
}) => {
    // Klavyenin yüksekliğini animasyonlu bir şekilde tutuyoruz
    const shift = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Klavye açılma ve kapanma olaylarını dinliyoruz
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSubscription = Keyboard.addListener(showEvent, (event) => {
            Animated.timing(shift, {
                toValue: Math.max(0, event.endCoordinates.height - offset),
                duration: 250, // Klavye animasyonuyla uyumlu süre
                useNativeDriver: false, // Layout (padding) etkilediği için false olmalı
            }).start();
        });

        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            Animated.timing(shift, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [shift, offset]);

    return (
        <Animated.View style={[styles.container, { paddingBottom: shift }]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
