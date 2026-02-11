import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle";
import * as schema from "@/drizzle/schemas/auth-schema";
import { expo } from "@better-auth/expo";
import Elysia from "elysia";
import { emailOTP } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import Handlebars from "handlebars";
import fs from "fs/promises";
const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
    baseURL: process.env.BASE_URL,
    basePath: "/auth",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        expo(),
        emailOTP({
            sendVerificationOTP: async ({ email, otp, type }) => {
                const [userObj] = await db
                    .select()
                    .from(schema.user)
                    .where(eq(schema.user.email, email))
                    .catch(() => [null]);

                let action = "Sign In";
                if (type === "email-verification")
                    action = "Email Verification";
                if (type === "forget-password") action = "Forget Password";

                const otpFile = await fs.readFile(
                    __dirname + "/emails/otp.html",
                    { encoding: "utf-8" },
                );

                // 1. Önce senaryolara göre içerikleri tanımlayalım
                const emailVariants = {
                    "email-verification": {
                        action: "Email Verification",
                        title: `Welcome to Lovics, ${userObj?.name.replace(":", " ") || "N/A"}! 👋`,
                        body_1: "Thank you for joining us!",
                        body_2: "We’re glad you’re here. Ready to see what we’ve built for you?",
                        body_3: "",
                    },
                    "forget-password": {
                        action: "Reset Password",
                        title: `Reset Your Password 🔒`,
                        body_1: "We received a request to reset the password for your Lovics account. Use the code below to proceed:",
                        body_2: "This code is valid for 10 minutes. For security, do not share this code with anyone.",
                        code: otp,
                        body_3: "If you did not request a password reset, you can safely ignore this email. Your account remains secure.",
                    },
                    "sign-in": {
                        action: "Sign In",
                        title: `Hello, ${userObj?.name.replace(":", " ") || "N/A"} 👋`,
                        body_1: "Here is your one-time verification code to sign in to your Lovics account:",
                        body_2: "This code is valid for 10 minutes. Please do not share this code with anyone, even Lovics support.",
                        code: otp,
                        body_3: "If you did not attempt to sign in, please check your account security settings immediately.",
                    },
                };

                const template = Handlebars.compile(otpFile);

                resend.emails.send({
                    from: "noreply@lovics.app",
                    to: email,
                    subject: "Your Verification Code",
                    html: template(
                        emailVariants[type] || emailVariants["sign-in"],
                    ),
                });
            },
            sendVerificationOnSignUp: true,
            otpLength: 6,
        }),
    ],
    trustedOrigins: [
        "lovics://",
        ...(process.env.NODE_ENV === "development"
            ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
            : []),
    ],
});

export const betterAuthPlugin = new Elysia({ name: "better-auth" })
    .mount(auth.handler)
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers,
                });
                if (!session) return status(401);
                return {
                    user: session.user,
                    session: session.session,
                };
            },
        },
    });
