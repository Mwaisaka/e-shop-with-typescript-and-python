import { useSearchParams } from "react-router-dom";


export function useSearchQuery() {
  const [params, setParams] = useSearchParams();

  const getNumber = (key: string, defaultValue: number) => {
    const value = params.get(key);
    return value ? Number(value) : defaultValue;
  };

  const setQuery = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(params);

    if (value === "" || value === 0 || value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }

    //Reset page when filters change
    if (key !== "page") {
      newParams.delete("page");
    }
    setParams(newParams, { replace: true });
  };

  return {
    q: params.get("q") || "",
    category: params.get("category") || "",
    maxPrice: getNumber("maxPrice", 500000),
    rating: getNumber("rating", 0),
    page: Number(params.get("page") || 1),
    setQuery,
  };
}
