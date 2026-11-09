---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook]
system: "[[iPhone OBS Cam]]"
---
# Run iPhone OBS Cam


1. Put the PC and the iPhone on the same network. Best: both on the Android's Wi-Fi hotspot or a router (see [[Environment]]).
2. On the PC run `C:\Users\PC\Downloads\iphone-obs-cam\start.bat`.
3. Open the dashboard on the PC (`http://localhost:8080`) and scan the QR code with the iPhone.
4. In Safari, accept the self-signed certificate warning for port 8443 and allow the camera.
5. In OBS add a **Browser Source** pointing to `http://localhost:8080/obs` (room id from the dashboard).

Laggy? You're probably on the fallback path with the iPhone as hotspot. Move both devices to the Android hotspot.

