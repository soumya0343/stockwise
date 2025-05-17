export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const generateRandomId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const isEmpty = (value: any): boolean => {
    return value === null || value === undefined || value === '';
};