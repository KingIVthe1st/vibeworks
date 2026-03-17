# Email Setup Checklist for vibeworksstudio.ai

Use this checklist to track your progress through the setup process.

---

## 📋 PHASE 1: Cloudflare Setup (10 minutes)

- [ ] Create Cloudflare account at cloudflare.com
- [ ] Add vibeworksstudio.ai to Cloudflare
- [ ] Select FREE plan
- [ ] Review DNS records that Cloudflare scanned
- [ ] **DELETE** all 5 Google MX records (aspmx.l.google.com, alt1-4.aspmx.l.google.com)
- [ ] **KEEP** all A records (185.199.x.x - GitHub Pages)
- [ ] **KEEP** Google verification TXT record
- [ ] Click "Continue" to proceed
- [ ] **COPY YOUR NAMESERVERS** (you'll need these in Phase 2!)
  - Nameserver 1: ____________________
  - Nameserver 2: ____________________

**✅ Phase 1 Complete when:** You have your two Cloudflare nameservers written down

---

## 📋 PHASE 2: Change Nameservers (5 minutes + 24 hour wait)

- [ ] Log into GoDaddy.com
- [ ] Go to "My Products"
- [ ] Find vibeworksstudio.ai → Click "DNS"
- [ ] Scroll to "Nameservers" section
- [ ] Click "Change" or "Manage"
- [ ] Select "Custom" or "I'll use my own nameservers"
- [ ] **REMOVE:** ns31.domaincontrol.com and ns32.domaincontrol.com
- [ ] **ADD:** Your Cloudflare nameservers from Phase 1
- [ ] Click "Save"
- [ ] Ignore GoDaddy's email warning
- [ ] Return to Cloudflare dashboard
- [ ] Click "Check nameservers"
- [ ] Wait for confirmation: "Cloudflare is now protecting your site"

**⏰ DNS Propagation Check:**
- [ ] Go to dnschecker.org
- [ ] Select "NS" type
- [ ] Enter: vibeworksstudio.ai
- [ ] Watch for green checkmarks globally (wait 24-48 hours if needed)

**✅ Phase 2 Complete when:** All locations show green checkmarks with Cloudflare nameservers

---

## 📋 PHASE 3: Email Routing Setup (5 minutes)

**⚠️ Don't start until DNS is fully propagated!**

- [ ] Log into Cloudflare dashboard
- [ ] Select vibeworksstudio.ai
- [ ] Click "Email" in left sidebar
- [ ] Click "Email Routing"
- [ ] Click "Get started" or "Enable Email Routing"
- [ ] Review MX and SPF records Cloudflare will add
- [ ] Click "Add records and enable"
- [ ] Click "Destination addresses" tab
- [ ] Click "Add destination address"
- [ ] Enter your personal Gmail address
- [ ] Click "Send verification email"
- [ ] Check Gmail inbox
- [ ] Click verification link from Cloudflare
- [ ] Return to Cloudflare dashboard
- [ ] Click "Routing rules" or "Email addresses" tab
- [ ] Click "Create address"
- [ ] Enter: `info`
- [ ] Select your verified Gmail as destination
- [ ] Click "Save"

**🧪 Test Receiving:**
- [ ] Send test email TO info@vibeworksstudio.ai from external account
- [ ] Check Gmail inbox
- [ ] Confirm email arrived

**✅ Phase 3 Complete when:** Test email received in Gmail

---

## 📋 PHASE 4: Gmail Sending Setup (10 minutes)

### Part A: Google Account Security

- [ ] Go to myaccount.google.com
- [ ] Click "Security"
- [ ] Enable "2-Step Verification" (if not already enabled)
- [ ] Set up phone/authenticator verification
- [ ] Scroll to "2-Step Verification" section
- [ ] Click "App passwords"
- [ ] Click "Select app" → Choose "Mail"
- [ ] Click "Select device" → Choose "Other (Custom name)"
- [ ] Enter name: "Cloudflare Email"
- [ ] Click "Generate"
- [ ] **COPY the 16-character password**
- [ ] Save password somewhere safe!

### Part B: Gmail Configuration

- [ ] Open Gmail (mail.google.com)
- [ ] Click gear icon (⚙️) → "See all settings"
- [ ] Click "Accounts and Import" tab
- [ ] Find "Send mail as:" section
- [ ] Click "Add another email address"
- [ ] Enter your name in "Name" field
- [ ] Enter: `info@vibeworksstudio.ai` in "Email address" field
- [ ] **UNCHECK** "Treat as an alias"
- [ ] Click "Next Step"

### Part C: SMTP Configuration

- [ ] SMTP Server: `smtp.gmail.com`
- [ ] Port: `587`
- [ ] Username: Your full Gmail address (yourname@gmail.com)
- [ ] Password: Paste the 16-character App Password
- [ ] Keep "Secured connection using TLS" CHECKED
- [ ] Click "Add Account"

### Part D: Email Verification

- [ ] Check Gmail inbox for confirmation email
- [ ] Open email from Gmail Team
- [ ] Click confirmation link OR copy code
- [ ] Paste code in popup if needed
- [ ] Click "Verify"

### Part E: Update DNS Records

- [ ] Go to Cloudflare dashboard
- [ ] Click your domain → DNS → Records
- [ ] Find TXT record: `v=spf1 include:_spf.mx.cloudflare.net ~all`
- [ ] Click "Edit"
- [ ] Change to: `v=spf1 include:_spf.google.com include:_spf.mx.cloudflare.net ~all`
- [ ] Click "Save"

### Part F: Add DMARC (Optional but Recommended)

- [ ] Still in Cloudflare DNS
- [ ] Click "Add record"
- [ ] Type: TXT
- [ ] Name: `_dmarc`
- [ ] Content: `v=DMARC1; p=none; rua=mailto:info@vibeworksstudio.ai`
- [ ] TTL: Auto
- [ ] Click "Save"

**✅ Phase 4 Complete when:** All DNS records updated

---

## 📋 PHASE 5: Testing & Verification (5 minutes)

### Test 1: Receive Email
- [ ] Send email TO info@vibeworksstudio.ai from external account
- [ ] Confirm arrives in Gmail within 30 seconds

### Test 2: Send Email
- [ ] Open Gmail → Compose
- [ ] Click "From" field
- [ ] Select "info@vibeworksstudio.ai"
- [ ] Send test to another email you control
- [ ] Confirm recipient sees sender as info@vibeworksstudio.ai

### Test 3: Email Authentication
- [ ] Send test email to: mail-tester@mail-tester.com
- [ ] Go to mail-tester.com
- [ ] Check score (aim for 9/10 or 10/10)
- [ ] Verify SPF: PASS
- [ ] Verify DKIM: PASS
- [ ] Verify DMARC: PASS

### Test 4: Reply Test
- [ ] Have someone reply to your test email
- [ ] Confirm reply arrives in Gmail
- [ ] Reply back from Gmail using info@vibeworksstudio.ai

**✅ Phase 5 Complete when:** All tests pass

---

## 🎉 SETUP COMPLETE!

You now have:
- ✅ Professional email: info@vibeworksstudio.ai
- ✅ Receiving emails (via Cloudflare Email Routing)
- ✅ Sending emails (via Gmail SMTP)
- ✅ Zero monthly cost
- ✅ Unlimited email addresses available

---

## 📝 Notes & Observations

Use this space to write any issues, questions, or observations during setup:

**Phase 1 Notes:**

**Phase 2 Notes:**

**Phase 3 Notes:**

**Phase 4 Notes:**

**Phase 5 Notes:**

---

## 🆘 Got Stuck?

Refer to the detailed guide: `CLOUDFLARE_EMAIL_SETUP_GUIDE.md`

Or common issues:
- **DNS not propagating?** Wait 24-48 hours, check dnschecker.org
- **Can't receive emails?** Verify destination email in Cloudflare
- **Can't send emails?** Double-check App Password and SMTP settings
- **Emails going to spam?** Wait 1-2 weeks for sender reputation, verify SPF/DKIM

---

**Setup Checklist Version:** 1.0
**Domain:** vibeworksstudio.ai
**Target Email:** info@vibeworksstudio.ai
