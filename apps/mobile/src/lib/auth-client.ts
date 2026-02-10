import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "https://api.lovics.app",
    basePath: "/auth",
    plugins: [
        expoClient({
            scheme: "lovics",
            storagePrefix: "lovics",
            storage: SecureStore,
        }),
        emailOTPClient(),
    ],
});
