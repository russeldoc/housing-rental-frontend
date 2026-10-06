import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const user = await apiRequest("/auth/me");
                setAuthUser(user);
                setToken(savedToken);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                setAuthUser(null);
                setToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = (user, accessToken, refreshToken) => {
        localStorage.setItem("token", accessToken);

        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }

        setToken(accessToken);
        setAuthUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");

        setAuthUser(null);
        setToken(null);
    };

    const value = {
        authUser,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated: Boolean(authUser && token),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;