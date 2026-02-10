import QuickCrypto from "react-native-quick-crypto";
import { Buffer } from "buffer";

export class Encrypter {
    private kek: any | null = null;
    private dek: any | null = null;

    private salt: string | null = null;
    private iterations: number = 310_000;

    constructor(password: string | null = null, existingSaltHex?: string) {
        if (password) {
            let saltBuffer: any;

            if (existingSaltHex) {
                this.salt = existingSaltHex;
                saltBuffer = Buffer.from(existingSaltHex, "hex");
            } else {
                saltBuffer = QuickCrypto.randomBytes(16);
                this.salt = saltBuffer.toString("hex");
            }
            this.kek = QuickCrypto.pbkdf2Sync(
                password,
                saltBuffer,
                this.iterations,
                32,
                "SHA-256",
            );
        }
    }
    static fromMasterKey(masterKeyHex: string): Encrypter {
        const instance = new Encrypter();
        instance.dek = Buffer.from(masterKeyHex, "hex");
        return instance;
    }

    static encryptKeyWithNewPassword(
        rawMasterKeyHex: string,
        invitePassword: string,
    ): {
        encryptedKey: string;
        salt: string;
    } {
        const saltBuffer = QuickCrypto.randomBytes(16);
        const salt = saltBuffer.toString("hex");

        const tempKek = QuickCrypto.pbkdf2Sync(
            invitePassword,
            saltBuffer,
            310_000,
            32,
            "SHA-256",
        );

        const iv = QuickCrypto.randomBytes(12);
        const cipher = QuickCrypto.createCipheriv("aes-256-gcm", tempKek, iv);

        const masterKeyBuffer = Buffer.from(rawMasterKeyHex, "hex");

        const encrypted = Buffer.concat([
            cipher.update(masterKeyBuffer),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();
        const finalBuffer = Buffer.concat([encrypted, authTag]);

        const encryptedKey = `${Buffer.from(iv).toString("hex")}:${finalBuffer.toString("base64")}`;

        return {
            encryptedKey,
            salt,
        };
    }

    getRawMasterKey(): string {
        if (!this.dek) throw new Error("Kasa kilitli, anahtar paylaşılamaz!");
        return this.dek.toString("hex");
    }

    getSalt(): string | null {
        return this.salt;
    }

    generateMasterKey(): { wrappedKey: string; masterKeyHex: string } {
        if (!this.kek)
            throw new Error("Master Key oluşturmak için parola gereklidir.");

        const masterKey = QuickCrypto.randomBytes(32) as any;
        this.dek = masterKey;

        const wrappedKey = this.wrapKey(masterKey);

        return {
            wrappedKey,
            masterKeyHex: masterKey.toString("hex"),
        };
    }

    unlockVault(wrappedKey: string): boolean {
        if (!this.kek || !wrappedKey) return false;
        try {
            const masterKey = this.unwrapKey(wrappedKey);
            this.dek = masterKey;
            return true;
        } catch (e) {
            console.error(
                "Vault unlock failed (Wrong password or corrupted key):",
                e,
            );
            return false;
        }
    }

    reWrapMasterKey(newPassword: string): {
        newWrappedKey: string;
        newSalt: string;
    } {
        if (!this.dek)
            throw new Error(
                "Şifre değiştirmek için kasa açık (unlocked) olmalıdır!",
            );

        const newSaltBuffer = QuickCrypto.randomBytes(16);
        const newSalt = newSaltBuffer.toString("hex");

        const newKek = QuickCrypto.pbkdf2Sync(
            newPassword,
            newSaltBuffer,
            this.iterations,
            32,
            "SHA-256",
        );

        const iv = QuickCrypto.randomBytes(12);
        const cipher = QuickCrypto.createCipheriv("aes-256-gcm", newKek, iv);

        const encrypted = Buffer.concat([
            cipher.update(this.dek),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();
        const finalBuffer = Buffer.concat([encrypted, authTag]);

        const newWrappedKey = `${Buffer.from(iv).toString("hex")}:${finalBuffer.toString("base64")}`;

        return {
            newWrappedKey,
            newSalt,
        };
    }

    encryptPassword(data: string): string {
        if (!this.kek || !data) return data;
        try {
            const hash = QuickCrypto.createHash("sha256").update(data).digest();
            const iv = hash.subarray(0, 16);

            const cipher = QuickCrypto.createCipheriv(
                "aes-256-cbc",
                this.kek,
                iv,
            );

            let encrypted = cipher.update(data, "utf8", "base64");
            encrypted += cipher.final("base64");

            return encrypted;
        } catch (error) {
            console.error("Auth Encryption Error:", error);
            throw new Error("AUTH_ENCRYPTION_FAILED");
        }
    }

    encryptFile(fileBuffer: Buffer): {
        encryptedBase64: string;
        ivHex: string;
    } {
        if (!this.dek) throw new Error("Kasa kilitli! (DEK eksik)");

        try {
            const iv = QuickCrypto.randomBytes(12);
            const cipher = QuickCrypto.createCipheriv(
                "aes-256-gcm",
                this.dek,
                iv,
            );

            const encrypted = Buffer.concat([
                cipher.update(fileBuffer),
                cipher.final(),
            ]);

            const authTag = cipher.getAuthTag();
            const finalBuffer = Buffer.concat([encrypted, authTag]);

            return {
                encryptedBase64: finalBuffer.toString("base64"),
                ivHex: Buffer.from(iv).toString("hex"),
            };
        } catch (e) {
            console.error("GCM Encryption Failed:", e);
            throw new Error("ENCRYPTION_FAILED");
        }
    }

    decryptFile(encryptedBuffer: Buffer, ivHex: string): string {
        if (!this.dek) throw new Error("Kasa kilitli! (DEK eksik)");

        if (!ivHex || typeof ivHex !== "string") {
            throw new Error("Geçersiz IV formatı");
        }

        try {
            const iv = Buffer.from(ivHex, "hex");
            const authTagLength = 16;

            if (encryptedBuffer.length < authTagLength) {
                throw new Error("Buffer too short");
            }

            const authTag = encryptedBuffer.subarray(
                encryptedBuffer.length - authTagLength,
            );
            const ciphertext = encryptedBuffer.subarray(
                0,
                encryptedBuffer.length - authTagLength,
            );

            const decipher = QuickCrypto.createDecipheriv(
                "aes-256-gcm",
                this.dek,
                iv,
            );

            decipher.setAuthTag(authTag as any);

            const decrypted = Buffer.concat([
                decipher.update(ciphertext),
                decipher.final(),
            ]);

            return decrypted.toString("base64");
        } catch (e) {
            console.error("GCM Decryption Failed (Integrity Check):", e);
            throw new Error("DECRYPTION_FAILED_OR_TAMPERED");
        }
    }

    encryptText(text: string): string {
        if (!this.dek || !text) return text;
        const buffer = Buffer.from(text, "utf8");
        const { encryptedBase64, ivHex } = this.encryptFile(buffer);
        return `${ivHex}:${encryptedBase64}`;
    }

    decryptText(combinedText: string): string {
        if (!this.dek || !combinedText) return combinedText;
        const [ivHex, encryptedBase64] = combinedText.split(":");
        if (!ivHex || !encryptedBase64) return "";

        const buffer = Buffer.from(encryptedBase64, "base64");
        const decryptedBase64 = this.decryptFile(buffer, ivHex);
        return Buffer.from(decryptedBase64, "base64").toString("utf8");
    }

    startStreamEncryption(): {
        update: (buffer: Buffer) => string;
        final: () => string;
        ivHex: string;
    } {
        if (!this.dek) throw new Error("Kasa kilitli! (DEK eksik)");

        try {
            const iv = QuickCrypto.randomBytes(12);
            const cipher = QuickCrypto.createCipheriv(
                "aes-256-gcm",
                this.dek,
                iv,
            );

            return {
                ivHex: Buffer.from(iv).toString("hex"),
                update: (buffer: Buffer) => {
                    const encrypted = cipher.update(buffer);
                    return encrypted.toString("base64");
                },
                final: () => {
                    const finalEncrypted = cipher.final();
                    const authTag = cipher.getAuthTag();
                    const finalBuffer = Buffer.concat([
                        finalEncrypted,
                        authTag,
                    ]);
                    return finalBuffer.toString("base64");
                },
            };
        } catch (e) {
            console.error("Stream Encryption Failed:", e);
            throw new Error("STREAM_ENCRYPTION_FAILED");
        }
    }

    createDecryptionStream(ivHex: string): any {
        if (!this.dek) throw new Error("Kasa kilitli! (DEK eksik)");

        const iv = Buffer.from(ivHex, "hex");
        const decipher = QuickCrypto.createDecipheriv(
            "aes-256-gcm",
            this.dek,
            iv,
        );
        const AUTH_TAG_LENGTH = 16;
        let bufferReserve = Buffer.alloc(0);

        return {
            update: (chunk: Buffer): any => {
                const total = Buffer.concat([bufferReserve, chunk]);

                if (total.length <= AUTH_TAG_LENGTH) {
                    bufferReserve = total;
                    return Buffer.alloc(0);
                }
                const toDecryptLength = total.length - AUTH_TAG_LENGTH;

                const ciphertext = total.subarray(0, toDecryptLength);
                bufferReserve = total.subarray(toDecryptLength);

                return decipher.update(ciphertext);
            },
            final: (): any => {
                if (bufferReserve.length !== AUTH_TAG_LENGTH) {
                    throw new Error(
                        "Stream tamamlandı ancak Auth Tag eksik veya bozuk.",
                    );
                }

                decipher.setAuthTag(bufferReserve as any);

                return decipher.final();
            },
        };
    }

    private wrapKey(keyToWrap: Buffer): string {
        if (!this.kek) throw new Error("KEK not initialized");

        const iv = QuickCrypto.randomBytes(12);
        const cipher = QuickCrypto.createCipheriv("aes-256-gcm", this.kek, iv);

        const encrypted = Buffer.concat([
            cipher.update(keyToWrap),
            cipher.final(),
        ]);

        const authTag = cipher.getAuthTag();
        const finalBuffer = Buffer.concat([encrypted, authTag]);

        return `${Buffer.from(iv).toString("hex")}:${finalBuffer.toString("base64")}`;
    }

    private unwrapKey(wrappedKeyStr: string): Buffer {
        if (!this.kek) throw new Error("KEK not initialized");

        const parts = wrappedKeyStr.split(":");
        if (parts.length !== 2) throw new Error("Invalid wrapped key format");

        const [ivHex, encryptedBase64] = parts;
        const iv = Buffer.from(ivHex, "hex");
        const encryptedBuffer = Buffer.from(encryptedBase64, "base64");

        const authTagLength = 16;
        const authTag = encryptedBuffer.subarray(
            encryptedBuffer.length - authTagLength,
        );
        const ciphertext = encryptedBuffer.subarray(
            0,
            encryptedBuffer.length - authTagLength,
        );

        const decipher = QuickCrypto.createDecipheriv(
            "aes-256-gcm",
            this.kek,
            iv,
        );
        decipher.setAuthTag(authTag as any);

        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }
}
