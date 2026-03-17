# Email Setup Quick Reference

**Domain:** vibeworksstudio.ai
**Email:** info@vibeworksstudio.ai
**Setup Method:** Cloudflare Email Routing + Gmail SMTP

---

## 🚀 Quick Start Links

| Action | Link |
|--------|------|
| **Cloudflare Sign Up** | https://cloudflare.com |
| **GoDaddy Login** | https://godaddy.com |
| **Gmail Settings** | https://mail.google.com/mail/u/0/#settings/accounts |
| **Google Account Security** | https://myaccount.google.com/security |
| **DNS Propagation Check** | https://dnschecker.org |
| **Email Authentication Test** | https://mail-tester.com |

---

## 📋 Your Current DNS Records (Before Setup)

**Current Nameservers (GoDaddy):**
```
ns31.domaincontrol.com
ns32.domaincontrol.com
```

**A Records (Keep these - GitHub Pages):**
```
vibeworksstudio.ai → 185.199.108.153
vibeworksstudio.ai → 185.199.109.153
vibeworksstudio.ai → 185.199.110.153
vibeworksstudio.ai → 185.199.111.153
```

**TXT Records (Keep these):**
```
vibeworksstudio.ai → google-site-verification=BwPiFZ46Ouj7On2RNpKfJirDPvB_KxDiRhkYZFeIpOQ
```

**MX Records (DELETE these - old Google records):**
```
❌ aspmx.l.google.com (Priority: 1)
❌ alt1.aspmx.l.google.com (Priority: 5)
❌ alt2.aspmx.l.google.com (Priority: 5)
❌ alt3.aspmx.l.google.com (Priority: 10)
❌ alt4.aspmx.l.google.com (Priority: 10)
```

---

## 🔧 Configuration Values You'll Need

### Cloudflare Nameservers (Get these from Cloudflare in Phase 1)

Write your nameservers here:
```
Nameserver 1: _________________________________
Nameserver 2: _________________________________
```

### Gmail App Password (Generate in Phase 4)

Write your app password here:
```
App Password: ____ ____ ____ ____
```

### Gmail SMTP Settings

```
SMTP Server: smtp.gmail.com
Port: 587
Connection: TLS
Username: [Your Gmail address]
Password: [App Password from above]
```

---

## 📧 Final DNS Configuration (After Setup)

### Nameservers (Cloudflare)
```
[Your Cloudflare Nameserver 1]
[Your Cloudflare Nameserver 2]
```

### MX Records (Cloudflare Email Routing)
```
@ → route1.mx.cloudflare.net (Priority: 1)
@ → route2.mx.cloudflare.net (Priority: 2)
@ → route3.mx.cloudflare.net (Priority: 3)
```

### SPF Record
```
Type: TXT
Name: @
Content: v=spf1 include:_spf.google.com include:_spf.mx.cloudflare.net ~all
```

### DMARC Record (Recommended)
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:info@vibeworksstudio.ai
```

### A Records (Unchanged - GitHub Pages)
```
@ → 185.199.108.153 (Proxied: ON)
@ → 185.199.109.153 (Proxied: ON)
@ → 185.199.110.153 (Proxied: ON)
@ → 185.199.111.153 (Proxied: ON)
```

### TXT Records (Unchanged)
```
@ → google-site-verification=BwPiFZ46Ouj7On2RNpKfJirDPvB_KxDiRhkYZFeIpOQ
```

---

## ⏱️ Timeline

| Phase | Active Time | Wait Time | Total |
|-------|------------|-----------|-------|
| **Phase 1:** Cloudflare Setup | 10 min | 0 | 10 min |
| **Phase 2:** Nameserver Change | 5 min | 24-48 hrs | ~24 hrs |
| **Phase 3:** Email Routing | 5 min | 0 | 5 min |
| **Phase 4:** Gmail Config | 10 min | 0 | 10 min |
| **Phase 5:** Testing | 5 min | 0 | 5 min |
| **TOTAL** | **35 min** | **24-48 hrs** | **~24 hrs** |

---

## 🎯 Success Criteria

You'll know setup is complete when:

1. ✅ Nameservers show Cloudflare at dnschecker.org
2. ✅ Test email TO info@vibeworksstudio.ai arrives in Gmail
3. ✅ Test email FROM info@vibeworksstudio.ai sends successfully
4. ✅ Mail-tester.com shows 9/10 or 10/10 score
5. ✅ SPF, DKIM, DMARC all pass
6. ✅ Website still loads at vibeworksstudio.ai

---

## 🆘 Emergency Contacts

**If something goes wrong:**

1. **Website down?**
   - Check A records in Cloudflare DNS
   - Should point to GitHub Pages IPs (185.199.x.x)
   - Enable "Proxy" (orange cloud)

2. **Email not working?**
   - Check dnschecker.org for MX records
   - Verify destination email in Cloudflare
   - Wait 24-48 hours for DNS propagation

3. **Need to rollback?**
   - Go to GoDaddy DNS settings
   - Change nameservers back to:
     - ns31.domaincontrol.com
     - ns32.domaincontrol.com
   - Wait 24 hours

**Support Resources:**
- Cloudflare Community: community.cloudflare.com
- Cloudflare Docs: developers.cloudflare.com/email-routing
- Gmail Help: support.google.com/mail

---

## 💡 Pro Tips

1. **Save your Cloudflare nameservers immediately** - you'll need them for GoDaddy
2. **Don't skip 2FA** on Google Account - required for App Passwords
3. **Save your App Password** - you can't view it again after creation
4. **Wait for full DNS propagation** - don't rush to Phase 3
5. **Test with external email** - don't test from Gmail to Gmail
6. **Check spam folders** during testing
7. **Update SPF record** - critical for sending emails
8. **Add DMARC** - improves deliverability and security

---

## 📞 Adding More Email Addresses Later

Want to add contact@, support@, or hello@? It's easy:

1. Cloudflare → Email → Routing rules
2. Click "Create address"
3. Enter new alias (e.g., "contact")
4. Select destination Gmail
5. Save

Then in Gmail:
1. Settings → Accounts → "Send mail as"
2. Add the new email
3. Follow same SMTP setup steps

**Cost:** $0 for unlimited addresses!

---

## 🎓 What You're Getting

**Free Forever:**
- Professional email addresses (unlimited)
- Email forwarding to Gmail
- Send emails as your domain through Gmail
- No storage limits to worry about
- Enterprise-grade deliverability
- DDoS protection from Cloudflare
- Email analytics in Cloudflare dashboard

**No Credit Card Required!**

---

## 🔒 Security Features

Your setup includes:
- ✅ SPF authentication (prevents spoofing)
- ✅ DKIM signing (verifies authenticity)
- ✅ DMARC policy (protects your domain)
- ✅ TLS encryption (secure transmission)
- ✅ 2FA on Google Account (account security)
- ✅ Cloudflare DDoS protection

**Your domain is well protected!**

---

**Quick Reference Version:** 1.0
**Last Updated:** 2025-01-10
**Setup Type:** Cloudflare Email Routing + Gmail SMTP
