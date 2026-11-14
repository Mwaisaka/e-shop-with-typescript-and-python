
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
    const { dark, setDark } = useTheme();

    return (
        <button
            onClick={() => setDark(prev => !prev)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            {dark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
}
