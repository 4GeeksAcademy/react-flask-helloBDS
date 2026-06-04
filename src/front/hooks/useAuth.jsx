import { useMemo } from "react";

const TOKEN_KEY = "token";

export const auth = {
    getToken() {
        return typeof window !== "undefined" ? window.sessionStorage.getItem(TOKEN_KEY) : null;
    },
    setToken(token) {
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem(TOKEN_KEY, token);
        }
    },
    clearToken() {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(TOKEN_KEY);
        }
    },
    isAuthenticated() {
        return Boolean(this.getToken());
    }
};

export function useAuth() {
    return useMemo(() => auth, []);
}
