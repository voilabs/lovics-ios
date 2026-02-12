import { BottomSheet } from "heroui-native";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";

const KeyboardShifter = ({
    children,
    offset = 0,
}: {
    children: React.ReactNode;
    offset?: number;
}) => {
    // Animasyon yerine doğrudan sayısal bir state kullanıyoruz
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSubscription = Keyboard.addListener(showEvent, (event) => {
            // Değeri anında güncelliyoruz
            setKeyboardHeight(
                Math.max(0, event.endCoordinates.height - offset),
            );
        });

        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            // Değeri anında sıfırlıyoruz
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [offset]);

    return (
        <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export const BottomSheetContent = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <BottomSheet.Content
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            keyboardBehavior="extend"
            enableBlurKeyboardOnGesture
        >
            <KeyboardShifter>{children}</KeyboardShifter>
        </BottomSheet.Content>
    );
};
