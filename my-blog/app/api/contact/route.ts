import nodemailer from "nodemailer";

interface ContactBody {
  inquiryType: string;
  name: string;
  content: string;
}

const INQUIRY_LABELS: Record<string, string> = {
  works: "制作のご依頼",
  consultation: "お見積もり・ご相談",
  other: "その他",
};

export async function POST(request: Request) {
  try {
    const { inquiryType, name, content } = (await request.json()) as ContactBody;

    if (!inquiryType || !name || !content) {
      return Response.json({ error: "すべての項目を入力してください" }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("GMAIL_USER or GMAIL_APP_PASSWORD is not set");
      return Response.json({ error: "メール設定が不足しています" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const label = INQUIRY_LABELS[inquiryType] ?? inquiryType;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "gaku.yoshikawa@gmail.com",
      subject: `【ポートフォリオ】${label} - ${name}`,
      text: [
        `お問い合わせ目的: ${label}`,
        `お名前: ${name}`,
        ``,
        `--- お問い合わせ内容 ---`,
        content,
      ].join("\n"),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
