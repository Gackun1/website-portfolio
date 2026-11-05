import { WorkerMailer } from "worker-mailer";

interface Env {
  GMAIL_USER: string;
  GMAIL_APP_PASSWORD: string;
  MAIL_TO: string;
  /** カンマ区切り */
  ALLOWED_ORIGINS: string;
}

interface ContactBody {
  inquiryType?: string;
  name?: string;
  content?: string;
}

const INQUIRY_LABELS: Record<string, string> = {
  request: "ご依頼",
  consultation: "ご相談",
  other: "その他",
};

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request.headers.get("Origin"), env);
    const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method Not Allowed" }, 405);
    if (!cors["Access-Control-Allow-Origin"]) return json({ error: "Forbidden" }, 403);

    let body: ContactBody;
    try {
      body = await request.json();
    } catch {
      return json({ error: "不正なリクエストです" }, 400);
    }

    const { inquiryType, name, content } = body;
    if (!inquiryType || !name || !content) {
      return json({ error: "すべての項目を入力してください" }, 400);
    }

    if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
      console.error("GMAIL_USER or GMAIL_APP_PASSWORD is not set");
      return json({ error: "メール設定が不足しています" }, 500);
    }

    const label = INQUIRY_LABELS[inquiryType] ?? inquiryType;

    try {
      const mailer = await WorkerMailer.connect({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        authType: "plain",
        credentials: { username: env.GMAIL_USER, password: env.GMAIL_APP_PASSWORD },
      });
      await mailer.send({
        from: env.GMAIL_USER,
        to: env.MAIL_TO,
        subject: `【ポートフォリオ】${label} - ${name}`,
        text: [`お問い合わせ目的: ${label}`, `お名前: ${name}`, ``, `--- お問い合わせ内容 ---`, content].join("\n"),
      });
      await mailer.close();
    } catch (error) {
      console.error("Mail send error:", error);
      return json({ error: "送信に失敗しました" }, 500);
    }

    return json({ success: true });
  },
};
