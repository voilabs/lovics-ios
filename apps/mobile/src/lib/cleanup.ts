import { Directory, Paths, File } from "expo-file-system";

export const clearSensitiveCache = () => {
    try {
        const cacheDir = new Directory(Paths.cache);
        if (!cacheDir.exists) return;
        const contents = cacheDir.list();

        for (const item of contents) {
            if (item instanceof Directory && item.name === "uploads") {
                item.delete();
            }
            if (item instanceof File && item.name.endsWith(".enc")) {
                item.delete();
            }

            if (item.name.startsWith("tmp-") || item.name.includes(".tmp")) {
                item.delete();
            }
        }
    } catch (error) {
        console.warn("Cache temizleme uyarısı:", error);
    }
};
