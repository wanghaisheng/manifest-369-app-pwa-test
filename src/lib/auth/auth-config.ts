/**
 * 认证配置文件
 * 基于better-auth的服务端配置
 */

import { BetterAuth } from 'better-auth';
import { D1Adapter } from 'better-auth/adapters/d1';
import { CredentialsProvider } from 'better-auth/providers/credentials';
import { EmailProvider } from 'better-auth/providers/email';
import { PasskeyProvider } from 'better-auth/providers/passkey';
import { GoogleProvider } from 'better-auth/providers/google';
import { GitHubProvider } from 'better-auth/providers/github';
import { getDatabase, type CloudflareEnv } from '../db';

export function getAuthConfig(env: CloudflareEnv) {
  const { db } = getDatabase(env);

  const providers = [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "电子邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        // 这里应该实现你的验证逻辑
        // 例如，检查用户名和密码
        const userResult = await db.prepare(
          "SELECT * FROM user WHERE email = ?"
        ).bind(credentials.email).first();

        if (!userResult) {
          throw new Error("用户不存在");
        }

        // 在真实环境应该使用加密密码
        // 这里简化为演示目的
        if (credentials.password !== "password") {
          throw new Error("密码错误");
        }

        return {
          id: userResult.id,
          name: userResult.name,
          email: userResult.email,
        };
      },
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
    PasskeyProvider({
      name: 'Passkey',
    }),
  ];

  // 添加社交登录提供商（如果配置了）
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      })
    );
  }

  return BetterAuth({
    adapter: D1Adapter(db),
    secret: env.BETTER_AUTH_SECRET,
    session: {
      strategy: 'database', // 使用数据库储存会话
      maxAge: 30 * 24 * 60 * 60, // 30天有效期
    },
    providers,
    pages: {
      signIn: '/auth/signin', // 登录页面
      signUp: '/auth/signup', // 注册页面
      error: '/auth/error', // 错误页面
      verifyRequest: '/auth/verify-request', // 验证邮件请求页
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.userId = user.id;
          token.email = user.email;
          token.name = user.name;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.userId as string;
        }
        return session;
      },
    },
  });
}

export type AuthConfig = ReturnType<typeof getAuthConfig>;
