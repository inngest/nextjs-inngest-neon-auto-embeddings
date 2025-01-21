import { type InferInsertModel } from "drizzle-orm";
import { contacts } from "./schema";

export type NewContact = InferInsertModel<typeof contacts>;
