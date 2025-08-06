import z from "zod";
export const createConversationSchema = z.object({
  userIds: z
    .array(z.string())
    .min(2, "At least two user IDs are required")
    .refine((items) => new Set(items).size === items.length, {
      message: "Must be an array of unique strings",
    }),
});
