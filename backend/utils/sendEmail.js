import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url), quiet: true });

const transporter = nodemailer.createTransport({
  service: "gmail",
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS) &&
    !/your_email|example\.com/i.test(process.env.EMAIL_USER) &&
    !/your_|app_password|replace/i.test(process.env.EMAIL_PASS);
}

export const verificationMailer = { send: async (toEmail, token) => {
  if (!isEmailConfigured()) {
    throw Object.assign(new Error("Verification email is not configured"), { code: "EMAIL_NOT_CONFIGURED" });
  }
  const verifyLink = `${process.env.BACKEND_URL}/api/auth/confirm-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify Your Email - Job Portal",
    html: `
      <h2>Welcome to Job Portal! 🎉</h2>
      <p>Please click the button below to verify your account:</p>
      <a href="${verifyLink}" style="background:#4F46E5;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Verify Email
      </a>
      <p>This link will expire in <b>24 hours</b>.</p>
    `,
  });
} };

export const applicationStatusMailer = { send: async (toEmail, { applicantName, jobTitle, companyName, status }) => {
  if (!isEmailConfigured()) {
    throw Object.assign(new Error("Status email is not configured"), { code: "EMAIL_NOT_CONFIGURED" });
  }
  const accepted = status === "accepted";
  const subject = accepted
    ? `You've been accepted for ${jobTitle}!`
    : `Update on your application for ${jobTitle}`;
  const html = accepted
    ? `
      <h2>Congratulations, ${applicantName}! 🎉</h2>
      <p><b>${companyName}</b> has accepted your application for <b>${jobTitle}</b>.</p>
      <p>They may reach out to you directly with next steps. You can also check your applications page for updates.</p>
    `
    : `
      <h2>Hi ${applicantName},</h2>
      <p>Your application for <b>${jobTitle}</b> at <b>${companyName}</b> was not selected this time.</p>
      <p>Don't be discouraged — keep exploring new opportunities on Hirelo.</p>
    `;
  await transporter.sendMail({ from: process.env.EMAIL_USER, to: toEmail, subject, html });
} };
