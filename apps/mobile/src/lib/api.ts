import axios from "axios";
import { authClient } from "./auth-client";

export const api = axios.create({
    baseURL: "https://api.lovics.app",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        const cookie = authClient.getCookie();

        if (cookie) {
            config.headers.Cookie = cookie;
        }
        return config;
    },
    (error) => Promise.reject(error),
);
