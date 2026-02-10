import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as VideoThumbnails from "expo-video-thumbnails";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";
import { decryptionQueue } from "@/lib/queue";
import { useVault } from "@/context/vault";
import { Encrypter } from "@/lib/encrypter";

interface UseContentProps {
    src?: string;
    path: string;
    mimeType?: string;
    ivHex?: string;
    noThumbnail?: boolean;
}

interface UseContentResult {
    uri: string | null;
    loading: boolean;
    error: Error | null;
    decryptedMimeType: string | null;
    fileUri: string | null;
}

export const useContent = ({
    src,
    path,
    mimeType: initialMimeType,
    ivHex,
    noThumbnail,
}: UseContentProps): UseContentResult => {
    const { masterKey, data: vault } = useVault();

    const [uri, setUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [decryptedMimeType, setDecryptedMimeType] = useState<string | null>(
        null,
    );
    const [fileUri, setFileUri] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        let isCancelled = false;

        const cleanFileName = path.replace(/[^a-zA-Z0-9]/g, "_");
        const cacheFilePath = `${RNFS.CachesDirectoryPath}/dec_${cleanFileName}`;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!vault?.isEncrypted) {
                    if (isMounted) {
                        setUri(src || null);
                        setFileUri(src || null);
                        setDecryptedMimeType(initialMimeType || null);
                        setLoading(false);
                    }
                    return;
                }

                if (!masterKey || !src || !ivHex) {
                    if (isMounted) setLoading(false);
                    return;
                }
                const encrypter = Encrypter.fromMasterKey(masterKey);
                const realMimeType = initialMimeType
                    ? encrypter.decryptText(initialMimeType)
                    : null;

                if (isMounted) setDecryptedMimeType(realMimeType);

                const isVideo = realMimeType?.startsWith("video");
                const finalPathWithExt = `${cacheFilePath}.${isVideo ? "mp4" : "jpg"}`;

                if (await RNFS.exists(finalPathWithExt)) {
                    if (isMounted) {
                        const finalUri = `file://${finalPathWithExt}`;
                        setUri(finalUri);
                        setFileUri(finalUri);
                        setLoading(false);
                    }
                    return;
                }

                await decryptionQueue.add(async () => {
                    if (isCancelled || !isMounted) return;

                    if (await RNFS.exists(finalPathWithExt)) {
                        if (isMounted) {
                            const finalUri = `file://${finalPathWithExt}`;
                            setUri(finalUri);
                            setFileUri(finalUri);
                            setLoading(false);
                        }
                        return;
                    }

                    const tempEncryptedPath = `${RNFS.CachesDirectoryPath}/temp_${cleanFileName}.enc`;

                    try {
                        const downloadRes = await FileSystem.downloadAsync(
                            src,
                            `file://${tempEncryptedPath}`,
                        );

                        if (downloadRes.status !== 200) {
                            throw new Error(
                                `Download failed: ${downloadRes.status}`,
                            );
                        }

                        if (isCancelled || !isMounted) return;

                        const stream = encrypter.createDecryptionStream(ivHex);

                        const fileStats = await RNFS.stat(tempEncryptedPath);
                        const fileSize = +fileStats.size;
                        let position = 0;
                        const chunkSize = 512 * 1024;

                        if (await RNFS.exists(finalPathWithExt)) {
                            await RNFS.unlink(finalPathWithExt);
                        }

                        while (position < fileSize) {
                            if (isCancelled || !isMounted) break;

                            const chunkBase64 = await RNFS.read(
                                tempEncryptedPath,
                                chunkSize,
                                position,
                                "base64",
                            );
                            const chunkBuffer = Buffer.from(
                                chunkBase64,
                                "base64",
                            );

                            const decryptedBuffer = stream.update(chunkBuffer);

                            if (decryptedBuffer.length > 0) {
                                await RNFS.appendFile(
                                    finalPathWithExt,
                                    decryptedBuffer.toString("base64"),
                                    "base64",
                                );
                            }

                            position += chunkSize;
                        }

                        if (!isCancelled && isMounted) {
                            const finalBuffer = stream.final();
                            if (finalBuffer.length > 0) {
                                await RNFS.appendFile(
                                    finalPathWithExt,
                                    finalBuffer.toString("base64"),
                                    "base64",
                                );
                            }

                            const finalFileUri = `file://${finalPathWithExt}`;

                            if (isVideo) {
                                try {
                                    if (noThumbnail) {
                                        setUri(finalFileUri);
                                        setFileUri(finalFileUri);
                                        return;
                                    }
                                    const { uri: thumbUri } =
                                        await VideoThumbnails.getThumbnailAsync(
                                            finalFileUri,
                                        );
                                    setUri(thumbUri);
                                    setFileUri(finalFileUri);
                                } catch (e) {
                                    console.warn(
                                        "Thumbnail failed, creating fallback",
                                        e,
                                    );
                                    setUri(finalFileUri);
                                    setFileUri(finalFileUri);
                                }
                            } else {
                                setUri(finalFileUri);
                                setFileUri(finalFileUri);
                            }
                        }
                    } catch (e: any) {
                        console.error("Decryption Stream Error:", e);
                        if (isMounted) setError(e);
                        await RNFS.unlink(finalPathWithExt).catch(() => {});
                    } finally {
                        await RNFS.unlink(tempEncryptedPath).catch(() => {});
                        if (isMounted) setLoading(false);
                    }
                });
            } catch (e: any) {
                console.error("General Error in useContent:", e);
                if (isMounted) {
                    setError(e);
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
            isCancelled = true;
        };
    }, [path, masterKey, vault?.isEncrypted, src, ivHex, initialMimeType]);

    return {
        uri,
        loading,
        error,
        decryptedMimeType,
        fileUri,
    };
};
