import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Vault = {
    id: string;
    title: string;
    mediaCount: number;
    year: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    iconColor: string;
    isEncrypted: boolean;
};

export const useVaults = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [error, setError] = useState<string | null>(null);

    const refetch = async () => {
        setError(null);
        await api
            .get("/vaults")
            .then((response) => setVaults(response.data.data))
            .catch((error) => setError(error.response.data.data))
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        refetch();
    }, []);

    return {
        vaults,
        isLoading,
        error,
        refetch,
    };
};
