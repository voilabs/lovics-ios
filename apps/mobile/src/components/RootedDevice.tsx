import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import JailMonkey from "jail-monkey";

interface RootedDeviceProps {
    children: React.ReactNode;
}

export default function RootedDevice({ children }: RootedDeviceProps) {
    const [isRooted, setIsRooted] = useState<boolean | null>(null);

    useEffect(() => {
        checkRootStatus();
    }, []);

    const checkRootStatus = async () => {
        try {
            const rooted = JailMonkey.isJailBroken();
            setIsRooted(rooted);
        } catch (error) {
            console.error("Root detection error:", error);
            setIsRooted(false);
        }
    };

    if (isRooted === null) {
        return null;
    }

    if (isRooted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Ionicons
                        name="warning-outline"
                        size={80}
                        color="#ef4444"
                    />
                    <Text style={styles.title}>Güvenlik Uyarısı</Text>
                    <Text style={styles.message}>
                        Cihazınızın root erişimine sahip olduğu tespit edildi.
                        Güvenlik nedeniyle bu uygulamayı rootlu cihazlarda
                        kullanamazsınız.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 12,
        textAlign: "center",
    },
    message: {
        color: "#a1a1aa",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
    },
});
