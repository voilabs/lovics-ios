import Container from "@/components/Container";
import { StatusBar } from "expo-status-bar";
import { EncryptedImage } from "@/components/EncryptedImage";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useVault } from "@/context/vault";
import { useContainer } from "@/hooks/use-container";
import { useContent } from "@/hooks/use-content";
import { api } from "@/lib/api";
import { Encrypter } from "@/lib/encrypter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef, useCallback } from "react";
import {
    Dimensions,
    Text,
    View,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import { alert } from "@/lib/alert";

import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    withTiming,
    interpolate,
    Extrapolation,
    useAnimatedProps,
} from "react-native-reanimated";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// --- IMAGE VIEWER ITEM ---
const ImageViewerItem = ({
    url,
    path,
    mimeType,
    ivHex,
    onClose,
    isCurrentItem,
}: any) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const [isZoomed, setIsZoomed] = useState(false);

    // Başka resme geçildiğinde mevcut resmin zoomunu sıfırla
    useEffect(() => {
        if (!isCurrentItem) {
            scale.value = withTiming(1);
            translateY.value = withTiming(0);
            translateX.value = withTiming(0);
            opacity.value = withTiming(1);
            savedScale.value = 1;
            setIsZoomed(false);
        }
    }, [isCurrentItem]);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1.1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                runOnJS(setIsZoomed)(false);
            } else {
                let targetScale = Math.round(Math.min(scale.value, 8) * 4) / 4;
                if (targetScale < 1.25) {
                    targetScale = 1;
                    scale.value = withSpring(1);
                    savedScale.value = 1;
                    translateX.value = withSpring(0);
                    translateY.value = withSpring(0);
                    runOnJS(setIsZoomed)(false);
                } else {
                    scale.value = withSpring(targetScale);
                    savedScale.value = targetScale;
                    runOnJS(setIsZoomed)(true);
                }
            }
        });

    const basePanGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (scale.value > 1) {
                translateX.value = e.translationX;
                translateY.value = e.translationY;
            } else {
                if (e.translationY > 0) {
                    translateY.value = e.translationY;
                    opacity.value = interpolate(
                        e.translationY,
                        [0, 300],
                        [1, 0.5],
                        Extrapolation.CLAMP,
                    );
                }
            }
        })
        .onEnd((e) => {
            if (scale.value <= 1.1) {
                if (e.translationY > 150 || e.velocityY > 800) {
                    runOnJS(onClose)();
                } else {
                    translateY.value = withSpring(0);
                    opacity.value = withTiming(1);
                }
            }
        });

    const panGesture = isZoomed
        ? basePanGesture
        : basePanGesture.activeOffsetY([-10, 10]).failOffsetX([-10, 10]);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1.1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                runOnJS(setIsZoomed)(false);
            } else {
                scale.value = withSpring(2.5);
                savedScale.value = 2.5;
                runOnJS(setIsZoomed)(true);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        // @ts-ignore
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    const zoomIndicatorStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(scale.value > 1.1 ? 1 : 0),
        };
    });

    const animatedTextProps = useAnimatedProps(() => {
        return {
            text: `${scale.value.toFixed(1)}x`,
        } as any;
    });

    return (
        <GestureDetector
            gesture={Gesture.Simultaneous(pinchGesture, panGesture, doubleTap)}
        >
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={
                        {
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            justifyContent: "center",
                            ...animatedStyle,
                        } as any
                    }
                >
                    <EncryptedImage
                        src={url}
                        path={path}
                        mimeType={mimeType}
                        ivHex={ivHex}
                        contentFit="contain"
                        alreadyDecrypted
                        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            top: 60,
                            alignSelf: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 20,
                            pointerEvents: "none",
                        },
                        zoomIndicatorStyle,
                    ]}
                >
                    <AnimatedTextInput
                        animatedProps={animatedTextProps}
                        editable={false}
                        style={{
                            color: "white",
                            fontSize: 14,
                            fontWeight: "600",
                        }}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

