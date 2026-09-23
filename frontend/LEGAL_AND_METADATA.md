# Policy and metadata launch notes

The policy pages are editable starter text based on the current repository. Confirm the legal operator name, service address, applicable jurisdiction, age eligibility, retention/deletion schedule, actual hosting/email providers and locations, and privacy request process before launch. No specific retention period, governing law, compliance certification or deletion deadline has been assumed.

Current code exposes candidate profiles to authenticated company accounts, not only companies that have received an application. Keep the privacy notice consistent with this behavior, or change the access policy separately.

Reference for privacy notice structure (not a determination that UK law applies): https://ico.org.uk/global/privacy-notice/

Set VITE_SITE_URL to the production origin when building to use it for canonical and Open Graph URLs. Without it, metadata uses the current browser origin. Private/account routes use noindex; this is indexing guidance, not access control.

This is a client-rendered Vite SPA. Route metadata updates after JavaScript runs. Social bots that do not execute JavaScript only see index.html defaults; production per-page previews require server rendering or prerendering. Configure the host to serve index.html for direct requests to frontend routes.

Verify /terms and /privacy-policy as a guest, seeker and company; check footer/signup navigation, section anchor scrolling, document titles, descriptions and canonical URLs after navigating between routes.
