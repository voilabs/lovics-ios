import { BottomSheet } from "heroui-native";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Keyboard, Platform } from "react-native";
import { KeyboardShifter } from "./KeyboardShifter";
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
