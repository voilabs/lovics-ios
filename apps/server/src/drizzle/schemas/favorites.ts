import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user, vaultsTable } from "@/drizzle/schema";

export const favoritesTable = pgTable("favorites", {
    id: uuid().defaultRandom().primaryKey(),
    vaultId: uuid().references(() => vaultsTable.id),
    userId: varchar().references(() => user.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date()),
});
