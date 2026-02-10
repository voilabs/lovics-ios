import { db } from "@/drizzle";
import { vaultsTable, vaultMembersTable } from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { eq, and } from "drizzle-orm";
import { t } from "elysia";

export default createRoute(
    {
        prefix: "/vaults",
    },
    (app) => {
        app.put(
            "/:id",
            async ({ user, body, params, res }) => {
                const { id } = params;

                // 1. Yetki Kontrolü: Kullanıcı bu kasanın üyesi mi?
                const [membership] = await db
                    .select()
                    .from(vaultMembersTable)
                    .where(
                        and(
                            eq(vaultMembersTable.userId, user.id),
                            eq(vaultMembersTable.vaultId, id),
                        ),
                    )
                    .limit(1);

                if (!membership) {
                    return res.error("UNAUTHORIZED", 401);
                }

                const updatedVault = await db.transaction(async (tx) => {
                    const [vault] = await tx
                        .update(vaultsTable)
                        .set({
                            title: body.title,
                            icon: body.icon,
                            color: body.color,
                            theme: body.theme,
                            updatedAt: new Date(),
                        })
                        .where(eq(vaultsTable.id, id))
                        .returning();

                    if (body.encryptedVaultKey && body.salt) {
                        await tx
                            .update(vaultMembersTable)
                            .set({
                                encryptedVaultKey: body.encryptedVaultKey,
                                salt: body.salt,
                            })
                            .where(
                                and(
                                    eq(vaultMembersTable.vaultId, id),
                                    eq(vaultMembersTable.userId, user.id),
                                ),
                            );
                    }

                    return vault;
                });

                if (!updatedVault) {
                    return res.error("VAULT_UPDATE_FAILED", 500);
                }

                return res.success(updatedVault);
            },
            {
                params: t.Object({
                    id: t.String(),
                }),
                body: t.Object({
                    // Meta veri güncellemeleri
                    title: t.Optional(
                        t.String({ minLength: 1, maxLength: 255 }),
                    ),
                    icon: t.Optional(
                        t.String({ minLength: 1, maxLength: 255 }),
                    ),
                    color: t.Optional(
                        t.String({ minLength: 1, maxLength: 255 }),
                    ),
                    theme: t.Optional(
                        t.String({ minLength: 1, maxLength: 255 }),
                    ),
                    // Güvenlik güncellemeleri (Üyeye özel)
                    encryptedVaultKey: t.Optional(
                        t.String({ minLength: 1 }), // wrappedKey yerine bunu kullanıyoruz
                    ),
                    salt: t.Optional(
                        t.String({ minLength: 1, maxLength: 255 }),
                    ),
                }),
                auth: true,
            },
        );
    },
);
