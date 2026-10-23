# Coach button on mobile + admins verifying users directly

## 1. Conversie Coach button (mobile)
- Make the button easier to tap on a phone: at least 48px tall, with a bigger tap area around the lightbulb and score.
- Keep it out of the way:
  - On phones it sits above the bottom bar and the safe area (iPhone home bar), so it never covers buttons in the editor.
  - It shrinks to only the lightbulb and score when you scroll down, and grows again when you stop scrolling.
  - A small "hide" option (long press, or an x inside the panel) tucks it away to a thin tab at the screen edge. That choice is remembered.
- On phones the coach panel opens from the bottom instead of the right, so it is easy to reach with your thumb.

## 2. Admin: verify a user without a request
In the admin member view (search a user, then open them), add a **"Verifiëren"** button. It opens a window with steps:

1. **Choose the type**: Pro (blue mark), Influencer, or Business.
2. **Fill in the details**
   - Pro / Influencer: first name and last name (required).
   - Business: the company's website domain (for example `bakkerij.be`) and the workspace it belongs to (choose an existing one or create one). The mark goes on the shared business profile, not on one person.
3. **Usernames**
   - Pro: the user is offered usernames built from their real name (same rules as now, for example "jandesmet" or "jan.desmet").
   - Influencer: same as Pro, plus the admin can add **exceptions**: specific usernames that are allowed anyway, even without the real name or without numbers (for example "djmax"). Only the names the admin types are allowed.
   - Business: the username is based on the domain name.
4. **Confirm**: the mark is given straight away, the user gets an email and a notice, and they pick their final username from the allowed list the next time they log in.

Everything is logged in the admin audit log (who verified whom, which type, which exceptions). Any open verification requests from that user for the same type are closed automatically, as they are now.

## Technical details
- `ConversionCoachFab.tsx`: `min-h-12`, `bottom: calc(env(safe-area-inset-bottom)+…)`, scroll-collapse with a passive listener, collapsed state in localStorage read in `useEffect`; on mobile the Sheet uses `side="bottom"` (`useIsMobile`).
- New admin server function `adminGrantVerification` (middleware + `assertAdminRole`; Zod input: userId, tier `pro|influencer|business`, firstName/lastName, domain, workspaceId, `allowedHandles[]`). Reuses `verified-handle-builder.ts` for name-based candidates and the existing approved-handles whitelist (`approved-handles.server.ts`) to store the admin exceptions as `approved` entries; claiming stays via `canClaim`.
- Business: domain is validated (no IP or localhost), stored on the workspace; badge `domain` is set on the workspace profile; role checks via `workspaces.server.ts`.
- Calls `verification-dedupe.ts` to cancel open same-tier requests; `writeAudit` entry; mail through the existing verification mail, sent without blocking.
- New UI: `AdminGrantVerificationDialog.tsx`, opened from the member view in `src/pages/Admin.tsx`. Texts in the admin locale bundle.
- Tests: Influencer exceptions only allow listed names; Pro without exceptions refuses names without the real name; non-admin calls are refused; business requires a valid domain.

## Not in this plan
The two uploaded "Smart media autocomplete" briefs are added to the roadmap as open; tell me if you want those done first.