// --- VIDEO VIEWER ITEM ---
const VideoViewerItem = ({ url, onClose, isCurrentItem }: any) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const [isZoomed, setIsZoomed] = useState(false);

    const player = useVideoPlayer(url, (p) => {
        p.loop = false;
    });

    useEffect(() => {
        const subscription = player.addListener("playToEnd", () => {
            scale.value = withTiming(1);
            translateY.value = withTiming(0);
            translateX.value = withTiming(0);
            opacity.value = withTiming(1);
            savedScale.value = 1;
            runOnJS(setIsZoomed)(false);
        });

        return () => {
            subscription.remove();
        };
    }, [player]);

    // Reset zoom when switching items
    useEffect(() => {
        if (!isCurrentItem) {
            scale.value = withTiming(1);
            translateY.value = withTiming(0);
            translateX.value = withTiming(0);
            opacity.value = withTiming(1);
            savedScale.value = 1;
            setIsZoomed(false);
        }
    }, [isCurrentItem]);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1.1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                runOnJS(setIsZoomed)(false);
            } else {
                let targetScale = Math.round(Math.min(scale.value, 8) * 4) / 4;
                if (targetScale < 1.25) {
                    targetScale = 1;
                    scale.value = withSpring(1);
                    savedScale.value = 1;
                    translateX.value = withSpring(0);
                    translateY.value = withSpring(0);
                    runOnJS(setIsZoomed)(false);
                } else {
                    scale.value = withSpring(targetScale);
                    savedScale.value = targetScale;
                    runOnJS(setIsZoomed)(true);
                }
            }
        });

    const basePanGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (scale.value > 1) {
                translateX.value = e.translationX;
                translateY.value = e.translationY;
            } else {
                if (e.translationY > 0) {
                    translateY.value = e.translationY;
                    opacity.value = interpolate(
                        e.translationY,
                        [0, 300],
                        [1, 0.5],
                        Extrapolation.CLAMP,
                    );
                }
            }
        })
        .onEnd((e) => {
            if (scale.value <= 1.1) {
                if (e.translationY > 150 || e.velocityY > 800) {
                    runOnJS(onClose)();
                } else {
                    translateY.value = withSpring(0);
                    opacity.value = withTiming(1);
                }
            }
        });

    const panGesture = isZoomed
        ? basePanGesture
        : basePanGesture.activeOffsetY([-10, 10]).failOffsetX([-10, 10]);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1.1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                runOnJS(setIsZoomed)(false);
            } else {
                scale.value = withSpring(2.5);
                savedScale.value = 2.5;
                runOnJS(setIsZoomed)(true);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        // @ts-ignore
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    const zoomIndicatorStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(scale.value > 1.1 ? 1 : 0),
        };
    });

    const animatedTextProps = useAnimatedProps(() => {
        return {
            text: `${scale.value.toFixed(1)}x`,
        } as any;
    });

    return (
        <GestureDetector
            gesture={Gesture.Simultaneous(pinchGesture, panGesture, doubleTap)}
        >
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={
                        {
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            justifyContent: "center",
                            ...animatedStyle,
                        } as any
                    }
                >
                    <VideoView
                        style={{ width: "100%", height: "100%" }}
                        player={player}
                        nativeControls
                        contentFit="contain"
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            top: 60,
                            alignSelf: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 20,
                            pointerEvents: "none",
                        },
                        zoomIndicatorStyle,
                    ]}
                >
                    <AnimatedTextInput
                        animatedProps={animatedTextProps}
                        editable={false}
                        style={{
                            color: "white",
                            fontSize: 14,
                            fontWeight: "600",
                        }}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

// --- CONTENT ITEM WRAPPER ---
const ContentItem = ({ item, isCurrentItem, onClose }: any) => {
    const { uri, fileUri, decryptedMimeType } = useContent({
        src: item.src || item.url,
        path: item.path,
        mimeType: item.mimeType,
        ivHex: item.iv,
        noThumbnail: true,
    });

    if (decryptedMimeType?.startsWith("video")) {
        return (
            <VideoViewerItem
                url={fileUri || uri}
                onClose={onClose}
                isCurrentItem={isCurrentItem}
            />
        );
    }

    return (
        <ImageViewerItem
            url={uri}
            path={item.path}
            mimeType={item.mimeType}
            ivHex={item.iv}
            onClose={onClose}
            isCurrentItem={isCurrentItem}
        />
    );
};

