import { User } from "better-auth";
import { useRouter } from "expo-router";
import { createContext, useContext } from "react";
import { authClient } from "../lib/auth-client";
import { Encrypter } from "../lib/encrypter"; // Encrypter'ı import ettik

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    handleSignIn: (email: string, password: string) => Promise<string | void>;
    handleSignUp: (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => Promise<string | void>;
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

        if (error) return error.code;

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

            if (error) return error.code || error.message;

            if (data) router.replace("/(app)");
        } catch (e) {
            console.error("Sign up crypto error:", e);
            return "ENCRYPTION_ERROR";
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: user?.user || null,
                isLoading: isPending || isRefetching,
                handleSignIn,
                handleSignUp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
