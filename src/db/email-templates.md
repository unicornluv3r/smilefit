# SmileFit — Custom Email Templates for Supabase

Paste each HTML template into **Supabase Dashboard → Authentication → Email Templates**.

---

## Supabase URL Configuration

Before deploying, update **Supabase → Authentication → URL Configuration**:

### Site URL

```
https://joinsmilefit.com
```

### Redirect URLs (add all of these)

```
https://joinsmilefit.com/auth/callback
https://www.joinsmilefit.com/auth/callback
https://smilefit-nu.vercel.app/auth/callback
http://localhost:5173/auth/callback
```

---

## 1. Confirm Signup

**Subject:** `Welcome to SmileFit — Confirm your email`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                <span style="color:#2563EB;">Smile</span><span style="color:#18181b;">Fit</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">
                Welcome to SmileFit!
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.6;">
                Hi {{ .Email }},
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#71717a;line-height:1.6;">
                Thanks for joining SmileFit! Confirm your email to start discovering outdoor fitness classes across Italy.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Confirm Your Email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#2563EB;word-break:break-all;line-height:1.5;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
              <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;line-height:1.5;">
                If you didn't create this account, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                <span style="color:#2563EB;font-weight:600;">Smile</span><span style="font-weight:600;color:#71717a;">Fit</span>
                &mdash; Outdoor fitness classes in Italy's most beautiful cities
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Reset Password

**Subject:** `Reset your SmileFit password`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                <span style="color:#2563EB;">Smile</span><span style="color:#18181b;">Fit</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">
                Reset Your Password
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.6;">
                Hi {{ .Email }},
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#71717a;line-height:1.6;">
                We received a request to reset your password. Click the button below to choose a new one.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                This link expires in 24 hours.
              </p>
              <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#2563EB;word-break:break-all;line-height:1.5;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
              <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;line-height:1.5;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                <span style="color:#2563EB;font-weight:600;">Smile</span><span style="font-weight:600;color:#71717a;">Fit</span>
                &mdash; Outdoor fitness classes in Italy's most beautiful cities
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Magic Link

**Subject:** `Your SmileFit login link`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your login link</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                <span style="color:#2563EB;">Smile</span><span style="color:#18181b;">Fit</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">
                Your Login Link
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.6;">
                Hi {{ .Email }},
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#71717a;line-height:1.6;">
                Click the button below to log in to your SmileFit account. No password needed.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Log In to SmileFit
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                This link expires in 10 minutes.
              </p>
              <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#2563EB;word-break:break-all;line-height:1.5;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
              <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;line-height:1.5;">
                If you didn't request this link, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                <span style="color:#2563EB;font-weight:600;">Smile</span><span style="font-weight:600;color:#71717a;">Fit</span>
                &mdash; Outdoor fitness classes in Italy's most beautiful cities
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Invite User

**Subject:** `You've been invited to SmileFit`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You've been invited</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                <span style="color:#2563EB;">Smile</span><span style="color:#18181b;">Fit</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">
                You've Been Invited!
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.6;">
                Hi {{ .Email }},
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#71717a;line-height:1.6;">
                You've been invited to join SmileFit — the platform for outdoor fitness classes across Italy. Click below to accept the invitation and set up your account.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#2563EB;word-break:break-all;line-height:1.5;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
              <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;line-height:1.5;">
                If you weren't expecting this invitation, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                <span style="color:#2563EB;font-weight:600;">Smile</span><span style="font-weight:600;color:#71717a;">Fit</span>
                &mdash; Outdoor fitness classes in Italy's most beautiful cities
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 5. Email Change Confirmation

**Subject:** `Confirm your new email — SmileFit`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your new email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
              <span style="font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                <span style="color:#2563EB;">Smile</span><span style="color:#18181b;">Fit</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">
                Confirm Your New Email
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.6;">
                Hi {{ .Email }},
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#71717a;line-height:1.6;">
                You requested to change your email address on SmileFit. Click below to confirm this change.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Confirm Email Change
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;line-height:1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#2563EB;word-break:break-all;line-height:1.5;">
                {{ .ConfirmationURL }}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
              <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;line-height:1.5;">
                If you didn't request this change, please secure your account immediately by resetting your password.
              </p>
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.5;">
                <span style="color:#2563EB;font-weight:600;">Smile</span><span style="font-weight:600;color:#71717a;">Fit</span>
                &mdash; Outdoor fitness classes in Italy's most beautiful cities
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```
