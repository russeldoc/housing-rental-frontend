import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        const savedUser = localStorage.getItem("authUser");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    // Login
    const login = (user, userToken) => {
        setAuthUser(user);
        setToken(userToken);

        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("token", userToken);
    };

    // Logout
    const logout = () => {
        setAuthUser(null);
        setToken(null);

        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
    };

    const value = {
        authUser,
        token,
        login,
        logout,
        isAuthenticated: !!authUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
export { AuthProvider };