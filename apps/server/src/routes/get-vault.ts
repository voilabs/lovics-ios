import { db } from "@/drizzle";
import {
    vaultContentsTable,
    vaultMembersTable,
    vaultsTable,
} from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { t } from "elysia";
import { and, count, eq } from "drizzle-orm";
import { BUCKET_NAME, s3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default createRoute(
    {
        prefix: "/vaults/:id",
    },
    (app) => {
        app.get(
            "/is-encrypted",
            async ({ params }) => {
                const [vault] = await db
                    .select({
                        isEncrypted: vaultsTable.isEncrypted,
                    })
                    .from(vaultsTable)
                    .where(eq(vaultsTable.id, params.id))
                    .limit(1)
                    .catch(() => []);

                if (!vault) return null;

                return vault.isEncrypted;
            },
            {
                params: t.Object({
                    id: t.String({ minLength: 1, maxLength: 255 }),
                }),
            },
        );
        app.get(
            "/",
            async ({ user, params, res }) => {
                const [vault] = await db
                    .select({
                        id: vaultsTable.id,
                        title: vaultsTable.title,
                        icon: vaultsTable.icon,
                        color: vaultsTable.color,
                        theme: vaultsTable.theme,
                        isEncrypted: vaultsTable.isEncrypted,
                    })
                    .from(vaultsTable)
                    .where(eq(vaultsTable.id, params.id))
                    .limit(1)
                    .catch(() => []);

                if (!vault) return res.error("VAULT_NOT_FOUND", 404);

                let encryptedVaultKey: string | null = null;

                if (vault.isEncrypted) {
                    if (!user) return res.error("UNAUTHORIZED", 401);

                    const [memberRecord] = await db
                        .select({
                            id: vaultMembersTable.id,
                            encryptedVaultKey:
                                vaultMembersTable.encryptedVaultKey,
                            salt: vaultMembersTable.salt,
                            primaryOwner: vaultMembersTable.primaryOwner,
                        })
                        .from(vaultMembersTable)
                        .where(
                            and(
                                eq(vaultMembersTable.vaultId, vault.id),
                                eq(vaultMembersTable.userId, user.id),
                            ),
                        )
                        .limit(1)
                        .catch(() => []);

                    if (!memberRecord) return res.error("UNAUTHORIZED", 401);

                    return res.success({
                        ...vault,
                        encryptedVaultKey: memberRecord.encryptedVaultKey,
                        salt: memberRecord.salt,
                        isMember: !memberRecord.primaryOwner,
                    });
                }
                return res.success({ ...vault, encryptedVaultKey });
            },
            {
                params: t.Object({
                    id: t.String({ minLength: 1, maxLength: 255 }),
                }),
            },
        );

        app.get(
            "/contents",
            async ({ user, params, query, res }) => {
                let { page } = query;
                page = page || 1;
                if (page < 1) return res.error("INVALID_PAGE", 400);

                const [vault] = await db
                    .select({
                        id: vaultsTable.id,
                        title: vaultsTable.title,
                        icon: vaultsTable.icon,
                        color: vaultsTable.color,
                        theme: vaultsTable.theme,
                        isEncrypted: vaultsTable.isEncrypted,
                    })
                    .from(vaultsTable)
                    .where(eq(vaultsTable.id, params.id))
                    .limit(1)
                    .catch(() => []);

                if (!vault) return res.error("VAULT_NOT_FOUND", 404);
                if (vault.isEncrypted) {
                    if (!user) return res.error("UNAUTHORIZED", 401);
                    const [hasMember] = await db
                        .select({
                            id: vaultMembersTable.id,
                        })
                        .from(vaultMembersTable)
                        .where(eq(vaultMembersTable.vaultId, vault.id))
                        .limit(1)
                        .catch(() => []);

                    if (!hasMember) return res.error("UNAUTHORIZED", 401);
                }

                const contents = await db
                    .select()
                    .from(vaultContentsTable)
                    .where(eq(vaultContentsTable.vaultId, vault.id))
                    .limit(12)
                    .offset((page - 1) * 12)
                    .catch(() => []);

                const allContents = contents.map((content) => {
                    return {
                        id: content.id,
                        thumbnails: content.contents?.slice(0, 4),
                    };
                });

                const allThumbnails = allContents
                    .map((e) => e.thumbnails)
                    .flat();

                const tempSignedUrls = await Promise.all(
                    allThumbnails.map(async (thumbnail) => {
                        const command = new GetObjectCommand({
                            Bucket: BUCKET_NAME,
                            Key: thumbnail?.path,
                        });

                        const url = await getSignedUrl(s3Client, command, {
                            expiresIn: 900,
                        }); // 900 saniye = 15 dk

                        return {
                            ...thumbnail,
                            url,
                            iv: thumbnail?.iv,
                            alt: thumbnail?.alt,
                        };
                    }),
                );

                const [countTotal] = await db
                    .select({ count: count() })
                    .from(vaultContentsTable)
                    .where(eq(vaultContentsTable.vaultId, vault.id))
                    .catch(() => [{ count: 0 }]);

                return res.success({
                    data: allContents.map((content) => {
                        return {
                            ...content,
                            thumbnails: content.thumbnails?.map((thumbnail) => {
                                return tempSignedUrls.find(
                                    (url) => url.path === thumbnail.path,
                                );
                            }),
                        };
                    }),
                    hasMore: (countTotal as any).count > page * 12,
                    maxPage: Math.ceil(Number((countTotal as any).count) / 12),
                });
            },
            {
                params: t.Object({
                    id: t.String({ minLength: 1, maxLength: 255 }),
                }),
                query: t.Object({
                    page: t.Optional(t.Number()),
                }),
            },
        );

        app.get(
            "/has-member",
            async ({ user, params, res }) => {
                const [vault] = await db
                    .select({
                        id: vaultMembersTable.id,
                        primaryOwner: vaultMembersTable.primaryOwner,
                    })
                    .from(vaultMembersTable)
                    .where(
                        and(
                            eq(vaultMembersTable.vaultId, params.id),
                            eq(vaultMembersTable.userId, user.id),
                        ),
                    )
                    .limit(1)
                    .catch(() => []);

                if (!vault) return res.error("VAULT_NOT_FOUND", 404);

                return res.success({
                    isMember: true,
                    isPrimaryOwner: vault.primaryOwner,
                });
            },
            {
                params: t.Object({
                    id: t.String({ minLength: 1, maxLength: 255 }),
                }),
                auth: true,
            },
        );
    },
);
