# Shipping Energy-Matched Scheduler to the App Store

The web app is already wrapped as a native iOS project via
[Capacitor](https://capacitorjs.com) — see `capacitor.config.ts` and the
`ios/` folder. Everything below needs a Mac with Xcode installed; none of it
can be done on Linux/Windows.

## One-time setup

1. **Install Xcode** from the Mac App Store (free, but large — a few GB).
   Open it once and let it install additional components when prompted.
2. **Enroll in the Apple Developer Program** at
   [developer.apple.com/programs](https://developer.apple.com/programs) —
   $99/year, required to install on a real device or submit to the App
   Store (a free account only lets you run in the Simulator).
3. **Clone the repo** and install dependencies:
   ```bash
   git clone https://github.com/alizaherum/Task-autopsy-app.git
   cd Task-autopsy-app
   git checkout claude/energy-matched-scheduler-lkw6ai
   npm install
   ```

No `.env` or backend setup is needed — all data lives in `localStorage` on
the device.

## Building and opening in Xcode

Every time you change the app and want to test/ship an update:

```bash
npm run build      # rebuilds the web app into dist/
npx cap sync ios    # copies dist/ into the iOS project
npx cap open ios    # opens the project in Xcode
```

In Xcode:

1. Select the **App** target → **Signing & Capabilities** tab.
2. Under **Team**, pick your Apple Developer account (Xcode will offer to
   create the signing certificate automatically).
3. Change the **Bundle Identifier** if you want something other than
   `com.energymatchedscheduler.app` (must be unique across the entire App
   Store — you register whatever you choose in App Store Connect in the
   next section). To change it here, also update `appId` in
   `capacitor.config.ts` and re-run `npx cap sync ios`.
4. Plug in an iPhone (or pick a Simulator) and hit **Run** (▶) to test it
   for real before going further.

The app icon and launch screen are already generated and in place
(`ios/App/App/Assets.xcassets`) — regenerate them any time by editing the
source images in `resources/` (`icon-only.png` at 1024×1024,
`splash.png` at 2732×2732, both flat — no alpha channel, per Apple's
requirements) and running:
```bash
npx @capacitor/assets generate --ios
```

## Registering the app in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) →
   **Apps** → **+** → **New App**.
2. Platform: iOS. Name: whatever you want shown in the App Store (this can
   differ from the internal app name). Bundle ID: register the same one you
   set in Xcode. SKU: any internal identifier (e.g.
   `energy-matched-scheduler-1`).
3. Fill in required metadata before you can submit a build:
   - **Privacy Policy URL** — technically required by App Store Connect even
     though this app collects no personal data or account info (everything
     stays in local device storage). A one-line page stating "this app
     collects no data" satisfies it — ask me to draft one when you're ready.
   - **App description, keywords, support URL**
   - **Screenshots** — at minimum for one device size (e.g. 6.7" iPhone).
     Take these from the Simulator (Cmd+S saves a screenshot) once the app
     is running.
   - **Age rating questionnaire**
   - **App category** (Productivity fits best)

## Uploading a build

1. In Xcode: **Product → Archive** (only enabled when a real device or
   "Any iOS Device" is selected as the run target, not a Simulator).
2. Once archived, the **Organizer** window opens automatically → select the
   archive → **Distribute App** → **App Store Connect** → follow the
   prompts (Xcode handles signing and upload).
3. Back in App Store Connect, the build appears under **TestFlight** after
   Apple finishes processing it (usually 10–30 minutes).

## Testing before release (recommended)

Use **TestFlight** to install the app on your own phone (and anyone else's,
by inviting their email) before submitting for public review. No extra
setup needed beyond what's above; just add internal testers in App Store
Connect → TestFlight.

## Submitting for review

Once metadata is filled in and a build is attached: App Store Connect →
your app → **App Store** tab → **Submit for Review**. Apple's review
typically takes 1–3 days. The main thing worth knowing up front:

- **Guideline 4.2 (Minimum Functionality)** — Apple sometimes rejects apps
  that feel like "just a website in a wrapper." This app has real native
  chrome (icon, splash, no browser UI) and works fully offline (everything
  is local storage, no network calls at all), which should satisfy this,
  but if rejected on this ground, adding one more native-feeling touch
  (haptics, a native share sheet, home screen widget, etc.) via a Capacitor
  plugin usually resolves it.
- Since there's no sign-in or account of any kind, there's nothing for the
  reviewer to get stuck on there — just make sure the App Review notes
  mention that no login is required.

## Updating the app after it's live

Same build loop as above (`npm run build` → `cap sync` → Archive →
Distribute), but bump the version/build number in Xcode (General tab)
before each new archive — Apple requires every upload to have a higher
build number than the last.
