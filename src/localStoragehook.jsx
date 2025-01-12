import React, {useState, useEffect} from "react";

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const storedvalue = localStorage.getItem(key);
        return storedvalue ? JSON.parse(storedvalue) : initialValue;
    });
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

export default useLocalStorage