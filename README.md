# TrendX — Frontend + Firebase

Static HTML/CSS/JS pages for TrendX's sign-in, onboarding, home and
dashboard screens, backed by real **Firebase Authentication** and
**Firestore**. No build step and no custom server — push this folder to a
GitHub repo and it runs as-is with GitHub Pages, once you've connected it
to your own Firebase project (below).

## Pages

- `index.html` — Sign in / Sign up (tab toggle), with a real "Continue
  with Google" button (Firebase Google sign-in popup).
- `interests.html` — "Choose what you want to follow" topic picker, shown
  once after a first sign-up (or a first-time Google sign-in).
- `home.html` — Placeholder landing page showing the topics you picked,
  with a link into the dashboard.
- `dashboard.html` — The analytics dashboard (timeline, mood river, map
  heatmap, trending topics, influence network). Currently runs on mock
  data — see the `TODO` comment near the top of its script.

## 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> and create a project.
2. Project settings → General → "Your apps" → Add app → **Web** (`</>`).
3. Copy the config object it gives you into `js/firebase-config.js`,
   replacing the `YOUR_...` placeholders.
4. **Authentication → Sign-in method** → enable **Email/Password** and
   **Google**.
5. **Firestore Database** → Create database (start in production mode).

## 2. Set Firestore security rules

In Firestore → Rules, use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

This lets each signed-in user read and write only their own `users/{uid}`
document — nobody else's.

## 3. How the flow works now

Accounts live in **Firebase Authentication**; each user's name, email,
chosen interests and onboarding status live in a Firestore document at
`users/{uid}` (see `js/auth.js`):

- **Sign up** creates the Firebase Auth account, then writes a Firestore
  doc `{ name, email, interests: [], onboarded: false }`, then routes to
  `interests.html`.
- **Sign in** looks up the existing Firestore doc for that user.
- **Continue with Google** opens a real Google sign-in popup; a Firestore
  doc is created for the account the first time it's used.
- Returning, already-onboarded users skip `interests.html` and land on
  `home.html` directly — this is checked automatically on every page via
  `TrendX.once(...)` / `TrendX.onAuthChange(...)`.
- **Forgot password** sends a real Firebase password-reset email.
- `dashboard.html` and `home.html` redirect back to `index.html` if no
  one is signed in.

All of this lives behind the same `window.TrendX` interface
(`signIn`, `signUp`, `signInWithGoogle`, `signOut`, `saveInterests`,
`onAuthChange`, `once`, `friendlyError`) defined in `js/auth.js`, so the
page-level code never talks to Firebase directly.

## Next step: real dashboard data

`dashboard.html` still charts hardcoded mock arrays (14 fake days of
volume/sentiment, fixed mock nodes, etc.). To make it real, write your
analytics pipeline's output into Firestore (or fetch it from your own
API) and replace those arrays with a fetch scoped to the signed-in user's
`interests`, keyed off `TrendX.once(...)`.

## Viewing it on GitHub

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**, set the source to the `main`
   branch (root folder), and save.
3. GitHub will give you a URL like
   `https://<your-username>.github.io/<repo-name>/` — open it to see the
   live pages.

You can also just open `index.html` directly in a browser (double-click
the file) — everything runs client-side, so no server is needed for a
quick local preview.

## Structure

```
trendx-frontend/
├── index.html            Sign in / sign up
├── interests.html        Topic picker
├── home.html              Placeholder landing page
├── dashboard.html         Analytics dashboard (mock data — see TODO)
├── css/
│   └── style.css          Shared styles (login/interests/home)
├── js/
│   ├── firebase-config.js Firebase project keys — fill these in
│   ├── auth.js            Firebase Auth + Firestore, page wiring for index.html
│   └── interests.js       Topic picker logic
└── README.md
```

## Viewing it on GitHub Pages

1. Push this folder to a GitHub repository.
2. Settings → Pages → set the source to the `main` branch (root folder).
3. Open the URL GitHub gives you
   (`https://<username>.github.io/<repo>/`).

Note: opening `index.html` by double-clicking the file (a `file://` URL)
will **not** work once Firebase is wired in — Firebase Auth requires the
page to be served over `http://` or `https://`. Use GitHub Pages, or run
a local static server (e.g. `npx serve` or `python3 -m http.server`) from
this folder while testing locally.
