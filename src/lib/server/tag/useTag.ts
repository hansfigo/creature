import { inArray } from "drizzle-orm";
import { db } from "../db/db";
import { tags } from "../db/schema";

// convert tag name to tag id
export async function getTagDetail(tagsName: string) {
	const tagsDetail = await db.select().from(tags).where(inArray(tags.name, [tagsName]));
    return tagsDetail[0];
}