// --- MAIN PAGE ---
export default function Page() {
    const { t } = useTranslation();
    const { vaultId, itemId } = useLocalSearchParams<{
        vaultId: string;
        itemId: string;
    }>();
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contents, setContents] = useState<any[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

    const router = useRouter();
    const { data: vault, masterKey, refetch } = useVault();
    const { paddingLeft } = useContainer({});
    const insets = useSafeAreaInsets();
    const safePadding = typeof paddingLeft === "number" ? paddingLeft : 16;

    const handleMediaPress = (index: number) => {
        if (isSelectionMode) toggleSelection(index);
        else {
            setViewerIndex(index);
            setViewerVisible(true);
        }
    };

    const toggleSelection = (index: number) => {
        const path = contents[index].path;
        setSelectedPaths((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(path)) newSet.delete(path);
            else newSet.add(path);
            if (newSet.size === 0) setIsSelectionMode(false);
            return newSet;
        });
    };

    const performDelete = async (
        pathsToDelete: string[],
        afterDelete: () => void,
    ) => {
        try {
            setIsLoading(true);
            await api.delete(`/vaults/${vaultId}/contents/${itemId}`, {
                data: {
                    contentPaths:
                        pathsToDelete.length > 0 ? pathsToDelete : undefined,
                },
            });
            if (
                pathsToDelete.length === 0 ||
                pathsToDelete.length === contents.length
            ) {
                afterDelete();
                refetch("contents");
                router.replace(`/vaults/${vaultId}`);
            } else {
                const newContents = contents.filter(
                    (c) => !pathsToDelete.includes(c.path),
                );
                afterDelete();
                refetch("contents");
                setContents(newContents);
                setIsSelectionMode(false);
                setSelectedPaths(new Set());
                setCurrentImageIndex(0);
            }
        } catch (err) {
            alert(t("common.error"), t("vaults.item.deleteError"));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get(`/vaults/${vaultId}/contents/${itemId}`);
            const data = res.data.data;
            let encrypter =
                vault?.isEncrypted && masterKey
                    ? Encrypter.fromMasterKey(masterKey)
                    : null;

            let t = data.title,
                d = data.description;
            if (encrypter) {
                try {
                    t = encrypter.decryptText(data.title);
                } catch (e) {}
                try {
                    d = encrypter.decryptText(data.description);
                } catch (e) {}
            }

            const c = data.contents.map((content: any) => {
                let alt = content.alt;
                if (encrypter) {
                    try {
                        alt = encrypter.decryptText(content.alt);
                    } catch (e) {
                        alt = t("vaults.item.alt");
                    }
                }
                return { ...content, alt };
            });

            setTitle(t);
            setDescription(d);
            setContents(c);
        } catch (err) {
            router.back();
        } finally {
            setIsLoading(false);
        }
    }, [vaultId, itemId, masterKey, vault]);

    useEffect(() => {
        if (vault?.isEncrypted && !masterKey) {
            router.replace(`/(app)/vaults/${vaultId}/password`);
            return;
        }
        fetchData();
    }, [vaultId, itemId, masterKey]);

    if (isLoading) return <Loading />;

    return (
        <Container>
            {isSelectionMode ? (
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={() => {
                                setIsSelectionMode(false);
                                setSelectedPaths(new Set());
                            }}
                        >
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>
                        <Text className="text-lg font-medium">
                            {t("vaults.item.selected", {
                                count: selectedPaths.size,
                            })}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            alert(
                                t("common.delete"),
                                t("vaults.item.deleteConfirm", {
                                    size: selectedPaths.size,
                                }),
                                [
                                    {
                                        text: t("common.cancel"),
                                        onPress: (setIsOpen) =>
                                            setIsOpen(false),
                                        variant: "secondary",
                                    },
                                    {
                                        text: t("common.delete"),
                                        onPress: (setIsOpen) =>
                                            performDelete(
                                                Array.from(selectedPaths),
                                                () => setIsOpen(false),
                                            ),
                                        variant: "danger-soft",
                                    },
                                ],
                            );
                        }}
                        disabled={selectedPaths.size === 0}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color={selectedPaths.size > 0 ? "red" : "gray"}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <Header
                    title={title || t("vaults.item.title")}
                    onBack={() => router.back()}
                    rightContent={
                        <TouchableOpacity
                            onPress={() => {
                                alert(
                                    t("common.delete"),
                                    t("vaults.item.deleteConfirm", {
                                        size: contents.length,
                                    }),
                                    [
                                        {
                                            text: t("common.cancel"),
                                            onPress: (setIsOpen) =>
                                                setIsOpen(false),
                                            variant: "secondary",
                                        },
                                        {
                                            text: t("common.delete"),
                                            onPress: (setIsOpen) =>
                                                performDelete([], () =>
                                                    setIsOpen(false),
                                                ),
                                            variant: "danger-soft",
                                        },
                                    ],
                                );
                            }}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color="red"
                            />
                        </TouchableOpacity>
                    }
                />
            )}

            <ScrollView
                className="flex-1 py-4"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6 px-1">
                    <Text className="text-2xl font-bold text-foreground mb-2">
                        {title}
                    </Text>
                    {description && (
                        <Text className="text-gray-600 text-base">
                            {description}
                        </Text>
                    )}
                </View>

                <View style={{ marginHorizontal: -safePadding }}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        className="flex-1 h-96"
                        onMomentumScrollEnd={(e) =>
                            setCurrentImageIndex(
                                Math.round(
                                    e.nativeEvent.contentOffset.x /
                                        SCREEN_WIDTH,
                                ),
                            )
                        }
                        scrollEventThrottle={16}
                    >
                        {contents?.map((file: any, index: number) => (
                            <View
                                key={index}
                                style={{ width: SCREEN_WIDTH }}
                                className="justify-center h-full"
                            >
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => handleMediaPress(index)}
                                    onLongPress={() => {
                                        setIsSelectionMode(true);
                                        toggleSelection(index);
                                    }}
                                    className="w-full flex-1 relative"
                                >
                                    <EncryptedImage
                                        src={file.url}
                                        mimeType={file.mimeType}
                                        path={file.path}
                                        ivHex={file.iv}
                                        contentFit="contain"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 16,
                                            backgroundColor: "rgba(0,0,0,0.05)",
                                            opacity:
                                                isSelectionMode &&
                                                !selectedPaths.has(file.path)
                                                    ? 0.5
                                                    : 1,
                                        }}
                                    />
                                    {isSelectionMode && (
                                        <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                                            <Ionicons
                                                name={
                                                    selectedPaths.has(file.path)
                                                        ? "checkmark-circle"
                                                        : "ellipse-outline"
                                                }
                                                size={24}
                                                color={
                                                    selectedPaths.has(file.path)
                                                        ? "#4ade80"
                                                        : "white"
                                                }
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <Text className="text-gray-600 text-base mt-2 text-center">
                                    {file.alt}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                    {contents.length > 1 && (
                        <View className="flex-row justify-center items-center mt-4">
                            <View className="bg-black/50 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-medium">
                                    {currentImageIndex + 1} / {contents.length}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
                <View className="h-20" />
            </ScrollView>

            <Modal
                visible={viewerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setViewerVisible(false)}
                statusBarTranslucent
            >
                <GestureHandlerRootView
                    style={{ flex: 1, backgroundColor: "black" }}
                >
                    <StatusBar hidden />
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: insets.top + 10,
                            right: 20,
                            zIndex: 99,
                            padding: 8,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 20,
                        }}
                        onPress={() => setViewerVisible(false)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <FlatList
                        data={contents}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={viewerIndex}
                        getItemLayout={(_, index) => ({
                            length: SCREEN_WIDTH,
                            offset: SCREEN_WIDTH * index,
                            index,
                        })}
                        onMomentumScrollEnd={(ev) =>
                            setViewerIndex(
                                Math.round(
                                    ev.nativeEvent.contentOffset.x /
                                        SCREEN_WIDTH,
                                ),
                            )
                        }
                        renderItem={({ item, index }) => (
                            <ContentItem
                                item={item}
                                isCurrentItem={index === viewerIndex}
                                onClose={() => setViewerVisible(false)}
                            />
                        )}
                        keyExtractor={(_, i) => i.toString()}
                    />

                    {contents[viewerIndex]?.alt && (
                        <View
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                paddingBottom: insets.bottom + 20,
                                paddingTop: 20,
                                paddingHorizontal: 20,
                                backgroundColor: "rgba(0,0,0,0.6)",
                            }}
                        >
                            <Text className="text-white text-center text-base font-medium">
                                {contents[viewerIndex].alt}
                            </Text>
                        </View>
                    )}
                </GestureHandlerRootView>
            </Modal>
        </Container>
    );
}
