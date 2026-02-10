import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuthContext } from "../context/auth-context";
import Loading from "./Loading";

export default function AuthController({ children }: PropsWithChildren) {
    const { user, isLoading: isUserLoading } = useAuthContext();
    const segments = useSegments();
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const [isLoading, setIsLoading] = useState(true);

    const isNavigationReady = useMemo(() => {
        return rootNavigationState?.key;
    }, [rootNavigationState]);

    useEffect(() => {
        if (!isNavigationReady || isUserLoading) return;
        const inOnboardingGroup =
            segments.concat("(onboarding)")?.[0] === "(onboarding)";

        if (!user && !inOnboardingGroup) {
            router.replace("/(onboarding)");
        } else if (user && inOnboardingGroup) {
            router.replace("/(app)");
        }

        if (!user && inOnboardingGroup) setIsLoading(false);
        if (user && !inOnboardingGroup) setIsLoading(false);
    }, [user, isLoading, segments, isNavigationReady, isUserLoading]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
});
