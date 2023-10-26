import * as z from 'zod';

export type UserValidantionSchema = z.infer<typeof userValidantionSchema>;

export const userValidantionSchema = z.object({
  profile_photo: z.string().url().min(1),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(750),
});
