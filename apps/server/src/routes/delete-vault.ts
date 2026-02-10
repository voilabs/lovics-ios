import { db } from "@/drizzle";
import {
    vaultsTable,
    vaultMembersTable,
    vaultContentsTable,
    favoritesTable,
} from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { eq, and } from "drizzle-orm";
import { t } from "elysia";

export default createRoute(
    {
        prefix: "/vaults",
    },
    (app) => {
        app.delete(
            "/:id",
            async ({ user, params, res }) => {
                const { id } = params;

                // Check authorization
                const [membership] = await db
                    .select()
                    .from(vaultMembersTable)
                    .where(
                        and(
                            eq(vaultMembersTable.userId, user.id),
                            eq(vaultMembersTable.vaultId, id),
                            eq(vaultMembersTable.primaryOwner, true),
                        ),
                    )
                    .limit(1);

                if (!membership) {
                    return res.error("UNAUTHORIZED", 401);
                }

                // Delete dependencies first (manually unless cascade is set, safer to do explicit for now)
                // Delete contents
                await db
                    .delete(vaultContentsTable)
                    .where(eq(vaultContentsTable.vaultId, id));

                // Delete members
                await db
                    .delete(vaultMembersTable)
                    .where(eq(vaultMembersTable.vaultId, id));

                // Delete favorites
                await db
                    .delete(favoritesTable)
                    .where(eq(favoritesTable.vaultId, id));

                // Delete vault
                const [deletedVault] = await db
                    .delete(vaultsTable)
                    .where(eq(vaultsTable.id, id))
                    .returning();

                if (!deletedVault) {
                    return res.error("VAULT_DELETE_FAILED", 500);
                }

                return res.success({ deletedId: deletedVault.id });
            },
            {
                params: t.Object({
                    id: t.String(),
                }),
                auth: true,
            },
        );
    },
);
