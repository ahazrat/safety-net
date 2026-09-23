# Chicago beachhead — domain and one roster

Ops only. One neighborhood. No national import, no Stripe, no second Firebase project.

Live app until the custom domain connects: https://safetynet-us.web.app

## Domain (`safety-net.us`)

Checked 2026-09-23 against RDAP and live DNS. Do not spend money from this checklist.

| Fact | Value |
| --- | --- |
| Registered | Yes. GoDaddy.com, LLC (IANA 146). 2024-02-25 → 2027-02-25 |
| DNS host | Wix nameservers `ns14.wixdns.net`, `ns15.wixdns.net` |
| What the name serves now | Wix “connect your domain” page, not Firebase |
| Cloud Domains | Cannot register `.us` |

Public RDAP does not name the GoDaddy or Wix login. The Trello dump treats `safety-net.us` as the intended name. Confirm both logins before changing records. If the domain is in neither account, stop. Do not open a dispute from this file, and do not buy `safety-net.us` again.

1. GoDaddy portfolio: https://dcc.godaddy.com/control/portfolio — `safety-net.us` must be listed.
2. Wix domains: https://manage.wix.com/account/domains — same name must be listed. That account edits DNS. Guide: https://support.wix.com/en/article/managing-dns-records-in-your-wix-account
3. Firebase, as `asifhazrat@gmail.com`: https://console.firebase.google.com/project/safetynet-us/hosting/sites → site `safetynet-us` → **Add custom domain** → `safety-net.us` → **Continue** → copy the TXT value the wizard shows.
4. Wix → Domain Actions → **Manage DNS records**. Remove the apex A records aimed at Wix (`185.230.63.107`, `185.230.63.171`, `185.230.63.186`) and the `www` record aimed at Wix. Leave real mail MX/TXT alone.
5. Add the TXT. Host name blank (Wix uses a blank host as the apex; do not type `@`). Value = the wizard string. Save.
6. In Firebase, **Quick Setup**, then **Verify** after the TXT shows up.
7. Add the A records the wizard prints. The Firebase docs (2026-09-17) use `199.36.158.100` for the apex and for `www`. If the wizard prints a different address, use the wizard.
8. Wait until Hosting says **Connected**. Certificate provisioning can take up to 24 hours.

If the name is in GoDaddy but in no Wix account you can open, switch nameservers back to GoDaddy defaults, then add the same TXT and A records there. Do not move the zone to Cloud DNS unless that Wix path fails; `safetynet-us` is not on a linked billing account.

A new `.us` label is only for the case where both logins lack `safety-net.us`. `.us` needs a US nexus. Porkbun https://porkbun.com/tld/us was $4.43 the first year and $7.00 to renew on 2026-09-23. Dynadot https://www.dynadot.com/domain/us was $4.30 the first year and $6.96 to renew the same day. Do not register it in Cloud Domains.

## One neighborhood roster

Pick one Chicago geography you can walk: one community area, one business corridor, or one existing watch. Not a citywide scrape and not a national station import.

Done when all of these are true:

- [ ] The corridor is named in one sentence (which streets, which watch or shop group).
- [ ] 5–10 real people have accounts on `safetynet-us`. They chose the passwords. No shared demo login, no faker batch.
- [ ] An existing admin granted each provider at least one badge from Account/Admin. Badges are admin-attested, not licenses. Do not market weapons-lethal matching.
- [ ] Each provider has a public username. Email stays on `users/{uid}`.
- [ ] Five listings exist on that corridor, with a real lat/lng, `listingType` of `watch`, `event`, or `defense`, and `teamSize` 1 unless that captain already has people.
- [ ] At least one listing was accepted, messaged, started, and marked done by the people on the roster.
- [ ] The public map at https://safetynet-us.web.app/map shows those pins plus the Chicago crime counts and station pins already shipped.
- [ ] One LinkedIn post on [safety-net-marketplace](https://www.linkedin.com/company/safety-net-marketplace) is a map screenshot and the offer, not a philosophy wall.

Order on the call: create → pin on the map → accept (or captain + join, if `teamSize` > 1) → DM → start → done. Badge chips on the listing and on Jobs should show the hired person’s badges after the admin grant.

Do not seed stand-in names onto the public map to make the checklist look finished.
