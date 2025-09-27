import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add connection timeout and debug for robustness
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  logger: true,
  debug: true,
});

export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log("[Email] Preparing to send email:", { to, subject });
    console.log("[Email] EMAIL_USER:", process.env.EMAIL_USER);

    if (!to || !subject || !text || !html) {
      throw new Error(
        "Missing email recipient, subject, text, or HTML content"
      );
    }

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.EMAIL_FROM
    ) {
      console.error("[Email] Configuration missing:", {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_FROM: process.env.EMAIL_FROM,
      });
      throw new Error("Email configuration is incomplete");
    }

    const info = await transporter.sendMail({
      from: `"YumCycle" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("[Email] Email sent successfully, message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("[Email] Error sending email:", {
      error: error.message,
      stack: error.stack,
      to,
      subject,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port,
      command: error.command,
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
