---
type: runbook
status: active
created: 2026-11-13
updated: 2026-11-13
tags: [runbook, ios]
system: "[[Rouse]]"
---
# Build Rouse for iPhone

How the iPhone app is built and handed out without a Mac ([[ADR-0025 Rouse for iPhone is a Capacitor shell around the live site]]). The app lives in `ios/` of the private repo `GigiBeridzeAxal/rouse`; its settings are in `capacitor.config.ts`.

## Change the app
1. Edit `capacitor.config.ts`, a plugin in `package.json`, or the offline page `native/www/index.html`.
2. Run `npm run ios:sync` and commit what changes under `ios/`.
3. New icon or launch screen: `npm run ios:assets` (draws them from the logo; needs Playwright).
4. Open a pull request. The **iOS / Compile** check builds the app for the simulator on GitHub's Mac. It needs no Apple account.

Web pages need none of this: the app opens the live site, so a normal deploy ([[Deploy Rouse]]) updates it.

## Send a build to TestFlight
Needs the paid Apple Developer Program. One-time setup, all in a browser:
1. developer.apple.com > Membership: note the team id.
2. appstoreconnect.apple.com > Apps > New App: platform iOS, name Rouse, bundle id `com.gigiberidze.rouse` (register it under Certificates, Identifiers & Profiles > Identifiers first if it isn't offered, with Push Notifications ticked).
3. App Store Connect > Users and Access > Integrations > App Store Connect API > generate a key with the **Admin** role. Download the `.p8` file once; Apple shows it only once.
4. GitHub > rouse > Settings > Secrets and variables > Actions, add four secrets: `APPLE_TEAM_ID`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY` (the whole text of the `.p8` file). Gigi pastes these; agents don't type secrets into forms.

Each build:
1. GitHub > rouse > Actions > iOS > Run workflow > tick **Send to TestFlight**.
2. After about 10 minutes the build shows in App Store Connect > TestFlight. The build number is the workflow's run number.
3. First time: answer the export compliance question if asked (the app declares no special encryption), add a group under External Testing, switch on its **public link**, and submit the build for Beta App Review (usually about a day).

## Open the beta on the site
1. Put the public link (`https://testflight.apple.com/join/...`) into `IOS_TESTFLIGHT_URL` in `shared/app.ts`. It is public by design.
2. Merge. From then `https://rouse.gigiberidze.com/ios` (the address inside the QR code) sends phones to TestFlight, and `/download` shows the TestFlight steps.

## Limits to know
- macOS minutes count ten times against the private repo's free 2,000 a month. A run takes roughly 5 to 10 minutes.
- TestFlight builds stop working after 90 days; upload a new one before then.
- First real TestFlight upload has not been run yet (no Apple account as of 2026-11-13), so expect to adjust the workflow on the first try.
