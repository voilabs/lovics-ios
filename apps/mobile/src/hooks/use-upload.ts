import { api } from "@/lib/api";
import { useVault } from "@/context/vault";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { Encrypter } from "@/lib/encrypter";
import { Buffer } from "buffer";

type SelectedFile = {
    id: string;
    uri: string;
    type: "image" | "video" | "document";
    name: string;
    mimeType?: string;
    description?: string;
};

export const useUpload = () => {
    const router = useRouter();
    // ARTIK 'password' YERİNE 'masterKey' KULLANIYORUZ
    const { vaultId, masterKey, data: vault } = useVault();

    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [title, setTitle] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const updateFile = (id: string, updates: Partial<SelectedFile>) => {
        setSelectedFiles((prev) =>
            prev.map((file) =>
                file.id === id ? { ...file, ...updates } : file,
            ),
        );
    };

    const handleUpload = async () => {
        try {
            const isEncrypted = await api
                .get(`/vaults/${vaultId}/is-encrypted`)
                .then((res) => res.data);

            // GÜVENLİK KONTROLÜ: Kasa şifreliyse ve Master Key yoksa işlem yapma
            if (isEncrypted && !masterKey) {
                Alert.alert(
                    "Hata",
                    "Kasa kilitli. Dosya yüklemek için lütfen önce kasanın kilidini açın.",
                );
                return;
            }

            if (selectedFiles.length === 0)
                return Alert.alert("Uyarı", "Lütfen en az bir dosya seçin.");
            if (!title.trim()) return Alert.alert("Hata", "Başlık zorunludur.");

            setIsUploading(true);

            let encrypter: Encrypter | null = null;
            let finalTitle = title.trim();

            if (isEncrypted) {
                // MASTER KEY İLE ENCRYPTER BAŞLATMA
                // Not: Encrypter sınıfına 'static fromMasterKey' metodunu eklemiş olmalısınız.
                encrypter = Encrypter.fromMasterKey(masterKey!);

                // Başlığı şifrele
                finalTitle = encrypter.encryptText(finalTitle);
            }

            const uploadedContents: any[] = [];

            for (const file of selectedFiles) {
                try {
                    const fileInfo = await FileSystem.getInfoAsync(file.uri);
                    if (!fileInfo.exists) {
                        throw new Error("File does not exist");
                    }
                    const fileSize = fileInfo.size;
                    const CHUNK_SIZE = 5 * 1024 * 1024;
                    const totalParts = Math.ceil(fileSize / CHUNK_SIZE);

                    let uploadName = file.name;
                    let ivHex: string | undefined;
                    let finalDescription = file.description?.trim() || "";

                    if (isEncrypted && encrypter) {
                        uploadName = encrypter.encryptText(file.name);
                        finalDescription =
                            encrypter.encryptText(finalDescription);
                    }

                    // STREAM ENCRYPTION BAŞLAT
                    let streamEncrypter: ReturnType<
                        Encrypter["startStreamEncryption"]
                    > | null = null;

                    if (isEncrypted && encrypter) {
                        streamEncrypter = encrypter.startStreamEncryption();
                        ivHex = streamEncrypter.ivHex;
                    }

                    const initData = new FormData();
                    initData.append("fileName", uploadName);
                    if (isEncrypted) initData.append("encrypted", "true");
                    if (ivHex) initData.append("iv", ivHex);
                    initData.append(
                        "mimeType",
                        isEncrypted
                            ? "application/octet-stream"
                            : file.mimeType || "application/octet-stream",
                    );

                    const initRes = await api.post(
                        `/vaults/${vaultId}/contents?action=init`,
                        initData,
                    );

                    const { uploadId, key } = initRes.data.data;
                    const parts: { ETag: string; PartNumber: number }[] = [];

                    for (let i = 0; i < totalParts; i++) {
                        const start = i * CHUNK_SIZE;
                        const length = Math.min(CHUNK_SIZE, fileSize - start);

                        const chunkBase64 = await FileSystem.readAsStringAsync(
                            file.uri,
                            {
                                encoding: FileSystem.EncodingType.Base64,
                                position: start,
                                length: length,
                            },
                        );

                        let chunkUploadUri = "";
                        let tempChunkUri = "";

                        if (isEncrypted && streamEncrypter) {
                            const chunkBuffer = Buffer.from(
                                chunkBase64,
                                "base64",
                            );

                            // Parçayı şifrele
                            let encryptedChunkBase64 =
                                streamEncrypter.update(chunkBuffer);

                            if (i === totalParts - 1) {
                                // Son parçada auth tag ekle
                                const finalBlock = streamEncrypter.final();
                                if (!encryptedChunkBase64)
                                    encryptedChunkBase64 = finalBlock;
                                else {
                                    const b1 = Buffer.from(
                                        encryptedChunkBase64,
                                        "base64",
                                    );
                                    const b2 = Buffer.from(
                                        finalBlock,
                                        "base64",
                                    );
                                    encryptedChunkBase64 = Buffer.concat([
                                        b1,
                                        b2,
                                    ]).toString("base64");
                                }
                            }

                            tempChunkUri = `${FileSystem.cacheDirectory}chunk_${uploadId}_${i}.enc`;
                            await FileSystem.writeAsStringAsync(
                                tempChunkUri,
                                encryptedChunkBase64,
                                {
                                    encoding: FileSystem.EncodingType.Base64,
                                },
                            );
                            chunkUploadUri = tempChunkUri;
                        } else {
                            tempChunkUri = `${FileSystem.cacheDirectory}chunk_${uploadId}_${i}.tmp`;
                            await FileSystem.writeAsStringAsync(
                                tempChunkUri,
                                chunkBase64,
                                {
                                    encoding: FileSystem.EncodingType.Base64,
                                },
                            );
                            chunkUploadUri = tempChunkUri;
                        }

                        const presignedRes = await api.post(
                            `/vaults/${vaultId}/contents?action=part&uploadId=${uploadId}&key=${key}&partNumber=${i + 1}`,
                            new FormData(),
                        );
                        const { url } = presignedRes.data.data;

                        if (!url) {
                            throw new Error(
                                `Presigned URL is undefined. Response: ${JSON.stringify(presignedRes.data)}`,
                            );
                        }
                        if (!chunkUploadUri)
                            throw new Error("Chunk URI is undefined");

                        const s3UploadRes = await FileSystem.uploadAsync(
                            url,
                            chunkUploadUri,
                            {
                                httpMethod: "PUT",
                                uploadType:
                                    FileSystem.FileSystemUploadType
                                        .BINARY_CONTENT,
                                headers: {},
                            },
                        );

                        if (s3UploadRes.status !== 200) {
                            throw new Error(
                                `S3 Upload Failed for part ${i + 1}: ${s3UploadRes.status}`,
                            );
                        }

                        const etag =
                            s3UploadRes.headers["ETag"] ||
                            s3UploadRes.headers["etag"];

                        if (!etag) {
                            throw new Error(
                                `No ETag received from S3 for part ${i + 1}`,
                            );
                        }

                        const cleanETag = etag.replace(/"/g, "");

                        parts.push({
                            ETag: cleanETag,
                            PartNumber: i + 1,
                        });

                        await FileSystem.deleteAsync(tempChunkUri, {
                            idempotent: true,
                        });
                    }

                    const completeData = new FormData();
                    completeData.append("parts", JSON.stringify(parts));
                    completeData.append("fileName", uploadName);
                    completeData.append("totalSize", fileSize.toString());

                    if (finalDescription) {
                        completeData.append("description", finalDescription);
                    }

                    const originalMimeType =
                        file.mimeType || "application/octet-stream";
                    completeData.append(
                        "originalMimeType",
                        isEncrypted
                            ? encrypter!.encryptText(originalMimeType)
                            : originalMimeType,
                    );
                    if (ivHex) completeData.append("iv", ivHex);

                    const completeRes = await api.post(
                        `/vaults/${vaultId}/contents?action=complete&uploadId=${uploadId}&key=${key}`,
                        completeData,
                    );

                    const { file: fileMetadata } = completeRes.data.data;
                    uploadedContents.push(fileMetadata);
                } catch (innerError) {
                    console.error(
                        `Dosya yükleme hatası (${file.name}):`,
                        innerError,
                    );
                    throw innerError;
                }
            }

            if (uploadedContents.length > 0) {
                await api.post(`/vaults/${vaultId}/contents?action=create`, {
                    title: finalTitle,
                    description: "",
                    contents: uploadedContents,
                });
            }

            Alert.alert(
                "Başarılı",
                isEncrypted
                    ? "Dosyalar başarıyla şifrelendi ve yüklendi."
                    : "Dosyalar başarıyla yüklendi.",
            );
            router.back();
        } catch (error: any) {
            console.error("Genel Upload Hatası:", error);
            const msg =
                error?.response?.data?.message ||
                error.message ||
                "Bilinmeyen hata";
            Alert.alert("Hata", `Yükleme sırasında bir sorun oluştu: ${msg}`);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        selectedFiles,
        title,
        setTitle,
        isUploading,
        handleUpload,
        setSelectedFiles,
        updateFile,
    };
};
