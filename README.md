# MetaMux

**A terminal-native Web3 developer workspace that turns natural language into cryptographically scoped, gasless, on-chain execution — powered by the MetaMask Smart Accounts Kit, ERC-7715 Advanced Permissions, EIP-7702, ERC-7710 delegation redemption, and Venice AI.**

Deployed and tested on **Ethereum Sepolia**.

-----

## How MetaMux Meets the Qualification Requirements

### 1. MetaMask Smart Accounts Kit — Signer-Agnostic Integration

MetaMux integrates the **`@metamask/smart-accounts-kit`** as the core account layer. The kit is signer-agnostic by design, so MetaMux wires it up with **Privy** as the embedded wallet/signer provider, using **`Implementation.Hybrid`** as the smart account implementation.

What this gives MetaMux:

- A smart account is provisioned per user without requiring them to install or manage a browser extension wallet — the signer is abstracted behind Privy, while the Smart Accounts Kit handles account creation, signing requests, and delegation plumbing.
- Because the kit is signer-agnostic, the same delegation/permission flow described below would work identically if swapped to MetaMask Extension, MetaMask Embedded Wallets, or Dynamic — the Smart Accounts Kit is the integration surface, not the signer.
- All downstream Advanced Permissions, EIP-7702 upgrade, and ERC-7710 redemption logic flows through this single Smart Accounts Kit instance.

This is the load-bearing integration: **every execution path in MetaMux (delegation creation, revocation, and relayed execution) goes through the Smart Accounts Kit**, not a hand-rolled signing/account layer.

-----

### 2. Advanced Permissions (ERC-7715)

MetaMux’s primary user-facing flow — `/delegate` — is a direct implementation of ERC-7715 **Advanced Permissions**:

1. The user types a natural-language intent in the TUI (e.g. *“send 0.01 ETH to vitalik.eth every day for the next 7 days, max 0.1 ETH total”*).
1. **Venice AI** parses this into a **typed, schema-constrained permission object** — target, token, amount, time window/recurrence — validated against MetaMux’s permission schema definition before anything is sent on-chain.
1. MetaMux’s local permission cache is checked first. If a matching, unexpired permission already exists, the agent **skips straight to execution** — no re-prompt, no re-signing.
1. On a cache miss, MetaMux calls **`requestExecutionPermissions`** via the Smart Accounts Kit. This is the actual ERC-7715 request: it opens a browser tab where the user reviews and signs the permission grant.
1. The signed, caveat-enforced permission comes back as an **encrypted delegation payload**, which the user copies into the TUI via `/delegate`.

This means the agent never receives a private key, a raw signature for arbitrary actions, or unscoped access — it receives a **cryptographically bounded permission object** whose limits (spend cap, time window, allowed target) are enforced by on-chain caveat enforcer contracts from the **Sepolia Delegation Framework**, not by application logic or by trusting the LLM’s output.

-----

### 3. EIP-7702 — Automatic EOA → Smart Account Upgrade

A key architectural discovery in MetaMux: **calling `requestExecutionPermissions` (ERC-7715) via the Smart Accounts Kit internally triggers the EIP-7702 account upgrade automatically** on the user’s first delegation.

Practically, this means:

- The user does **not** need a separate “upgrade my account” step, transaction, or UI.
- The first time a user grants a permission through `/delegate`, their EOA is upgraded to a smart-account-capable address (EIP-7702) as a side effect of the ERC-7715 permission request itself.
- All subsequent permission requests and redemptions operate against this upgraded account.

This removed an entire class of manual-upgrade flows that were originally scoped (and prototyped) before this behavior was confirmed — MetaMux now relies entirely on the Smart Accounts Kit’s built-in handling of the 7702 upgrade path.

-----

### 4. ERC-7710 — Delegation Redemption

Granting a permission (ERC-7715) and **acting on it** (ERC-7710) are distinct steps, and MetaMux implements both:

