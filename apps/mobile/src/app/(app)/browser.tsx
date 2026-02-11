import Container from "@/components/Container";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

export default function BrowserScreen() {
    const router = useRouter();
    const { url, title } = useLocalSearchParams<{
        url: string;
        title: string;
    }>();

    return (
        <Container>
            <Header title={title || "Browser"} onBack={() => router.back()} />
            <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => (
                    <View className="absolute inset-0 items-center justify-center bg-background">
                        <ActivityIndicator size="large" />
                    </View>
                )}
            />
        </Container>
    );
}
