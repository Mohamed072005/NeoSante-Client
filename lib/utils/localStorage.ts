export const withLocalStorage = <T>(key: string) => {
    return {
        set: (value: T) => localStorage.setItem(key, JSON.stringify(value)),
        get: (): T | null => {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : null;
        },
        remove: () => localStorage.removeItem(key),
    };
};
