import { createContext, useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface User {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    profile_photo?: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (data: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }) => Promise<void>;

    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (username: string, password: string) => {
        const response = await api.post("/accounts/login/", {
            username,
            password
        });
       
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        console.log("Login token :", token)
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        alert("Login was successful");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        navigate("/");

        alert("User logged out successfully");        
    };

    const register = async (data: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }) => {
        await api.post("/accounts/register/", data)
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        const token = localStorage.getItem("token");
        console.log("Change password token :", token)

        await api.post(
            "/accounts/change-password/",
            {
                old_password: oldPassword,
                new_password: newPassword,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        alert("Password updated successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, changePassword}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};