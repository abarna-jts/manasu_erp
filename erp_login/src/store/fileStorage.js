export const saveFiles = (type, files) => {
    try {
        const filesData = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            preview: file.preview  // This is a string URL, so it's serializable
        }));
        localStorage.setItem(type, JSON.stringify(filesData));
    } catch (error) {
        console.error("Error saving files", error);
    }
};

export const loadFiles = (type) => {
    try {
        const data = localStorage.getItem(type);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading files", error);
        return [];
    }
};

export const clearFiles = (type) => {
    try {
        localStorage.removeItem(type);
    } catch (error) {
        console.error("Error clearing files", error);
    }
};