- After `/delegate` decrypts the signed delegation payload, MetaMux **resolves the caveat enforcers** (spend caps, time windows, allowed targets) against the Sepolia Delegation Framework contracts and prints a Venice AI-generated, plain-language disclosure of exactly what the agent is now permitted to do — *before* any redemption happens.
- When the agent later executes an action (e.g. the daily transfer in the example above), MetaMux constructs the **ERC-7710 redemption call** — the on-chain action that consumes/exercises the previously granted delegation — and hands it to the relayer.
- The **1Shot Permissionless Relayer** submits this redemption gaslessly on Ethereum Sepolia. The contract-level Delegation Manager enforces that the redeemed action stays within the bounds of the signed caveats — if the agent (or Venice AI) tries to exceed the granted scope, the redemption reverts at the contract level, regardless of what the model output says.
- `/revoke` invalidates the active delegation **on-chain** and clears it from the local cache — terminating the agent’s redemption rights immediately, not just hiding the permission from the UI.

This is the security model in one sentence: **ERC-7715 scopes authority at signing time; ERC-7710 redemption is the only path to act on it; caveat enforcers — not the LLM — are the boundary.**

-----

## Demo Flow (Main Application Path)

The recorded demo exercises the Smart Accounts Kit integration end-to-end through the TUI’s primary commands:

|Command              |What it demonstrates                                                                                                                                                                |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`/delegate`          |ERC-7715 permission request via Smart Accounts Kit → EIP-7702 auto-upgrade → encrypted payload returned → decrypted in TUI → caveat resolution → Venice AI plain-language disclosure|
|*(agent action)*     |ERC-7710 redemption of the granted delegation, relayed gaslessly via 1Shot                                                                                                          |
|`/models`            |Hot-swap between Venice AI models mid-session for intent parsing/disclosure                                                                                                         |
|`/x402 inspect <url>`|Inspects payment schema of an x402 endpoint (scheme, network, asset, amount, payTo)                                                                                                 |
|`/revoke`            |On-chain invalidation of the active delegation + local cache purge                                                                                                                  |

Every step above runs against the live Smart Accounts Kit instance configured with Privy + `Implementation.Hybrid` — there is no mocked signing, no simulated permission object, and no off-chain-only “pretend” execution.

-----

## Architecture

```
Input → Parse → Cache → Delegate → Execute
```

- **Input**: Natural-language command typed into the `@opentui/react` TUI.
- **Parse**: Venice AI converts the intent into a typed permission schema (target, amount, token, time bounds).
- **Cache**: Local permission store is checked; a matching unexpired permission skips directly to **Execute**.
- **Delegate**: On a cache miss, the Smart Accounts Kit issues an ERC-7715 `requestExecutionPermissions` call (triggering the EIP-7702 upgrade if needed), the user signs in-browser, and the encrypted delegation is pasted back into the TUI via `/delegate`.
- **Execute**: MetaMux performs ERC-7710 redemption of the granted permission; the 1Shot Permissionless Relayer submits it gaslessly on Sepolia, bounded by the on-chain caveat enforcers.

-----

## Tech Stack

- **Account layer**: `@metamask/smart-accounts-kit`, Privy (`Implementation.Hybrid`)
- **Permissions**: ERC-7715 (Advanced Permissions), EIP-7702 (account upgrade), ERC-7710 (delegation redemption)
- **AI intent layer**: Venice AI (5 hot-swappable models) for intent parsing and caveat disclosure
- **Relayer**: 1Shot Permissionless Relayer (gasless execution on Sepolia)
- **Payments**: x402 (per-call settlement for Venice AI inference + relayer usage)
- **Frontend/TUI**: Vite + React + Tailwind (landing page); `@opentui/react`, Zustand, Bun runtime (TUI)
- **Backend**: Django, storing signed delegations as stringified JSON in Redis
- **Network**: Ethereum Sepolia

-----

## Track Alignment Summary

- **Best Use of Venice AI** — dual role as (1) deterministic, schema-constrained intent parser feeding directly into ERC-7715 permission requests, and (2) plain-language caveat disclosure layer translating on-chain enforcement terms for the user.
- **Best x402** — every Venice AI call and relayer redemption is settled per-use via x402; `/x402 inspect` provides standalone endpoint-inspection tooling for the broader x402 ecosystem.
- **Best Agent / ERC-7710** — the agent’s authority is entirely defined by signed, on-chain-enforced ERC-7715 permissions, exercised exclusively through ERC-7710 redemption, with `/revoke` providing instant on-chain termination.
