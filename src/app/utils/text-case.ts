export const dirCase = (text: string): string => text.replace(/\s/g, "_");

export const displayCase = (text: string): string => text.replace(/_/g, " ");
