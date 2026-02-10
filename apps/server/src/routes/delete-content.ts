import { db } from "@/drizzle";
import { vaultContentsTable, vaultMembersTable } from "@/drizzle/schema";
import { createRoute } from "@/lib/createRoute";
import { and, eq } from "drizzle-orm";
import { t } from "elysia";

export default createRoute(
    {
        prefix: "/vaults/:id",
    },
    (app) => {
        app.delete(
            "/contents/:itemId",
            async ({ user, params, body, res }) => {
                const { id, itemId } = params;
                const { contentPaths } = body;

                // Check authorization
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

                // Get current content
                const [contentItem] = await db
                    .select()
                    .from(vaultContentsTable)
                    .where(
                        and(
                            eq(vaultContentsTable.id, itemId),
                            eq(vaultContentsTable.vaultId, id),
                        ),
                    )
                    .limit(1);

                if (!contentItem) {
                    return res.error("CONTENT_NOT_FOUND", 404);
                }

                // If contentPaths is provided and not empty, perform partial delete
                if (contentPaths && contentPaths.length > 0) {
                    const currentContents = contentItem.contents as any[];

                    // Filter out the items to be deleted
                    const newContents = currentContents.filter(
                        (item: any) => !contentPaths.includes(item.path),
                    );

                    // If all contents are removed, we should delete the entire item
                    if (newContents.length === 0) {
                        await db
                            .delete(vaultContentsTable)
                            .where(eq(vaultContentsTable.id, itemId));

                        return res.success({ deleted: true, mode: "full" });
                    }

                    // Otherwise update with remaining contents
                    await db
                        .update(vaultContentsTable)
                        .set({
                            contents: newContents,
                            updatedAt: new Date(),
                        })
                        .where(eq(vaultContentsTable.id, itemId));

                    return res.success({
                        deleted: true,
                        mode: "partial",
                        remainingCount: newContents.length,
                    });
                }

                // If no contentPaths provided, delete the entire item
                await db
                    .delete(vaultContentsTable)
                    .where(eq(vaultContentsTable.id, itemId));

                return res.success({ deleted: true, mode: "full" });
            },
            {
                params: t.Object({
                    id: t.String(),
                    itemId: t.String(),
                }),
                body: t.Object({
                    contentPaths: t.Optional(t.Array(t.String())),
                }),
                auth: true,
            },
        );
    },
);
