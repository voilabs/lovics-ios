import Loading from "@/components/Loading";
import { api } from "@/lib/api";
import { clearSensitiveCache } from "@/lib/cleanup";
import { usePathname, useRouter } from "expo-router";
import {
    useContext,
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";

export const VaultContext = createContext<{
    vaultId: string;

    // DEĞİŞİKLİK: Artık 'password' yerine 'masterKey' tutuyoruz.
    // Çünkü kullanıcı kasayı açtığında elimizde ham Master Key (DEK) oluyor.
    masterKey: string | null;
    setMasterKey: (key: string) => void;

    data: any;
    isLoading: boolean;
    error: any;
    contents: any[];
    refetch: (type?: "vault" | "contents" | "all") => Promise<void>;
    refreshing: boolean;
    isMember: boolean;
    isPrimaryOwner: boolean;
    lockVault: () => void;

    // Geriye dönük uyumluluk için (Opsiyonel, kodun geri kalanı patlamasın diye)
    password: string | null;
    setPassword: (p: string) => void;

    getNextPageOfContents: () => Promise<void>;
    hasMore: boolean;
    isFetchingNextPage: boolean;
} | null>(null);

export const useVault = (options?: { withContent?: boolean }) => {
    const context = useContext(VaultContext);
    if (!context) {
        throw new Error("useVault must be used within VaultContextProvider");
    }
    return context;
};

export const VaultContextProvider = ({
    children,
    vaultId,
}: {
    children: React.ReactNode;
    vaultId: string;
}) => {
    const [isChecking, setIsChecking] = useState(true);

    // 'password' state'ini 'masterKey' olarak değiştirdik
    const [masterKey, setMasterKey] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);
    const [contents, setContents] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isPrimaryOwner, setIsPrimaryOwner] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const checkedVaultIdRef = useRef<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (vaultId !== checkedVaultIdRef.current) {
            setIsChecking(true);
            setIsLoading(true);
            setData(null);
            setContents([]);
            setMasterKey(null); // Sıfırla
            setError(null);
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [vaultId]);

    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const getNextPageOfContents = useCallback(async () => {
        if (!vaultId || isFetchingNextPage || !hasMore) return;

        setIsFetchingNextPage(true);

        try {
            const res = await api.get(
                `/vaults/${vaultId}/contents?page=${currentPage + 1}`,
            );
            if (res.data?.success) {
                setContents((prev) => [...prev, ...res.data.data.data]);
                setHasMore(res.data?.data?.hasMore);
                setCurrentPage((prev) => prev + 1);
            }
        } catch (error: any) {
            console.error("Fetch error:", error);
        } finally {
            setIsFetchingNextPage(false);
        }
    }, [vaultId, currentPage, isFetchingNextPage, hasMore]);

    const fetchVault = useCallback(
        async (type: "vault" | "contents" | "all" = "all") => {
            if (!vaultId) return;

            if (abortControllerRef.current) abortControllerRef.current.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                const requests = [];
                if (type === "vault" || type === "all") {
                    requests.push(
                        api.get(`/vaults/${vaultId}`, {
                            signal: controller.signal,
                        }),
                    );
                } else {
                    requests.push(Promise.resolve(null));
                }

                if (type === "contents" || type === "all") {
                    requests.push(
                        api.get(`/vaults/${vaultId}/contents`, {
                            signal: controller.signal,
                        }),
                    );
                } else {
                    requests.push(Promise.resolve(null));
                }

                // has-member kontrolü
                requests.push(
                    api.get(`/vaults/${vaultId}/has-member`, {
                        signal: controller.signal,
                    }),
                );

                const [vaultResponse, contentsResponse, isMemberResponse] =
                    await Promise.all(requests);

                if (vaultResponse) setData(vaultResponse.data?.data);
                if (contentsResponse) {
                    setContents(contentsResponse.data?.data?.data);
                    setHasMore(contentsResponse.data?.data?.hasMore ?? true);
                    setCurrentPage(1);
                }
                if (isMemberResponse) {
                    setIsMember(isMemberResponse.data?.data?.isMember);
                    setIsPrimaryOwner(
                        isMemberResponse.data?.data?.isPrimaryOwner,
                    );
                }
            } catch (error: any) {
                if (
                    error.name !== "CanceledError" &&
                    error.code !== "ERR_CANCELED"
                ) {
                    console.error("Fetch error:", error);
                    setError(error);
                }
            } finally {
                setIsLoading(false);
                setRefreshing(false);
            }
        },
        [vaultId],
    );

    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            if (!vaultId) {
                setIsChecking(false);
                return;
            }

            if (checkedVaultIdRef.current === vaultId && data) {
                setIsChecking(false);
                return;
            }

            try {
                const res = await api.get(`/vaults/${vaultId}/is-encrypted`);
                if (!isMounted) return;

                const isVaultEncrypted = res.data;
                const isOnPasswordPage = pathname.includes("password");

                // Logic Değişikliği: masterKey yoksa şifre ekranına at
                if (!masterKey && !isOnPasswordPage && isVaultEncrypted) {
                    router.replace(`/vaults/${vaultId}/password`);
                    setIsChecking(false);
                    setIsLoading(false);
                    checkedVaultIdRef.current = vaultId;
                    return;
                } else if (masterKey && isOnPasswordPage && !isVaultEncrypted) {
                    router.replace(`/vaults/${vaultId}`);
                }

                setIsChecking(false);
                await fetchVault("all");

                checkedVaultIdRef.current = vaultId;
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError(err);
                    setIsChecking(false);
                    setIsLoading(false);
                }
            }
        };

        initialize();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vaultId, masterKey]); // password yerine masterKey bağımlılığı

    useEffect(() => {
        if (isLoading || !data || masterKey) return;
        const isOnPasswordPage = pathname.includes("password");
        const isVaultEncrypted = data.isEncrypted; // data.is_encrypted snake_case olabilir, kontrol edin

        if (isVaultEncrypted && !masterKey && !isOnPasswordPage) {
            router.replace(`/vaults/${vaultId}/password`);
        }
    }, [pathname, data, isLoading, masterKey, vaultId]);

    const refetch = (type?: "vault" | "contents" | "all") => {
        setRefreshing(true);
        return fetchVault(type);
    };

    return (
        <VaultContext.Provider
            value={{
                vaultId,

                // Yeni değerler
                masterKey,
                setMasterKey,

                // Uyumluluk (password isteyen eski komponentler için)
                password: masterKey,
                setPassword: setMasterKey,

                data,
                isLoading,
                error,
                contents,
                refetch,
                refreshing,
                isMember,
                isPrimaryOwner,
                lockVault: () => {
                    setMasterKey(null);
                    clearSensitiveCache();
                    refetch("vault");
                    router.replace(`/vaults/${vaultId}/password`);
                },
                getNextPageOfContents,
                hasMore,
                isFetchingNextPage,
            }}
        >
            {isChecking || (isLoading && !data && !error) ? (
                <Loading />
            ) : (
                children
            )}
        </VaultContext.Provider>
    );
};
