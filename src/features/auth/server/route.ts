import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    try {
      const { email, password } = await c.req.valid("json");
      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);
      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true, message: null });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return c.json({ success: false, message: error.message }, 401);
      }
      return c.json(
        { success: false, message: "An unknown error occurred" },
        401
      );
    }
  })

  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    try {
      const { name, email, password } = await c.req.valid("json");
      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true, message: null });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return c.json({ success: false, message: error.message }, 400);
      }
      return c.json(
        { success: false, message: "An unknown error occurred" },
        400
      );
    }
  })

  .post("/log-out", sessionMiddleware, async (c) => {
    try {
      const account = c.get("account");

      await account.deleteSession("current");
      deleteCookie(c, AUTH_COOKIE);

      return c.json({ success: true, message: null });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return c.json({ success: false, message: error.message }, 400);
      }
      return c.json(
        { success: false, message: "An unknown error occurred" },
        400
      );
    }
  });

export default app;
