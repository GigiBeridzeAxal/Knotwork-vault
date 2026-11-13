---
type: decision
status: accepted
created: 2026-11-13
updated: 2026-11-13
date: 2026-11-13
tags: [decision, rouse, ios]
supersedes:
superseded-by:
---
# ADR-0025 Rouse for iPhone is a Capacitor shell around the live site

## Context
On 2026-11-13 Gigi asked for a Capacitor app for [[Rouse]], iPhone first, installed by scanning a QR code on the website. Rouse's pages are a React app served by the Worker; sign-in is a first-party cookie checked against the page's origin ([[ADR-0023 Rouse accounts use email, password and recovery codes]]). Gigi has Windows computers and no Mac. Apple allows installing an app from a website only through TestFlight or the App Store (sideloading from the web exists only in the EU), and both need the paid Apple Developer Program.

## Options considered
1. **Bundle the pages inside the app** (Capacitor's default). Works offline, but the pages would run on `capacitor://localhost`: the session cookie becomes third-party, the origin check must be loosened, and every web change needs a new build and a new TestFlight upload.
2. **A shell that opens the live site** (`server.url`). The app runs the deployed pages with the site's own cookie; a web deploy reaches every phone at once. Needs the network, and Capacitor's docs describe the setting as meant for development.
3. **No app, only a home-screen web app.** Free and installable by QR today, but no Apple push with alarm sounds, and no place for later native parts (critical alerts, calls).

## Decision
Option 2, with option 3 kept as the free fallback until the beta opens.
- App id `com.gigiberidze.rouse`, Capacitor 8, Swift Package Manager (no CocoaPods). Built in: `@capacitor/push-notifications`, `@capacitor/local-notifications`, `@capacitor/app`.
- One page ships inside the app: the "can't connect" page shown when the site can't be reached.
- Inside the app, `/` opens the dashboard instead of the landing page.
- **Builds without a Mac:** a GitHub Actions workflow on GitHub's macOS runners compiles the project, and (run by hand) signs it with Apple's cloud signing and uploads to TestFlight. See [[Build Rouse for iPhone]].
- **The QR code never changes.** It says `https://rouse.gigiberidze.com/ios`. The Worker redirects that to the TestFlight public link once one is set (`IOS_TESTFLIGHT_URL` in `shared/app.ts`) and to `/download` until then.

## Consequences
- The app is useless offline. That matches the product: an alert can't arrive without a network either.
- Most of phase 1 (pairing, the answer screen) can ship as web deploys. A new build is needed only when something native changes.
- A site outage is an app outage, and a bad web deploy reaches the app at once.
- App Store review may ask for more than a wrapped site (guideline 4.2). Push, alarms and the answer screen are the case for it; TestFlight is not affected.
- GitHub's macOS minutes count ten times against a private repo's free 2,000 a month, so the workflow runs only when the app changes or by hand.
- Breaking through silent mode needs Apple's Critical Alerts entitlement, which Apple grants on request and rarely. Not asked for yet.
- Nothing reaches a phone through TestFlight without the Apple Developer Program (99 USD a year). **Gigi chose on 2026-11-13 not to join for now** ("Not now, stay free"), in line with "everything must run for free" ([[About Gigi]]). Until that changes, Rouse on the iPhone is the home-screen web app, and the Capacitor project stays in the repo, compiled by CI and unpublished. Don't ask again unless Gigi brings it up or phase 1 needs Apple push.
