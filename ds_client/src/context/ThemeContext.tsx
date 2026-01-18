import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({children}:{ children: React.ReactNode })=> {
    const [dark, setDark] = useState(
        localStorage.getItem("theme")==="dark"
    );

    useEffect(()=>{
        document.documentElement.classList.toggle("dark",dark);
        localStorage.setItem("theme",dark? "dark":"light");
    },[dark])

    return(
        <ThemeContext.Provider value={{dark, setDark}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = ()=> {
    const context = useContext(ThemeContext);
    if (!context){
        throw new Error("useTheme must be within a ThemeProvider");
    }
    return context;
}