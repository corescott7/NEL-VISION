# Project TODO

- [x] Correct the supplied logo wordmark to “NEL A VISION” while preserving the play-button design and “VIDEO UNLEASHED” tagline
- [x] Establish the NEL A VISION red, black, silver, and refined typography design system
- [x] Build responsive public discovery home with navigation, categories, search entry, and featured content
- [x] Build search results experience
- [x] Build video watch page with playback area, metadata, engagement controls, and related videos
- [x] Build creator channel page with profile, follow action, and published video grid
- [x] Add account sign-in and authenticated user states
- [x] Add creator profile and channel-following data model and UI
- [x] Add video upload, publishing, and playback data model and UI
- [x] Build creator studio for video management and essential performance metrics
- [x] Build transparent creator earnings area with clearly labeled initial 65% eligible-revenue model
- [x] Prepare mobile-ready shared information architecture and component guidance
- [x] Add vitest coverage for core platform calculations and creator workflows
- [x] Run type checks, tests, and visual verification on responsive breakpoints
- [x] Document current implementation boundaries, especially payout rules and production video processing

## Follow-up functional wiring

- [x] Implement real search backed by stored video and channel data
- [x] Add actual video playback and related-video data on the watch page
- [x] Render persisted channel video grids and wire follow mutations
- [x] Make authentication actions consistent across all routes
- [x] Add tRPC procedures and DB helpers for channels, follows, videos, uploads, and publishing
- [x] Implement managed-storage upload and publish flows
- [x] Replace studio placeholder metrics with persisted analytics

## Advertiser access and brighter brand update

- [x] Add explicit creator login and advertiser login role paths
- [x] Add advertiser portal for selecting videos and configuring ad placements
- [x] Add advertiser and ad-placement data vocabulary
- [x] Shift the primary web presentation toward a white-led red-black-silver system
- [x] Replace the displayed logo asset with a verified transparent-background version
- [x] Test advertiser and creator entry states, logo rendering, and responsive contrast

## Logo clipping fix

- [x] Ensure the complete NEL A VISION wordmark, including the final N, is visible in desktop and mobile headers

## Homepage marketing video

- [x] Upload the generated NEL A VISION marketing video to managed project storage
- [x] Add a responsive homepage promotional video section with controls and fallback copy
- [x] Verify the video section on desktop and mobile and save a checkpoint

## Monetization eligibility update

- [x] Ensure the earnings ledger assigns 65% of eligible platform revenue to the creator
- [x] Define qualifying content as published videos or Shorts with duration greater than 7 seconds
- [x] Make monetization available after the first 10 qualifying published videos or Shorts
- [x] Show progress, eligibility status, and the 65% creator allocation in Creator Studio
- [x] Add tests for qualification thresholds, duration rule, and creator-share calculation

## Creator access, uploads, and revised monetization

- [x] Fix creator sign-in routing so creators can reliably reach Creator Studio
- [x] Make the Creator Studio upload entry point functional and validate upload metadata
- [x] Define Shorts as under 30 seconds and exactly 9:16
- [x] Define Long videos as over 30 seconds in any aspect ratio
- [x] Require 2 qualifying Shorts and 1 qualifying Long video for monetization
- [x] Replace the prior 10-upload monetization rule in shared logic, persisted metrics, and UI
- [x] Add clear step-by-step monetization instructions for creators
- [x] Add tests and responsive verification for creator access, uploads, and monetization progress

## Creator video library fix

- [x] Add owner-scoped video-library query for uploaded Shorts and Long videos
- [x] Make uploaded records visible immediately after a successful upload
- [x] Add draft/public status, type, duration, ratio, playback, and publish controls
- [x] Add clear empty, loading, error, and success states for the library
- [x] Verify the first upload persists across refresh and appears on desktop and mobile

## Library reliability follow-up

- [x] Add a dedicated library-load error state with retry guidance
- [x] Add publish-action error feedback and retry behavior
- [x] Document the manual end-to-end upload and refresh verification step for the signed-in creator account

## Video deletion and playback metadata

- [x] Add owner-only deletion for each video in a creator's library
- [x] Require confirmation and provide clear success or error feedback when deleting
- [x] Add hashtags to video upload and persisted video metadata
- [x] Show video descriptions and hashtags on the watch page
- [x] Show hashtags and descriptions clearly in the creator library
- [x] Test deletion authorization, metadata persistence, and responsive playback presentation

## Metadata persistence verification

- [x] Test that creator descriptions and normalized hashtags are included in persisted video records
- [x] Add a rolled-back database integration test that inserts and reads description and hashtag metadata
