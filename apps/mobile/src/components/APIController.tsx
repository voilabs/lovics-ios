import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Loading from "./Loading";

export default function APIController({
    children,
}: {
    children: React.ReactNode;
}) {
    const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

    const checkAPI = () => {
        api.get("/", {
            timeout: 5000,
            headers: {
                Cookie: "",
            },
        })
            .then((res) => res.data)
            .then((res) => {
                if (res.data.status === "ok") {
                    setStatus("ok");
                } else {
                    setStatus("error");
                }
            })
            .catch(() => {
                setStatus("error");
            });
    };

    useEffect(() => {
        checkAPI();
        const interval = setInterval(() => {
            checkAPI();
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    if (status === "loading") {
        return <Loading />;
    }

    if (status === "error") {
        return (
            <View className="flex-1 items-center justify-center bg-background px-6">
                <View className="items-center justify-center w-20 h-20 bg-danger/10 rounded-full mb-6">
                    <Ionicons
                        name="cloud-offline-outline"
                        size={40}
                        color="#ef4444"
                    />
                </View>
                <Text className="text-foreground text-xl font-bold mb-2 text-center">
                    Bağlantı Hatası
                </Text>
                <Text className="text-muted-foreground text-center mb-8">
                    Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol
                    edin.
                </Text>
                <Button
                    onPress={() => {
                        setStatus("loading");
                        checkAPI();
                    }}
                    variant="secondary"
                >
                    Tekrar Dene
                </Button>
            </View>
        );
    }

    return children;
}
