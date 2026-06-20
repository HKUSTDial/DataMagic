# Pipeline Overview

DataMagic follows a data-to-video pipeline that separates analysis, specification, scene generation, and preview/editing. This document gives a high-level implementation view without exposing internal source code or prompts.

## Core Flow

1. **User input**
   The user uploads or pastes tabular data and describes the visualization goal.

2. **Data understanding**
   The system profiles columns, detects numeric/time/categorical fields, and summarizes candidate insights.

3. **DVSpec planning**
   An AI planner creates a declarative data-video specification with scenes, chart intents, narration, timing, and data bindings.

4. **Scene generation**
   Candidate animated scenes are generated from the DVSpec and selected visual templates.

5. **Orchestration**
   The generated scenes are assembled into a coherent video timeline with narration-aware timing.

6. **Runtime preview**
   The browser preview renders the animated result and supports direct visual edits.

7. **Natural-language refinement**
   Users can ask for changes such as chart type updates, wording edits, color changes, or layout adjustments.

## Product Modes

- **Full Video:** Generates a complete narrated data story across multiple scenes.
- **Single Chart:** Creates one animated visualization quickly from pasted or uploaded data.

## Public Architecture Diagram

![DataMagic framework](../../assets/framework-1.png)

## What Is Not Included Here

The public release materials intentionally avoid exposing full agent prompts, production orchestration code, private template internals, service credentials, and deployment-specific implementation details.

