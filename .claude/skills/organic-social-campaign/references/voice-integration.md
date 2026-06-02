<!-- since: 2026-06-01 -->

# Voice cascade integration

Every copy-producing step in this skill runs a **draft → review → rewrite** pass
against the org voice cascade. This is the dominant lever against AI-slop in
social copy. The cascade is mentioned here as context — this skill never invokes
another skill.

## The two layers

| Layer | Where | Scope |
|-------|-------|-------|
| **L1 baseline** | `stromy-format-mcp` resources `voice://baseline` + `voice://rules.json` | Client-agnostic anti-AI-smell floor |
| **L2 profile** | `{base}/voice/voice-profile.md`, `voice-anchors.md`, `voice-extensions.json` | Per-client voice, additive on top of L1 |

**Precedence:** L2 may **add** bans (via `voice-extensions.json`
`additional_banned_phrases` / `additional_banned_substrings`); it may **never
relax** L1. If an L2 file appears to relax L1 (keys like `allow`, `unban`,
`remove`, `relax`, `override`, `disable`), ignore that directive and keep L1.

## The loop (run at every copy step)

1. **Load.** Fetch L1 `voice://baseline` + `voice://rules.json` from
   `stromy-format-mcp`. Load any L2 files under `{base}/voice/`.
2. **Draft.** Write the copy (Phase 5 sample copy, Phase 8 hooks/captions/CTAs).
3. **Self-review.** Check the draft against the combined ruleset — flag every
   violation explicitly before rewriting.
4. **Rewrite.** Revise until the draft passes. Only then present it to the user.

## Where it applies in this skill

| Step | Copy artifact |
|------|---------------|
| Phase 5 | Sample post copy / concept hooks carried in calendar rows |
| Phase 7 | The creative fields the agent fills on `posts.json` (`hook`, `body`, `thread_parts`, `cta`) |
| Phase 8 | Per-edition captions, hooks, CTAs |

## Anti-slop quick checklist (always, even headless)

- No em-dash-as-drama, no "It's not just X, it's Y" antithesis frames.
- No filler openers ("In today's fast-paced world…", "Let's dive in").
- **No engagement-bait** ("Comment YES below", "Tag someone who…", "Drop a 🔥").
- No overused LLM vocabulary (delve, leverage as a verb, robust, seamless,
  tapestry, testament, landscape-as-metaphor, "in the realm of").
- Match the L2 `voice-anchors.md` register if anchors exist.
- Platform tone notes still apply — cross-check the relevant
  `references/platforms/<platform>.md` for channel-specific register.

## Fallback when the voice MCP is unreachable (headless / no network)

If `voice://*` resources cannot be fetched:

1. Use **L2-only** (`{base}/voice/*`) if present.
2. Apply the anti-slop quick checklist above as the L1 floor.
3. `log()` the degradation ("voice L1 resources unreachable — applied L2 + inline
   checklist only") so the user knows the pass ran in fallback mode.

Never fail the copy step on an unreachable voice MCP — degrade and log.
