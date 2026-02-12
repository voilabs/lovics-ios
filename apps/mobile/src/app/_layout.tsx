import "@/i18n";
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;
import { Stack } from "expo-router";
import { HeroUINativeProvider, useThemeColor } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import APIController from "../components/APIController";
import AuthController from "../components/AuthController";
import { AuthContextProvider } from "../context/auth-context";
import "../global.css";
import RootedDevice from "../components/RootedDevice";
import { useSecurity } from "@/hooks/use-security";
import { KeyboardShifter } from "@/components/KeyboardShifter";
import { useDoubleBackToExit } from "@/hooks/use-double-back-to-exit";
import { AlertProvider } from "@/context/alert-context";
import AlertConnector from "@/components/AlertConnector";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

function AppLayout() {
    const backgroundColor = useThemeColor("background");
    const { blueView } = useSecurity();
    useDoubleBackToExit();
    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setVisibilityAsync("hidden");
        }
    }, []);

    return (
        <AlertProvider>
            <AlertConnector />
            <APIController>
                <AuthController>
                    <KeyboardShifter>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: {
                                    backgroundColor,
                                },
                            }}
                            initialRouteName="(onboarding)/index"
                        >
                            <Stack.Screen name="(onboarding)/index" />
                            <Stack.Screen name="(onboarding)/sign-in" />
                            <Stack.Screen name="(onboarding)/sign-up" />
                            <Stack.Screen name="(onboarding)/forgot-password" />
                            <Stack.Screen name="(app)" />
                        </Stack>
                    </KeyboardShifter>
                    {blueView}
                </AuthController>
            </APIController>
        </AlertProvider>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthContextProvider>
                <HeroUINativeProvider
                    config={{
                        devInfo: {
                            stylingPrinciples: false,
                        },
                    }}
                >
                    <RootedDevice>
                        <AppLayout />
                    </RootedDevice>
                </HeroUINativeProvider>
            </AuthContextProvider>
        </GestureHandlerRootView>
    );
}
