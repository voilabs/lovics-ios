import { RedisStore, type RedisReply } from "rate-limit-redis";
import RedisClient from "ioredis";
import { Elysia, type Context } from "elysia";
import { auth } from "@/auth";

const redisClient = new RedisClient(process.env.REDIS_URL!);

export const customRateLimit = async (
    key: string,
    windowMs: number,
    max: number,
) => {
    const redisKey = `lovics://rate-limit:${key}`;

    const current = await redisClient.incr(redisKey);

    // İlk istekse expire ayarla
    if (current === 1) {
        await redisClient.pexpire(redisKey, windowMs);
    }

    const ttl = await redisClient.pttl(redisKey);

    const remaining = Math.max(0, max - current);

    return {
        allowed: current <= max,
        remaining,
        resetTime: Date.now() + (ttl > 0 ? ttl : windowMs),
    };
};

export const rateLimitPlugin = new Elysia({ name: "rate-limit" })
    .derive(({ request }) => {
        let ip;
        const allIpHeaders = [
            request.headers.get("cf-connecting-ip"),
            request.headers.get("x-forwarded-for"),
            request.headers.get("x-real-ip"),
            request.headers.get("x-client-ip"),
            request.headers.get("x-forwarded"),
            request.headers.get("forwarded"),
            request.headers.get("x-cluster-client-ip"),
            request.headers.get("x-forwarded-for"),
            request.headers.get("x-forwarded-for"),
        ]
            .filter(Boolean)
            .filter((ip) => ip !== "::1");
        ip = allIpHeaders?.at?.(0) || "0.0.0.0";

        return {
            ip,
        };
    })
    .macro({
        rateLimit: ({ windowMs, max }: { windowMs: number; max: number }) => {
            return {
                resolve: async ({ user, set, status, ip }: any) => {
                    const actionId = (user?.id || ip)!;

                    const result = await customRateLimit(
                        actionId,
                        windowMs,
                        max,
                    );
                    if (!result.allowed) return status(429);
                },
            };
        },
    });
