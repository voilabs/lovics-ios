import { db } from "@/drizzle";
import { vaultMembersTable, vaultsTable } from "@/drizzle/schema"; // Şema yolunuzun doğru olduğundan emin olun (örn: @/drizzle/schemas/vaults)
import { createRoute } from "@/lib/createRoute";
import { t } from "elysia";

export default createRoute(
    {
        prefix: "/vaults",
    },
    (app) => {
        app.post(
            "/",
            async ({ user, body, res }) => {
                try {
                    const result = await db.transaction(async (tx) => {
                        const [newVault] = await tx
                            .insert(vaultsTable)
                            .values({
                                title: body.title,
                                icon: body.icon,
                                color: body.color,
                                theme: body.theme,
                                isEncrypted: body.isEncrypted,
                                isPremium: false,
                            })
                            .returning({
                                id: vaultsTable.id,
                                title: vaultsTable.title,
                                icon: vaultsTable.icon,
                                color: vaultsTable.color,
                                theme: vaultsTable.theme,
                                isEncrypted: vaultsTable.isEncrypted,
                                isPremium: vaultsTable.isPremium,
                            })
                            .catch((err) => {
                                console.error("Vault Insert Error:", err);
                                return [];
                            });

                        if (!newVault) {
                            throw new Error("VAULT_CREATE_FAILED");
                        }

                        await tx.insert(vaultMembersTable).values({
                            vaultId: newVault.id,
                            userId: user.id,
                            encryptedVaultKey: body.isEncrypted
                                ? body.encryptedVaultKey!
                                : "",
                            salt: body.isEncrypted ? body.salt! : "",
                            primaryOwner: true,
                        });

                        return newVault;
                    });

                    return res.success(result);
                } catch (error) {
                    console.error("Create Vault Error:", error);
                    return res.error("VAULT_CREATE_FAILED", 500);
                }
            },
            {
                body: t.Object({
                    title: t.String({ minLength: 1, maxLength: 255 }),
                    icon: t.String({ minLength: 1, maxLength: 255 }),
                    color: t.String({ minLength: 1, maxLength: 255 }),
                    theme: t.String({ minLength: 1, maxLength: 255 }),
                    isEncrypted: t.Boolean(),

                    // İstemci (Frontend) tarafında üretilen şifreli veriler
                    // Encrypter.encryptKeyWithNewPassword() fonksiyonundan gelir
                    encryptedVaultKey: t.Optional(t.String()),
                    salt: t.Optional(t.String()),
                }),
                auth: true,
            },
        );
    },
);
