import {createContext, useContext, useState } from "react";
import api from "../api/axios";

interface User {
    username : string;
}

interface AuthContextType {
    user : User | null;
    login : (username : string, password: string) => Promise<void>;
    logout : ()=>void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: any) => {
    const [user, setUser] = useState<User|null>(null);
    
    const login = async(username:string, password:string) => {
        const response = await api.post("/auth/login/", {username, password});
        localStorage.setItem("token", response.data.token);
        alert("Login was successful")
        setUser({username});
    };

    const logout = () => {
        localStorage.removeItem("token");
        alert("User logged out successfully")
        setUser(null)
    };
    
    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};