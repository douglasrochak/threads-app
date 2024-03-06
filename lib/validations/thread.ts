import * as z from "zod"

export type ThreadValidationSchema = z.infer<typeof threadValidationSchema>

export type CommentValidationSchema = z.infer<typeof commentValidationSchema>

export const threadValidationSchema = z.object({
  thread: z
    .string()
    .min(3, { message: "Thread must be at least 3 characters long." })
    .max(1000, { message: "Thread must be at most 1000 characters long." }),
  accountId: z.string(),
})

export const commentValidationSchema = z.object({
  thread: z.string().min(1),
})
