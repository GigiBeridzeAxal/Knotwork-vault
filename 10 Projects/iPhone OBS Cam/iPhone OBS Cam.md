---
type: project
status: active
created: 2026-11-08
updated: 2026-11-09
tags: [project, webrtc, obs]
repo: none yet
---
# iPhone OBS Cam

Use an iPhone as a camera in OBS over the local network, with no native app (Gigi has no Mac).

## How it works
- A Node server (`server.js`) on the Windows PC.
  - Port **8443** HTTPS (self-signed cert) for the phone page.
  - Port **8080** HTTP for OBS: Browser Source at `/obs`, plus a dashboard with a QR code.
- The iPhone opens the page in Safari and streams **directly to OBS over WebRTC** (H.264). No STUN or TURN, LAN only.
- Rooms support several phones at once.
- Start it with `start.bat`.

See [[ADR-0007 iPhone camera via Safari and WebRTC]].

## Where the code is
- `C:\Users\PC\Downloads\iphone-obs-cam`
- Copy in project files: `iphone-obs-cam/`
- No GitHub repo yet. Sessions can't create repos, so Gigi needs to create one (suggested name `iphone-obs-cam`).

## Network (the tricky part)
See [[Environment]]. The PC gets internet by USB tethering from an Android phone, which the iPhone can't reach. It works through a fallback path when the iPhone is the hotspot, but that's laggy. Best: PC and iPhone both on the Android's Wi-Fi hotspot or on a router. Running steps: [[Run iPhone OBS Cam]].

## Next
- [ ] Gigi creates the `iphone-obs-cam` GitHub repo, then push the code
- [ ] Test with both devices on the Android Wi-Fi hotspot
