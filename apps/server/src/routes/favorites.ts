import { db } from "@/drizzle";
import { favoritesTable, vaultsTable } from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { and, eq } from "drizzle-orm";
import { t } from "elysia";

export default createRoute(
    {
        prefix: "/favorites",
    },
    (app) => {
        app.post(
            "/:vaultId",
            async ({ user, params, res }) => {
                const { vaultId } = params;

                const [vault] = await db
                    .select()
                    .from(vaultsTable)
                    .where(
                        and(
                            eq(vaultsTable.id, vaultId),
                            eq(vaultsTable.isEncrypted, false),
                        ),
                    )
                    .limit(1);

                if (!vault) return res.error("VAULT_NOT_FOUND", 404);

                const [existingFavorite] = await db
                    .select()
                    .from(favoritesTable)
                    .where(
                        and(
                            eq(favoritesTable.userId, user.id),
                            eq(favoritesTable.vaultId, vaultId),
                        ),
                    )
                    .limit(1);

                if (existingFavorite) {
                    await db
                        .delete(favoritesTable)
                        .where(eq(favoritesTable.id, existingFavorite.id));

                    return res.success({ isFavorite: false });
                }

                await db.insert(favoritesTable).values({
                    userId: user.id,
                    vaultId,
                });

                return res.success({ isFavorite: true });
            },
            {
                auth: true,
                params: t.Object({
                    vaultId: t.String(),
                }),
            },
        );

        app.get(
            "/",
            async ({ user, res }) => {
                const favorites = await db
                    .select({
                        vault: vaultsTable,
                    })
                    .from(favoritesTable)
                    .innerJoin(
                        vaultsTable,
                        eq(favoritesTable.vaultId, vaultsTable.id),
                    )
                    .where(eq(favoritesTable.userId, user.id));

                return res.success(
                    favorites.map((f) => ({
                        ...f.vault,
                        year: new Date(f.vault.createdAt)
                            .getFullYear()
                            .toString(),
                        iconColor: f.vault.color,
                    })),
                );
            },
            {
                auth: true,
            },
        );
    },
);
