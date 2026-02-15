import { useSearchParams } from "react-router-dom";

// export function useSearchQuery(){
//     const [params, setParams] = useSearchParams();

//     const q = params.get("q") || "";
//     const category = params.get("category") || "";

//     const setQuery = (key: string, value: string) =>{
//         const newParams = new URLSearchParams(params);

//         if (value){
//             newParams.set(key, value);
//         }else{
//             newParams.delete(key);
//         }

//         setParams(newParams, {replace: true});
//     };

//     return {q, category,setQuery};
// };

export function useSearchQuery() {
  const [params, setParams] = useSearchParams();

  // const q = params.get("q") || "";
  // const category = params.get("category") || "";

  const getNumber = (key: string, defaultValue: number) => {
    const value = params.get(key);
    return value ? Number(value) : defaultValue;
  };

  const setQuery = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(params);

    if (value === "" || value === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }

    setParams(newParams, { replace: true });
  };

  return {
    q: params.get("q") || "",
    category: params.get("category") || "",
    maxPrice: getNumber("maxPrice", 500000),
    rating: getNumber("rating", 0),
    setQuery,
  };
}
