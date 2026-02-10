import Container from "@/components/Container";
import Header from "@/components/Header";
import { Vault, VaultItem } from "@/components/VaultItem";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Input, Label, SkeletonGroup, TextField, cn } from "heroui-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Search() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [results, setResults] = useState<Vault[]>([]);
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Initial search or query change
    useEffect(() => {
        if (debouncedQuery.trim() === "") {
            setResults([]);
            setPage(1);
            setMaxPages(1);
            setHasSearched(false);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const res = await api.get("/vaults/public", {
                    params: {
                        search: debouncedQuery,
                        page: 1,
                    },
                });

                if (res.data.success) {
                    setResults(res.data.data.data);
                    setMaxPages(res.data.data.maxPages);
                    setPage(1);
                    setHasSearched(true);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleLoadMore = async () => {
        if (isLoadingMore || page >= maxPages) return;

        setIsLoadingMore(true);
        const nextPage = page + 1;

        try {
            const res = await api.get("/vaults/public", {
                params: {
                    search: debouncedQuery,
                    page: nextPage,
                },
            });

            if (res.data.status === "success") {
                setResults((prev) => [...prev, ...res.data.data.data]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Load more error:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <Container>
            <Header subtitle={t("search.subtitle")} />

            <View className="flex-1">
                <TextField className="space-y-1 mb-4">
                    <Label>{t("search.label")}</Label>
                    <View>
                        <TextField className="space-y-1">
                            <View>
                                <Input
                                    className="rounded-full h-12 py-2 px-12 text-base shadow-sm"
                                    placeholder={t("search.placeholder")}
                                    placeholderTextColor="#9ca3af"
                                    value={searchQuery}
                                    onChangeText={(text) => {
                                        setSearchQuery(text);
                                    }}
                                    variant="secondary"
                                />
                                <View className="absolute left-4 top-0 bottom-0 justify-center pointer-events-none">
                                    <Ionicons
                                        name="search-outline"
                                        size={20}
                                        color="#6b7280"
                                    />
                                </View>
                            </View>
                        </TextField>
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                className="absolute right-3 top-0 bottom-0 justify-center"
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </TextField>

                {isLoading ? (
                    <View className="flex-1">
                        <Text className="text-center text-muted-foreground mb-4">
                            {t("search.searching")}
                        </Text>
                        <SkeletonGroup>
                            <SkeletonGroup.Item className="w-full h-24 rounded-t-3xl rounded-b-xl mb-1" />
                            <SkeletonGroup.Item className="w-full h-24 rounded-xl mb-1" />
                            <SkeletonGroup.Item className="w-full h-24 rounded-xl mb-1" />
                        </SkeletonGroup>
                    </View>
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <VaultItem
                                item={item}
                                position={
                                    results.length === 1
                                        ? "single"
                                        : index === 0
                                          ? "first"
                                          : index === results.length - 1
                                            ? "last"
                                            : "middle"
                                }
                            />
                        )}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View className="py-4">
                                    <ActivityIndicator />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            hasSearched ? (
                                <View className="flex-1 items-center justify-center mt-20">
                                    <View className="w-16 h-16 rounded-full bg-background-secondary items-center justify-center mb-4">
                                        <Ionicons
                                            name="search"
                                            size={32}
                                            color="#9ca3af"
                                        />
                                    </View>
                                    <Text className="text-lg font-medium text-foreground">
                                        {t("search.noResults")}
                                    </Text>
                                    <Text className="text-muted-foreground text-center mt-1">
                                        "{searchQuery}" ile eşleşen sonuç
                                        bulunamadı.
                                    </Text>
                                </View>
                            ) : (
                                <View className="flex-1 items-center justify-center mt-20">
                                    <View className="w-16 h-16 rounded-full bg-background-secondary items-center justify-center mb-4">
                                        <Ionicons
                                            name="search-outline"
                                            size={32}
                                            color="#9ca3af"
                                        />
                                    </View>
                                    <Text className="text-muted-foreground text-center">
                                        {t("search.startSearching")}
                                    </Text>
                                </View>
                            )
                        }
                    />
                )}
            </View>
        </Container>
    );
}
