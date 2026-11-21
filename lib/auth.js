import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError, getOAuthState } from "better-auth/api";
import { db } from "./mongodb";

const googleEnabled =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "WedPlan",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db),

  
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
  verification: { modelName: "verifications" },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {},

  
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must contain at least one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },

  
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          let role = user.role;
          try {
            
            const oauthState = await getOAuthState();
            if (oauthState?.role) role = oauthState.role;
          } catch (e) {
        
          }
          const safeRole = role === "vendor" ? "vendor" : "customer";
          return {
            data: {
              ...user,
              role: safeRole,
              isBlocked: false,
              subscriptionPlan: "free",
            },
          };
        },
      },
    },
  },

  plugins: [
    
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
    }),
    nextCookies(), // এটা সবসময় শেষে থাকতে হবে
  ],
});