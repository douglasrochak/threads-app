import * as z from 'zod';

export type ThreadValidantionSchema = z.infer<typeof threadValidantionSchema>;

export type CommentValidantionSchema = z.infer<typeof commentValidantionSchema>;

export const threadValidantionSchema = z.object({
  thread: z
    .string()
    .min(3, { message: 'Thread must be at least 3 characters long.' })
    .max(1000, { message: 'Thread must be at most 1000 characters long.' }),
  accountId: z.string(),
});

export const commentValidantionSchema = z.object({
  thread: z.string().min(1),
});
