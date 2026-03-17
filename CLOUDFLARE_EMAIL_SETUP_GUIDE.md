# Cloudflare Email Setup Guide for vibeworksstudio.ai

**Goal:** Set up free professional email (info@vibeworksstudio.ai) using Cloudflare Email Routing + Gmail

**Total Time:** ~35 minutes active work + 24-48 hours DNS propagation wait

---

## Current Status: Your Domain Setup

✅ **Domain:** vibeworksstudio.ai (registered on GoDaddy)
❌ **Current Nameservers:** GoDaddy DNS (will change to Cloudflare)
✅ **Website:** GitHub Pages (will continue working)
⚠️ **Old MX Records:** Google MX records present (will be replaced)

---

## ⚡ PHASE 1: Cloudflare Account & Domain Setup (10 minutes)

### Step 1.1: Create/Access Cloudflare Account

1. Go to https://cloudflare.com
2. Click **"Sign Up"** (or "Log In" if you have an account)
3. Enter your email and create a password
4. Verify your email address

### Step 1.2: Add Your Domain to Cloudflare

1. Click **"Add a Site"** in the Cloudflare dashboard
2. Enter: `vibeworksstudio.ai`
3. Click **"Add site"**
4. Select the **FREE plan** ($0/month)
5. Click **"Continue"**

### Step 1.3: Review DNS Records

Cloudflare will automatically scan your current DNS records from GoDaddy. You should see:

**✅ KEEP THESE RECORDS (these are correct):**

```
Type: A
Name: @ (or vibeworksstudio.ai)
Content: 185.199.108.153
Proxy: ON (orange cloud)

Type: A
Name: @ (or vibeworksstudio.ai)
Content: 185.199.109.153
Proxy: ON (orange cloud)

Type: A
Name: @ (or vibeworksstudio.ai)
Content: 185.199.110.153
Proxy: ON (orange cloud)

Type: A
Name: @ (or vibeworksstudio.ai)
Content: 185.199.111.153
Proxy: ON (orange cloud)

Type: TXT
Name: @ (or vibeworksstudio.ai)
Content: google-site-verification=BwPiFZ46Ouj7On2RNpKfJirDPvB_KxDiRhkYZFeIpOQ
```

**❌ REMOVE THESE RECORDS (old/unused):**

```
Type: MX
Name: @
Content: aspmx.l.google.com (Priority: 1)

Type: MX
Name: @
Content: alt1.aspmx.l.google.com (Priority: 5)

Type: MX
Name: @
Content: alt2.aspmx.l.google.com (Priority: 5)

Type: MX
Name: @
Content: alt3.aspmx.l.google.com (Priority: 10)

Type: MX
Name: @
Content: alt4.aspmx.l.google.com (Priority: 10)
```

**How to remove MX records:**
1. In the Cloudflare DNS record review screen, find each MX record
2. Click the **trash icon** or **X** next to each MX record
3. Remove all 5 Google MX records
4. Keep everything else

### Step 1.4: Complete DNS Import

1. After removing the old MX records, click **"Continue"**
2. Cloudflare will show you your new nameservers

**⚠️ IMPORTANT:** Copy these nameserver values! You'll need them in Phase 2.

Example nameservers (yours will be different):
```
dana.ns.cloudflare.com
walt.ns.cloudflare.com
```

**📝 Write down your nameservers here:**
- Nameserver 1: ____________________________
- Nameserver 2: ____________________________

---

## ⏳ PHASE 2: Change Nameservers in GoDaddy (5 minutes + 24 hour wait)

### Step 2.1: Log into GoDaddy

1. Go to https://godaddy.com
2. Log in to your account
3. Click **"My Products"** in the top menu

### Step 2.2: Access Domain Settings

1. Find **vibeworksstudio.ai** in your domain list
2. Click the **DNS** button next to it (or click the domain name, then "DNS")

### Step 2.3: Change Nameservers

1. Scroll to the **"Nameservers"** section
2. Click **"Change"** (or "Manage")
3. Select **"Custom"** or **"I'll use my own nameservers"**
4. Replace the current GoDaddy nameservers with your Cloudflare nameservers:

**Remove:**
```
ns31.domaincontrol.com
ns32.domaincontrol.com
```

