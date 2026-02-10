import { db } from "@/drizzle";
import {
    vaultContentsTable,
    vaultMembersTable,
    vaultsTable,
} from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { and, count, eq, ilike } from "drizzle-orm";
import { t } from "elysia";

export default createRoute(
    {
        prefix: "/vaults",
    },
    (app) => {
        app.get(
            "/public",
            async ({ user, query, res }) => {
                let { search = "", page = 1 } = query;

                const [totalResults] = await db
                    .select({
                        count: count(vaultsTable.id),
                    })
                    .from(vaultsTable)
                    .where(
                        and(
                            eq(vaultsTable.isEncrypted, false),
                            ilike(vaultsTable.title, `%${search}%`),
                        ),
                    )
                    .catch(() => [{ count: 0 }]);

                const maxPages = Math.ceil((totalResults as any).count / 10);

                if (page > maxPages) page = maxPages;
                if (page < 1) page = 1;

                const result = await db
                    .select({
                        id: vaultsTable.id,
                        title: vaultsTable.title,
                        icon: vaultsTable.icon,
                        color: vaultsTable.color,
                        isPremium: vaultsTable.isPremium,
                        isEncrypted: vaultsTable.isEncrypted,
                        createdAt: vaultsTable.createdAt,
                    })
                    .from(vaultsTable)
                    .where(
                        and(
                            eq(vaultsTable.isEncrypted, false),
                            ilike(vaultsTable.title, `%${search}%`),
                        ),
                    )
                    .limit(page * 10)
                    .offset((page - 1) * 10)
                    .catch(() => []);

                const data = await Promise.all(
                    result.map(async (vault) => {
                        const medias = await db
                            .select({
                                contents: vaultContentsTable.contents,
                            })
                            .from(vaultContentsTable)
                            .where(eq(vaultContentsTable.vaultId, vault.id))
                            .catch(() => []);

                        return {
                            ...vault,
                            mediaCount: medias.reduce((acc, media) => {
                                return (
                                    acc + (media.contents?.length as any) || 0
                                );
                            }, 0),
                        };
                    }),
                );

                return res.success({
                    data: data.map((vault) => ({
                        ...vault,
                        year: new Date(vault.createdAt)
                            .getFullYear()
                            .toString(),
                        iconColor: vault.color,
                    })),
                    maxPages,
                    page,
                });
            },
            {
                query: t.Object({
                    search: t.Optional(
                        t.String({ minLength: 0, maxLength: 255 }),
                    ),
                    page: t.Optional(t.Number({ default: 1 })),
                }),
            },
        );
        app.get(
            "/",
            async ({ user, res }) => {
                const result = await db
                    .select({
                        id: vaultsTable.id,
                        title: vaultsTable.title,
                        icon: vaultsTable.icon,
                        color: vaultsTable.color,
                        isPremium: vaultsTable.isPremium,
                        isEncrypted: vaultsTable.isEncrypted,
                        createdAt: vaultsTable.createdAt,
                    })
                    .from(vaultsTable)
                    .innerJoin(
                        vaultMembersTable,
                        eq(vaultsTable.id, vaultMembersTable.vaultId),
                    )
                    .where(eq(vaultMembersTable.userId, user.id));

                const data = await Promise.all(
                    result.map(async (vault) => {
                        const medias = await db
                            .select({
                                contents: vaultContentsTable.contents,
                            })
                            .from(vaultContentsTable)
                            .where(eq(vaultContentsTable.vaultId, vault.id))
                            .catch(() => []);

                        return {
                            ...vault,
                            mediaCount: medias.reduce((acc, media) => {
                                return (
                                    acc + (media.contents?.length as any) || 0
                                );
                            }, 0),
                        };
                    }),
                );

                return res.success(
                    data.map((vault) => ({
                        ...vault,
                        year: new Date(vault.createdAt)
                            .getFullYear()
                            .toString(),
                        iconColor: vault.color,
                    })),
                );
            },
            {
                auth: true,
            },
        );
    },
);
