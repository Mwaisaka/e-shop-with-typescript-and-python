import { useSearchParams } from "react-router-dom";

export function useSearchQuery(){
    const [params, setParams] = useSearchParams();

    const q = params.get("q") || "";
    const category = params.get("category") || "";

    const setQuery = (key: string, value: string) =>{
        const newParams = new URLSearchParams(params);

        if (value){
            newParams.set(key, value);
        }else{
            newParams.delete(key);
        }

        setParams(newParams, {replace: true});
    };

    return {q, category,setQuery};
};