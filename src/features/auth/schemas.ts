import { z } from "zod";
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});
export const signUpSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});