**Add (use YOUR values from Step 1.4):**
```
[Your Cloudflare Nameserver 1]
[Your Cloudflare Nameserver 2]
```

5. Click **"Save"** or **"Update"**
6. GoDaddy may warn you about losing email - **ignore this** (we're setting up new email)

### Step 2.4: Confirm in Cloudflare

1. Go back to your Cloudflare dashboard
2. You should see a message: **"Waiting for nameserver update"**
3. Click **"Check nameservers"** to verify
4. If successful, you'll see: **"Great! Cloudflare is now protecting your site"**

**⏰ DNS Propagation Time:** 24-48 hours (usually 2-6 hours)

### Step 2.5: Monitor Propagation

While waiting, check propagation status:
1. Go to: https://dnschecker.org
2. Select **"NS"** from dropdown
3. Enter: `vibeworksstudio.ai`
4. Click **"Search"**
5. You'll see nameservers updating globally (green checkmarks = updated)

**Your website will keep working during this time!**

---

## 📧 PHASE 3: Enable Cloudflare Email Routing (5 minutes)

**⚠️ WAIT until DNS has fully propagated (all green in dnschecker.org) before starting Phase 3**

### Step 3.1: Access Email Routing

1. Log into Cloudflare dashboard
2. Select **vibeworksstudio.ai**
3. Click **"Email"** in the left sidebar
4. Click **"Email Routing"**

### Step 3.2: Enable Email Routing

1. Click **"Get started"** or **"Enable Email Routing"**
2. Cloudflare will show DNS records it needs to add:
   - MX records (3 records)
   - SPF record (TXT record)
3. Click **"Add records and enable"**

**These records are added automatically:**
```
Type: MX
Name: @
Content: route1.mx.cloudflare.net (Priority: 1)

Type: MX
Name: @
Content: route2.mx.cloudflare.net (Priority: 2)

Type: MX
Name: @
Content: route3.mx.cloudflare.net (Priority: 3)

Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all
```

### Step 3.3: Create Your Email Address

1. Click **"Destination addresses"** tab
2. Click **"Add destination address"**
3. Enter your personal Gmail address (where you want emails forwarded)
4. Click **"Send verification email"**
5. Check your Gmail inbox
6. Click the verification link in the email from Cloudflare

### Step 3.4: Create Email Alias

1. Click **"Routing rules"** or **"Email addresses"** tab
2. Click **"Create address"**
3. Enter: `info` (the part before @)
4. Full address will be: **info@vibeworksstudio.ai**
5. Select destination: Your verified Gmail address
6. Click **"Save"**

### Step 3.5: Test Receiving

1. From any email account (work email, friend's email, etc.)
2. Send a test email TO: **info@vibeworksstudio.ai**
3. Check your Gmail inbox
4. You should receive the forwarded email within seconds

**✅ If you received the email, Phase 3 is complete!**

---

## 📤 PHASE 4: Configure Gmail Sending (10 minutes)

Now let's set up sending emails FROM info@vibeworksstudio.ai through Gmail.

### Step 4.1: Enable 2-Factor Authentication (if not already)

1. Go to https://myaccount.google.com
2. Click **"Security"** in the left sidebar
3. Find **"2-Step Verification"**
4. Click **"Get started"** and follow the prompts
5. Set up using phone number or authenticator app

### Step 4.2: Create App Password

1. Still in **Google Account → Security**
2. Scroll to **"2-Step Verification"** section
3. Click **"App passwords"** (at the bottom)
4. If prompted, sign in again
5. Click **"Select app"** → Choose **"Mail"**
6. Click **"Select device"** → Choose **"Other (Custom name)"**
7. Enter: `Cloudflare Email`
8. Click **"Generate"**
9. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

**📝 Save this App Password somewhere safe - you can't see it again!**

### Step 4.3: Configure "Send mail as" in Gmail

1. Open Gmail (mail.google.com)
2. Click the **⚙️ gear icon** (top right)
3. Click **"See all settings"**
4. Click the **"Accounts and Import"** tab
5. Find **"Send mail as:"** section
6. Click **"Add another email address"**

### Step 4.4: Add Your Custom Email

**In the popup window:**

1. **Name:** Enter your name (e.g., "Ivanlee Jackson" or "VibeWorks Team")
2. **Email address:** `info@vibeworksstudio.ai`
3. **❌ UNCHECK** "Treat as an alias"
4. Click **"Next Step"**

### Step 4.5: Configure SMTP Settings

**In the next screen:**

1. **SMTP Server:** `smtp.gmail.com`
2. **Port:** `587`
3. **Username:** Your full Gmail address (e.g., `yourname@gmail.com`)
4. **Password:** Paste the 16-character App Password from Step 4.2
5. **✅ KEEP CHECKED:** "Secured connection using TLS"
6. Click **"Add Account"**

### Step 4.6: Verify Email Address

1. Gmail will send a confirmation code to **info@vibeworksstudio.ai**
2. Check your Gmail inbox (the email was forwarded by Cloudflare)
3. Open the email from Gmail Team
4. Either:
   - Click the confirmation link, OR
   - Copy the confirmation code and paste it in the popup window
5. Click **"Verify"**

### Step 4.7: Update SPF Record (Important!)

1. Go back to **Cloudflare Dashboard**
2. Click your domain → **DNS** → **Records**
3. Find the **TXT record** with content: `v=spf1 include:_spf.mx.cloudflare.net ~all`
4. Click **"Edit"** on that record
5. Change the content to:

```
v=spf1 include:_spf.google.com include:_spf.mx.cloudflare.net ~all
```

6. Click **"Save"**

**This allows Gmail to send emails on behalf of your domain.**

### Step 4.8: Add DMARC Record (Optional but Recommended)

1. Still in Cloudflare DNS settings
2. Click **"Add record"**
3. Fill in:
   - **Type:** TXT
   - **Name:** `_dmarc`
   - **Content:** `v=DMARC1; p=none; rua=mailto:info@vibeworksstudio.ai`
   - **TTL:** Auto
4. Click **"Save"**

**DMARC improves email deliverability and protects against spoofing.**

---

## ✅ PHASE 5: Testing & Verification (5 minutes)

### Test 1: Receiving Emails

1. From any external email (not Gmail), send email TO: **info@vibeworksstudio.ai**
2. Check your Gmail inbox
3. **✅ Success:** Email arrives in Gmail within 30 seconds

### Test 2: Sending Emails

1. Open Gmail → Click **"Compose"**
2. Click the **"From"** field
3. Select **"info@vibeworksstudio.ai"**
4. Send a test email to another email address you control
5. **✅ Success:** Recipient sees sender as info@vibeworksstudio.ai

### Test 3: Email Authentication

1. Send a test email to: **mail-tester@mail-tester.com**
2. Go to https://mail-tester.com
3. Check your score (aim for 9/10 or 10/10)
4. Verify:
   - ✅ **SPF:** PASS
   - ✅ **DKIM:** PASS
   - ✅ **DMARC:** PASS

### Test 4: Reply-To Test

1. Have someone reply to an email you sent from info@vibeworksstudio.ai
2. Their reply should arrive in your Gmail
3. **✅ Success:** You can have email conversations seamlessly

---

## 🎉 Setup Complete!

You can now:
- ✅ Receive emails at **info@vibeworksstudio.ai**
- ✅ Send emails from **info@vibeworksstudio.ai** (via Gmail interface)
- ✅ Manage everything from Gmail (no need for separate webmail)
- ✅ Add more email addresses anytime (contact@, support@, etc.) - FREE

---

## 🆘 Troubleshooting

### Issue: Not receiving emails at info@vibeworksstudio.ai

**Check:**
1. Verify DNS propagation at dnschecker.org (select "MX" records)
2. Confirm destination email is verified in Cloudflare Email Routing
3. Check Gmail spam folder
4. Verify routing rule exists in Cloudflare dashboard

**Solution:**
- Wait 24-48 hours for full DNS propagation
- Re-verify destination email in Cloudflare
- Check Cloudflare Email Routing logs for errors

### Issue: Can't send emails from info@vibeworksstudio.ai

**Check:**
1. App Password created correctly in Google Account
2. SMTP settings in Gmail are correct (smtp.gmail.com, port 587)
3. SPF record includes Gmail: `include:_spf.google.com`

**Solution:**
- Regenerate App Password and try again
- Double-check SMTP username is your FULL Gmail address
- Verify SPF record in Cloudflare DNS

### Issue: Emails going to spam

**Check:**
1. SPF record correct: `v=spf1 include:_spf.google.com include:_spf.mx.cloudflare.net ~all`
2. DMARC record added
3. Test at mail-tester.com

**Solution:**
- Send more emails to build sender reputation (takes 1-2 weeks)
- Avoid spam-like subject lines
- Include unsubscribe link if sending newsletters

### Issue: Website went down after nameserver change

**Check:**
1. A records in Cloudflare DNS point to GitHub Pages IPs:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
2. CNAME record (if www subdomain is used)

**Solution:**
- Add missing A records in Cloudflare DNS
- Enable "Proxy" (orange cloud) for better performance
- Wait 1-2 hours for DNS to propagate

---

## 📋 Quick Reference

### Your Email Addresses

| Email Address | Forwards To | Purpose |
|--------------|-------------|---------|
| info@vibeworksstudio.ai | [Your Gmail] | Main contact |

**To add more addresses:**
1. Cloudflare Dashboard → Email → Email Routing
2. Routing rules → Create address
3. Enter alias, select destination, save

### DNS Records Summary

```
vibeworksstudio.ai DNS Records (Cloudflare)

A Records (Website - GitHub Pages):
@ → 185.199.108.153 (Proxied)
@ → 185.199.109.153 (Proxied)
@ → 185.199.110.153 (Proxied)
@ → 185.199.111.153 (Proxied)

MX Records (Email - Cloudflare):
@ → route1.mx.cloudflare.net (Priority: 1)
@ → route2.mx.cloudflare.net (Priority: 2)
@ → route3.mx.cloudflare.net (Priority: 3)

TXT Records:
@ → v=spf1 include:_spf.google.com include:_spf.mx.cloudflare.net ~all
@ → google-site-verification=BwPiFZ46Ouj7On2RNpKfJirDPvB_KxDiRhkYZFeIpOQ
_dmarc → v=DMARC1; p=none; rua=mailto:info@vibeworksstudio.ai
```

### Gmail SMTP Settings

```
SMTP Server: smtp.gmail.com
Port: 587
Username: [Your Gmail address]
Password: [16-char App Password]
Security: TLS
```

---

## 🚀 Next Steps

### Add More Email Addresses (Optional)

Common professional email addresses you might want:
- contact@vibeworksstudio.ai
- support@vibeworksstudio.ai
- hello@vibeworksstudio.ai
- team@vibeworksstudio.ai
- sales@vibeworksstudio.ai

**Steps:**
1. Cloudflare → Email → Routing rules
2. Create address
3. Forward to same Gmail or different addresses
4. Add each as "Send mail as" in Gmail (follow Step 4.3-4.7)

### Catch-All Email (Optional)

Forward ALL emails to any address at your domain:

1. Cloudflare → Email → Routing rules
2. Click "Catch-all address"
3. Enable catch-all
4. Set destination

**Example:** Emails to hello@, hi@, anyrandomname@ all forward to your Gmail

### Email Signature

Create a professional signature in Gmail:

1. Gmail Settings → General → Signature
2. Create signature for **info@vibeworksstudio.ai**
3. Example:

```
Best regards,
[Your Name]
VibeWorks AI Studio

🌐 vibeworksstudio.ai
📧 info@vibeworksstudio.ai
```

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Cloudflare | Free | $0/month |
| Email Routing | Unlimited | $0/month |
| Gmail | Personal | $0/month |
| **Total** | | **$0/month** |

**Limits on Free Plan:**
- Email addresses: 200 (more than enough)
- Forwarding destinations: 200
- Daily email volume: Unlimited
- Attachment size: Very generous

**No credit card required for any of this setup!**

---

## 📞 Support

If you need help:

- **Cloudflare Community:** community.cloudflare.com
- **Cloudflare Docs:** developers.cloudflare.com/email-routing
- **Gmail Help:** support.google.com/mail

---

**Setup Guide Version:** 1.0
**Last Updated:** 2025-01-10
**Domain:** vibeworksstudio.ai
**Guide Created By:** Claude Code Assistant
