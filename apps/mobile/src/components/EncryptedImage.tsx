import { decryptionQueue } from "@/lib/queue";
import { useVault } from "@/context/vault";
import { Encrypter } from "@/lib/encrypter";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system/legacy"; // Legacy yerine normal import
import { View, ActivityIndicator, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import RNFS from "react-native-fs"; // EKLENDİ: npm install react-native-fs
import { Buffer } from "buffer";
import { useContent } from "@/hooks/use-content";
import { Skeleton } from "heroui-native";

export const EncryptedImage = ({
    src,
    path,
    mimeType,
    ivHex,
    style,
    alreadyDecrypted,
    ...props
}: any) => {
    const { uri, loading, error, decryptedMimeType } = alreadyDecrypted
        ? {
              uri: src,
              loading: false,
              error: null,
              decryptedMimeType: mimeType,
          }
        : useContent({
              src,
              path,
              mimeType,
              ivHex,
          });

    if (loading)
        return (
            <View
                style={[
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f3f4f6",
                        overflow: "hidden",
                    },
                    style,
                ]}
            >
                <Skeleton className="w-full h-full" />
            </View>
        );

    if (!uri) return <View style={[style, { backgroundColor: "#fee2e2" }]} />;

    return (
        <View
            style={[
                style,
                {
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                },
            ]}
        >
            {decryptedMimeType?.startsWith("video") && (
                <View
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderRadius: 50,
                        padding: 8,
                    }}
                >
                    <Ionicons name="play" size={32} color="white" />
                </View>
            )}
            <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
                {...props}
            />
        </View>
    );
};
