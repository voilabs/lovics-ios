import { db } from "@/drizzle";
import { vaultMembersTable, vaultsTable } from "@/drizzle/schemas/vaults";
import { createRoute } from "@/lib/createRoute";
import { t } from "elysia";
import { eq, and } from "drizzle-orm";
import { user } from "@/drizzle/schema";

export default createRoute(
    {
        prefix: "/vaults/:id",
    },
    (app) => {
        app.post(
            "/members",
            async ({ user: currentUser, params, body, res }) => {
                try {
                    const [vault] = await db
                        .select({
                            isEncrypted: vaultsTable.isEncrypted,
                        })
                        .from(vaultsTable)
                        .where(eq(vaultsTable.id, params.id))
                        .limit(1)
                        .catch(() => []);

                    if (!vault) return res.error("NOT_FOUND", 404);

                    const [isMember] = await db
                        .select()
                        .from(vaultMembersTable)
                        .where(
                            and(
                                eq(vaultMembersTable.vaultId, params.id),
                                eq(vaultMembersTable.userId, currentUser.id),
                            ),
                        )
                        .limit(1);

                    if (!isMember) {
                        return res.error("UNAUTHORIZED", 401);
                    }

                    const [targetUser] = await db
                        .select()
                        .from(user)
                        .where(eq(user.email, body.email))
                        .limit(1);

                    if (!targetUser) return res.error("NOT_FOUND", 404);

                    const [existing] = await db
                        .select()
                        .from(vaultMembersTable)
                        .where(
                            and(
                                eq(vaultMembersTable.vaultId, params.id),
                                eq(vaultMembersTable.userId, targetUser.id),
                            ),
                        )
                        .limit(1);

                    if (existing) return res.error("ALREADY_MEMBER", 400);

                    await db.insert(vaultMembersTable).values({
                        vaultId: params.id,
                        userId: targetUser.id,
                        encryptedVaultKey: vault.isEncrypted
                            ? body.encryptedVaultKey! // We assume it's provided if encrypted, validated by schema? schema is optional though.
                            : "",
                        salt: vault.isEncrypted ? body.salt! : "",
                        primaryOwner: false,
                    });

                    return res.success({ success: true });
                } catch (error) {
                    console.error("Invite Member Error:", error);
                    return res.error("INTERNAL_ERROR", 500);
                }
            },
            {
                params: t.Object({
                    id: t.String(),
                }),
                body: t.Object({
                    email: t.String(),
                    encryptedVaultKey: t.Optional(t.String()),
                    salt: t.Optional(t.String()),
                }),
                auth: true,
            },
        );

        app.get(
            "/members",
            async ({ user: currentUser, params, res }) => {
                try {
                    const [membership] = await db
                        .select()
                        .from(vaultMembersTable)
                        .where(
                            and(
                                eq(vaultMembersTable.vaultId, params.id),
                                eq(vaultMembersTable.userId, currentUser.id),
                                eq(vaultMembersTable.primaryOwner, true),
                            ),
                        )
                        .limit(1)
                        .catch(() => []);

                    if (!membership) {
                        return res.error("UNAUTHORIZED", 401);
                    }

                    const members = await db
                        .select({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            primaryOwner: vaultMembersTable.primaryOwner,
                            joinedAt: vaultMembersTable.id,
                        })
                        .from(vaultMembersTable)
                        .innerJoin(user, eq(vaultMembersTable.userId, user.id))
                        .where(eq(vaultMembersTable.vaultId, params.id))
                        .catch(() => []);

                    return res.success(members);
                } catch (error) {
                    console.error("Get Members Error:", error);
                    return res.error("INTERNAL_ERROR", 500);
                }
            },
            {
                params: t.Object({
                    id: t.String(),
                }),
                auth: true,
            },
        );

        app.delete(
            "/members/:userId",
            async ({ user: currentUser, params, res }) => {
                try {
                    // Check if current user is primary owner
                    const [membership] = await db
                        .select()
                        .from(vaultMembersTable)
                        .where(
                            and(
                                eq(vaultMembersTable.vaultId, params.id),
                                eq(vaultMembersTable.userId, currentUser.id),
                                eq(vaultMembersTable.primaryOwner, true),
                            ),
                        )
                        .limit(1);

                    if (!membership) {
                        return res.error("UNAUTHORIZED", 401);
                    }

                    // Prevent removing self (optional, but good practice usually)
                    if (currentUser.id === params.userId) {
                        return res.error("CANNOT_REMOVE_SELF", 400);
                    }

                    await db
                        .delete(vaultMembersTable)
                        .where(
                            and(
                                eq(vaultMembersTable.vaultId, params.id),
                                eq(vaultMembersTable.userId, params.userId),
                            ),
                        );

                    return res.success({ success: true });
                } catch (error) {
                    console.error("Remove Member Error:", error);
                    return res.error("INTERNAL_ERROR", 500);
                }
            },
            {
                params: t.Object({
                    id: t.String(),
                    userId: t.String(),
                }),
                auth: true,
            },
        );
    },
);
