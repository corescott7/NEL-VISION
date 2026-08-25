# NEL A VISION Shared Product Foundation

NEL A VISION uses one product vocabulary across web and mobile. The responsive web build is the first implementation surface; mobile screens should reuse the same labels, interaction order, and brand tokens rather than inventing a separate product language.

| Product area | Web route concept | Mobile screen concept | Primary action |
|---|---|---|---|
| Discovery | `/` | Home tab | Browse, search, open a video |
| Search | Search overlay/results | Search screen | Find videos and channels |
| Watch | Watch page | Watch screen | Play, follow, save, continue |
| Channel | Channel page | Channel screen | Follow creator, browse uploads |
| Studio | Creator Studio | Studio tab | Upload, publish, review metrics |
| Earnings | Earnings panel | Earnings screen | Review the initial model and status |
| Account | Sign-in/profile | Account tab | Sign in, manage profile, sign out |

## Brand rules

The official lockup is **NEL A VISION** with the exact tagline **VIDEO UNLEASHED**. Use the red play-button signal as the primary accent, graphite-black as the main surface, silver/white for hierarchy, and restrained warm gray for secondary copy. Typography should pair a confident geometric display face with compact monospaced metadata. The 65% figure must always be labeled as an **initial model** until eligibility, deductions, payment timing, and payout rules are finalized.

## Responsive behavior

On narrow screens, discovery remains the first tab, the search control collapses to an icon that expands on focus, category chips remain horizontally scrollable, video cards collapse from three columns to two and then one, and creator actions remain reachable without hidden hover states. All mobile actions should use visible press feedback and safe-area-aware layouts when implemented in a native shell.

## Current boundary

The current milestone implements the responsive web discovery foundation and the shared information architecture. The native mobile shell, real video transcoding/CDN pipeline, creator publishing mutations, and production payout integration remain subsequent implementation work.
