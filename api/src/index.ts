import { WorkerMailer } from "worker-mailer";

interface Env {
  GMAIL_USER: string;
  GMAIL_APP_PASSWORD: string;
  MAIL_TO: string;
  /** カンマ区切り */
  ALLOWED_ORIGINS: string;
}

type Handler = (request: Request, env: Env) => Promise<Response>;

const INQUIRY_LABELS: Record<string, string> = {
  request: "ご依頼",
  consultation: "ご相談",
  other: "その他",
};

const contactForm: Handler = async (request, env) => {
  let body: { inquiryType?: string; name?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { inquiryType, name, content } = body;
  if (!inquiryType || !name || !content) {
    return Response.json({ error: "すべての項目を入力してください" }, { status: 400 });
  }

  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
    console.error("GMAIL_USER or GMAIL_APP_PASSWORD is not set");
    return Response.json({ error: "メール設定が不足しています" }, { status: 500 });
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
    return Response.json({ error: "送信に失敗しました" }, { status: 500 });
  }

  return Response.json({ success: true });
};

/** 公開する API。ここにないパスは 404 */
const routes: Record<string, Partial<Record<string, Handler>>> = {
  "/v1/contact-form": { POST: contactForm },
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

function withHeaders(res: Response, headers: Record<string, string>): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(headers)) out.headers.set(k, v);
  return out;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request.headers.get("Origin"), env);
    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    const route = routes[path];

    if (!route) return withHeaders(Response.json({ error: "Not Found" }, { status: 404 }), cors);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const handler = route[request.method];
    if (!handler) {
      const allow = Object.keys(route).join(", ");
      return withHeaders(Response.json({ error: "Method Not Allowed" }, { status: 405 }), { ...cors, Allow: allow });
    }
    if (!cors["Access-Control-Allow-Origin"]) return Response.json({ error: "Forbidden" }, { status: 403 });

    return withHeaders(await handler(request, env), cors);
  },
};
