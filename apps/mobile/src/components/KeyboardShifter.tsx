import React, { useEffect } from "react";
import { Keyboard, Platform, TextInput } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export const KeyboardShifter = ({
    children,
    offset = 20,
}: {
    children: React.ReactNode;
    offset?: number;
}) => {
    const shift = useSharedValue(0);

    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSubscription = Keyboard.addListener(showEvent, (e) => {
            const currentlyFocusedInput =
                TextInput.State.currentlyFocusedInput();

            if (!currentlyFocusedInput) return;

            currentlyFocusedInput.measureInWindow((x, y, width, height) => {
                const inputBottom = y + height;
                const keyboardTop = e.endCoordinates.screenY;

                if (inputBottom > keyboardTop - offset) {
                    const totalShift = inputBottom - keyboardTop + offset;

                    shift.value = withTiming(-totalShift, {
                        duration: Platform.OS === "ios" ? e.duration : 250,
                        easing: Easing.out(Easing.exp),
                    });
                }
            });
        });

        const hideSubscription = Keyboard.addListener(hideEvent, (e) => {
            shift.value = withTiming(0, {
                duration: Platform.OS === "ios" ? e.duration : 250,
                easing: Easing.out(Easing.exp),
            });
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [offset]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: shift.value }],
    }));

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            {children}
        </Animated.View>
    );
};
