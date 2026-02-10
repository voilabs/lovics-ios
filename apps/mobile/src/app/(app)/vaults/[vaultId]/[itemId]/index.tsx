import Container from "@/components/Container";
import { StatusBar } from "expo-status-bar";
import { EncryptedImage } from "@/components/EncryptedImage"; // Senin bileşenin
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
    ActivityIndicator,
    StyleSheet,
    Alert,
} from "react-native";

import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    ScrollView as GHScrollView,
} from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    withTiming,
    interpolate,
    Extrapolation,
    useAnimatedRef,
    FadeIn,
    FadeOut,
} from "react-native-reanimated";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

const ImageViewerItem = ({
    url,
    path,
    mimeType,
    ivHex,
    onClose,
    isCurrentItem,
}: {
    url: string;
    path: string;
    mimeType: string;
    ivHex: string;
    onClose: () => void;
    isCurrentItem: boolean;
}) => {
    const { width, height } = Dimensions.get("window");
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const panRef = useRef(null);
    const scrollViewRef = useAnimatedRef<GHScrollView>();

    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        if (!isCurrentItem) {
            translateY.value = 0;
            opacity.value = 1;
            setIsZoomed(false);
        }
    }, [isCurrentItem]);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {});

    const pan = Gesture.Pan()
        .activeOffsetY(5)
        .failOffsetX([-50, 50])
        .withRef(panRef)
        .onUpdate((e) => {
            if (e.translationY > 0) {
                translateY.value = e.translationY;
                opacity.value = interpolate(
                    e.translationY,
                    [0, 250],
                    [1, 0.4],
                    Extrapolation.CLAMP,
                );
            }
        })
        .onEnd((e) => {
            if (e.translationY > 120 || e.velocityY > 600) {
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0);
                opacity.value = withTiming(1);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[{ flex: 1, width, height }, animatedStyle]}>
                <GHScrollView
                    ref={scrollViewRef}
                    waitFor={panRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    minimumZoomScale={1}
                    maximumZoomScale={3}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    centerContent
                >
                    <EncryptedImage
                        src={url}
                        path={path}
                        mimeType={mimeType}
                        ivHex={ivHex}
                        contentFit="contain"
                        alreadyDecrypted
                        style={{ width: width, height: height }}
                    />
                </GHScrollView>
            </Animated.View>
        </GestureDetector>
    );
};

const VideoViewerItem = ({
    url,
    path,
    mimeType,
    ivHex,
    onClose,
}: {
    url: string;
    path: string;
    mimeType: string;
    ivHex: string;
    onClose: () => void;
}) => {
    const { width, height } = Dimensions.get("window");

    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);

    const player = useVideoPlayer(url, (player) => {
        player.loop = false;
    });

    const pan = Gesture.Pan()
        .activeOffsetY(5)
        .failOffsetX([-50, 50])
        .onUpdate((e) => {
            if (e.translationY > 0) {
                translateY.value = e.translationY;
                opacity.value = interpolate(
                    e.translationY,
                    [0, 250],
                    [1, 0.4],
                    Extrapolation.CLAMP,
                );
            }
        })
        .onEnd((e) => {
            if (e.translationY > 150) {
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0);
                opacity.value = withTiming(1);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View
                style={[
                    {
                        flex: 1,
                        width,
                        height,
                        justifyContent: "center",
                        backgroundColor: "transparent",
                    },
                    animatedStyle,
                ]}
            >
                <VideoView
                    style={{ width: "100%", height: "100%" }}
                    player={player}
                    allowsFullscreen={true}
                    allowsPictureInPicture={true}
                    nativeControls={true}
                    contentFit="contain"
                />
            </Animated.View>
        </GestureDetector>
    );
};

