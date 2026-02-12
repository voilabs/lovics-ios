import { User } from "better-auth";
import { useRouter } from "expo-router";
import { createContext, useContext, useMemo } from "react";
import { authClient } from "../lib/auth-client";
import { Encrypter } from "../lib/encrypter"; // Encrypter'ı import ettik
import { useTranslation } from "react-i18next";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    handleSignIn: (email: string, password: string) => Promise<string | void>;
    handleSignUp: (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => Promise<{ input: string; message: string } | void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    handleSignIn: async () => Promise.resolve(),
    handleSignUp: async () => Promise.resolve(),
});

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { t } = useTranslation();
    const {
        data: user,
        isPending,
        isRefetching,
        error,
        refetch,
    } = authClient.useSession();
    const router = useRouter();

    const handleSignIn = async (email: string, password: string) => {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) return t(`onboarding.errors.${error.code || "UNKNOWN"}`);

        if (data) router.replace("/(app)");
    };

    const handleSignUp = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => {
        try {
            const { data, error } = await authClient.signUp.email({
                name: `${firstName}:${lastName}`,
                email,
                password,
            } as any);

            const fieldBasedErrors = {
                email: ["USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"],
                password: ["PASSWORD_TOO_SHORT"],
            };

            const detectedField = Object.keys(fieldBasedErrors).find((key) =>
                fieldBasedErrors[key as keyof typeof fieldBasedErrors].includes(
                    error.code,
                ),
            );

            if (error)
                return {
                    input: detectedField || "",
                    message: t(`onboarding.errors.${error.code || "UNKNOWN"}`),
                };

            if (data) router.replace("/(app)");
        } catch (e) {
            console.error("Sign up crypto error:", e);
            return {
                input: "",
                message: t("onboarding.errors.UNKNOWN"),
            };
        }
    };

    const data = useMemo(() => {
        return {
            user: user?.user || null,
            isLoading: isPending || isRefetching,
            handleSignIn,
            handleSignUp,
        };
    }, [user, isPending, isRefetching, handleSignIn, handleSignUp]);
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
