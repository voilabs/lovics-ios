import { db } from "@/drizzle";
import {
    vaultContentsTable,
    vaultMembersTable,
    vaultsTable,
} from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { t } from "elysia";
import { eq } from "drizzle-orm";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET_NAME, s3Client } from "@/lib/s3";

export default createRoute(
    {
        prefix: "/vaults/:id",
    },
    (app) => {
        app.get(
            "/contents/:contentId",
            async ({ user, params, body, res }) => {
                try {
                    const [vault] = await db
                        .select({
                            id: vaultsTable.id,
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

                    const [content] = await db
                        .select()
                        .from(vaultContentsTable)
                        .where(eq(vaultContentsTable.id, params.contentId))
                        .limit(1)
                        .catch(() => []);

                    if (!content) return res.error("CONTENT_NOT_FOUND", 404);

                    const allContents = await Promise.all(
                        content.contents?.map(async (content) => {
                            const command = new GetObjectCommand({
                                Bucket: BUCKET_NAME,
                                Key: content?.path,
                            });

                            const url = await getSignedUrl(s3Client, command, {
                                expiresIn: 900,
                            });

                            return {
                                ...content,
                                url,
                                iv: content.iv,
                                alt: content.alt,
                            };
                        }) as any,
                    );

                    return res.success(
                        Object.assign(content, { contents: allContents }),
                    );
                } catch (error) {
                    console.log(error);
                    return res.error("INTERNAL_ERROR", 500);
                }
            },
            {
                params: t.Object({
                    id: t.String({ minLength: 1, maxLength: 255 }),
                    contentId: t.String({ minLength: 1, maxLength: 255 }),
                }),
                auth: true,
            },
        );
    },
);
