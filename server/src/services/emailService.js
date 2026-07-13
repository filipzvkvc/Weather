async function sendEmail(to, subject, htmlContent) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Weather App', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
}

async function sendVerificationEmail(email, token) {
  const link = `${process.env.VITE_BACKEND_URL}/api/auth/verify/${token}`
  await sendEmail(email, 'Verify your email', `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Verify your email</h2>
      <p>Click the button below to verify your account.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#1a6dd6;color:white;border-radius:8px;text-decoration:none;font-weight:600;">
        Verify email
      </a>
      <p style="margin-top:24px;color:#999;font-size:13px;">If you didn't create an account, you can ignore this email.</p>
    </div>
  `)
}

async function sendPasswordResetEmail(email, token) {
  const link = `${process.env.CLIENT_URL}/reset-password/${token}`
  await sendEmail(email, 'Reset your password', `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Reset your password</h2>
      <p>Click the button below to set a new password. This link expires in 1 hour.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#1a6dd6;color:white;border-radius:8px;text-decoration:none;font-weight:600;">
        Reset password
      </a>
      <p style="margin-top:24px;color:#999;font-size:13px;">If you didn't request a password reset, you can ignore this email.</p>
    </div>
  `)
}

async function sendEmailChangeVerification(newEmail, token) {
  const link = `${process.env.VITE_BACKEND_URL}/api/user/verify-email-change/${token}`
  await sendEmail(newEmail, 'Confirm your new email address', `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Confirm your new email</h2>
      <p>Click the button below to confirm this as your new email address. This link expires in 1 hour.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#1a6dd6;color:white;border-radius:8px;text-decoration:none;font-weight:600;">
        Confirm email
      </a>
      <p style="margin-top:24px;color:#999;font-size:13px;">If you didn't request this change, you can ignore this email.</p>
    </div>
  `)
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendEmailChangeVerification }