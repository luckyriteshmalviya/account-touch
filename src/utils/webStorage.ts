export function useLocalStorage(key: string) {
    // State to store the value
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