const ContentItem = ({
    src,
    path,
    mimeType,
    ivHex,
}: {
    src: string;
    path: string;
    mimeType: string;
    ivHex: string;
}) => {
    const { uri, loading, error, fileUri, decryptedMimeType } = useContent({
        src,
        path,
        mimeType,
        ivHex,
        noThumbnail: true,
    });

    const player = useVideoPlayer(fileUri, (player) => {
        player.loop = false;
    });

    return (
        <>
            {decryptedMimeType?.startsWith("video") ? (
                <VideoViewerItem
                    url={fileUri || uri}
                    path={path}
                    mimeType={mimeType}
                    ivHex={ivHex}
                    onClose={() => {}}
                />
            ) : (
                <ImageViewerItem
                    url={uri}
                    path={path}
                    mimeType={mimeType}
                    ivHex={ivHex}
                    onClose={() => {}}
                    isCurrentItem={false}
                />
            )}
        </>
    );
};

export default function Page() {
    const { vaultId, itemId } = useLocalSearchParams<{
        vaultId: string;
        itemId: string;
    }>();

    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contents, setContents] = useState<any[]>([]);
    const [createdAt, setCreatedAt] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const router = useRouter();
    const { data: vault, masterKey } = useVault();
    const { paddingLeft } = useContainer({});

    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

    const insets = useSafeAreaInsets();
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const safePadding = typeof paddingLeft === "number" ? paddingLeft : 16;
    const itemWidth = screenWidth - safePadding * 2;

    const handleMediaPress = (index: number) => {
        if (isSelectionMode) {
            toggleSelection(index);
        } else {
            setViewerIndex(index);
            setViewerVisible(true);
        }
    };

    const handleLongPress = (index: number) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleSelection(index);
        }
    };

    const toggleSelection = (index: number) => {
        const path = contents[index].path;
        setSelectedPaths((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            if (newSet.size === 0) {
                setIsSelectionMode(false);
            }
            return newSet;
        });
    };

    const handleExitSelection = () => {
        setIsSelectionMode(false);
        setSelectedPaths(new Set());
    };

    const handleDelete = async () => {
        if (selectedPaths.size === 0) {
            return;
        }

        Alert.alert(
            "Sil?",
            "Seçili öğeleri silmek istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        await performDelete(Array.from(selectedPaths));
                    },
                },
            ],
        );
    };

    const handleDeleteAll = async () => {
        Alert.alert(
            "Sil?",
            "Bu gönderiyi tamamen silmek istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        await performDelete([]);
                    },
                },
            ],
        );
    };

    const performDelete = async (pathsToDelete: string[]) => {
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
                router.back();
            } else {
                const newContents = contents.filter(
                    (c) => !pathsToDelete.includes(c.path),
                );
                setContents(newContents);
                setIsSelectionMode(false);
                setSelectedPaths(new Set());
                setCurrentImageIndex(0);
            }
        } catch (err) {
            console.error("Delete failed", err);
            Alert.alert("Hata", "Silme işlemi başarısız oldu.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeViewer = useCallback(() => {
        setViewerVisible(false);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get(`/vaults/${vaultId}/contents/${itemId}`);
            const data = res.data.data;
            let encrypter: Encrypter | null = null;
            if (vault?.isEncrypted && masterKey) {
                encrypter = Encrypter.fromMasterKey(masterKey);
            }

            let titleResult = data.title;
            let descriptionResult = data.description;

            if (encrypter) {
                try {
                    titleResult = encrypter.decryptText(data.title);
                } catch (e) {
                    /* Hata yönetimi */
                }
                try {
                    descriptionResult = encrypter.decryptText(data.description);
                } catch (e) {
                    /* Hata yönetimi */
                }
            }

            const contentAlts = data.contents.map((content: any) => {
                let altText = content.alt;
                if (encrypter) {
                    try {
                        altText = encrypter.decryptText(content.alt);
                    } catch (e) {
                        altText = "Dosya";
                    }
                }
                return { ...content, alt: altText };
            });

            setTitle(titleResult);
            setDescription(descriptionResult);
            setContents(contentAlts);
            setCreatedAt(data.createdAt);
        } catch (err) {
            console.error(err);
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
                        <TouchableOpacity onPress={handleExitSelection}>
                            <Ionicons name="close" size={24} color="gray" />
                        </TouchableOpacity>
                        <Text className="text-lg font-medium">
                            {selectedPaths.size} Seçildi
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleDelete}
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
                    title={title || "İçerik Detayı"}
                    onBack={() => router.back()}
                    rightContent={
                        <TouchableOpacity onPress={handleDeleteAll}>
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
                    {description ? (
                        <Text className="text-gray-600 text-base leading-relaxed">
                            {description}
                        </Text>
                    ) : null}
                </View>

                {/* Küçük Galeri Görünümü (Thumbnails) */}
                <View>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        className="flex-1 h-96"
                        onScroll={(e) => {
                            const idx = Math.round(
                                e.nativeEvent.contentOffset.x / itemWidth,
                            );
                            setCurrentImageIndex(idx);
                        }}
                        scrollEventThrottle={16}
                    >
                        {contents?.map((file: any, index: number) => {
                            const isSelected = selectedPaths.has(file.path);
                            return (
                                <View
                                    key={index}
                                    style={{ width: itemWidth }}
                                    className="justify-center h-full mr-4 last:mr-0"
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => handleMediaPress(index)}
                                        onLongPress={() =>
                                            handleLongPress(index)
                                        }
                                        className="w-full h-full relative"
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
                                                backgroundColor:
                                                    "rgba(0,0,0,0.05)",
                                                opacity:
                                                    isSelectionMode &&
                                                    !isSelected
                                                        ? 0.5
                                                        : 1,
                                            }}
                                        />
                                        {isSelectionMode && (
                                            <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                                                <Ionicons
                                                    name={
                                                        isSelected
                                                            ? "checkmark-circle"
                                                            : "ellipse-outline"
                                                    }
                                                    size={24}
                                                    color={
                                                        isSelected
                                                            ? "#4ade80"
                                                            : "white"
                                                    }
                                                />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <Text className="text-gray-600 text-base leading-relaxed mt-2 text-center">
                                        {file.alt}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Pagination Dots */}
                    {contents.length > 1 && (
                        <View className="flex-row justify-center items-center mt-4 gap-2">
                            {contents.map((_, index) => (
                                <View
                                    key={index}
                                    className={`h-2 rounded-full ${currentImageIndex === index ? "w-6 bg-accent" : "w-2 bg-gray-300"}`}
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View className="h-20" />
            </ScrollView>

            {/* FULL SCREEN MODAL */}
            <Modal
                visible={viewerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeViewer}
                statusBarTranslucent
            >
                <GestureHandlerRootView
                    style={{ flex: 1, backgroundColor: "black" }}
                >
                    <StatusBar hidden />

                    {/* Close Button */}
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: insets.top + 10,
                            right: 20,
                            zIndex: 9999,
                            padding: 8,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 20,
                        }}
                        onPress={closeViewer}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <FlatList
                        data={contents}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => String(index)}
                        initialScrollIndex={viewerIndex}
                        getItemLayout={(_, index) => ({
                            length: screenWidth,
                            offset: screenWidth * index,
                            index,
                        })}
                        onMomentumScrollEnd={(ev) => {
                            const newIndex = Math.round(
                                ev.nativeEvent.contentOffset.x / screenWidth,
                            );
                            setViewerIndex(newIndex);
                        }}
                        renderItem={({ item, index }) => (
                            <ContentItem
                                src={item.src || item.url}
                                path={item.path}
                                mimeType={item.mimeType}
                                ivHex={item.iv!}
                            />
                        )}
                    />

                    {/* Caption */}
                    {contents[viewerIndex]?.alt ? (
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
                    ) : null}
                </GestureHandlerRootView>
            </Modal>
        </Container>
    );
}
