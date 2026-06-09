# Claude Code Configuration - RuFlo V3

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues

---

# Shopify Store — Agent Operating Manual

## Store overview
- **Store name:** LumiRecover
- **Domain:** 3dq16a-uc.myshopify.com
- **Niche:** At-Home Red Light Therapy & Recovery Wellness
- **Target customer:** Women 28–48, interested in skincare, anti-aging, and clean beauty. Follows beauty influencers. Spends on serums and SPF. Household income $60k+. Tired of overpriced facials and clinic appointments. Wants premium results at an accessible price. Also resonates with men 30–55 with recovery and biohacking interests (secondary audience).
- **Brand colors:** Deep navy `#1A1A2E` (primary) and Warm rose `#E8534A` (secondary), Off-white `#F8F9FA` (accent)
- **Brand voice:** Confident, warm, and results-driven. Short sentences. Active voice. Benefits-first. Anchors value against premium competitor prices. Never uses: "revolutionary," "game-changer," "unlock your potential," or generic wellness buzzwords.

## Connected tools
- **Shopify MCP:** Live connection to Admin API (products, orders, customers, inventory) — store domain: 3dq16a-uc.myshopify.com
- **Ruflo:** Multi-agent orchestration and memory
- **Higgsfield AI:** Image and video generation for ad creatives (credentials in .env)
- **Meta Ads API:** Ad campaign data and performance via pipeboard-meta-ads MCP

## Agent roster
- **product-researcher** — Finds and vets winning products with full supplier analysis and GO/CAUTION/SKIP verdict
- **product-importer** — Imports approved products to Shopify with pricing, variants, images, and copy
- **store-analyst** — Monitors store performance, flags underperformers, generates weekly summaries
- **product-copywriter** — Writes all SEO-optimized product listings and publishes via Shopify MCP
- **theme-editor** — Edits storefront front-end copy, banners, and visual elements via Shopify MCP
- **ad-creative** — Researches winning ads via Facebook Ad Library and generates creatives via Higgsfield AI

## Standing rules for ALL agents
- Never delete products — only archive
- Never change prices more than 20% without flagging for review
- Always check inventory before creating new listings
- Never publish a product without: title, description, images, price, variants
- New products default to DRAFT status — only go ACTIVE after full review
- Never copy competitor ads directly — take structure, replace identity
- All ad creatives must match LumiRecover brand colors before finalizing
- Always update ledmask.json with any new data found on the LED Red Light Therapy Face Mask

## Pricing rules
- Minimum acceptable margin: 30%
- Markup multiplier: **4.5x supplier cost** (escalate to 5x before flagging if margin falls below 30%)
- All prices end in .99
- Maximum acceptable shipping time: 15 days (flag anything over 7 days as a risk)
- Minimum supplier score: 4.5★ or 95% positive

## Current priorities
1. **Import LED Red Light Therapy Face Mask** as hero SKU — supplier: CJDropshipping ($32/unit), retail $149.99, margin 41.5%
2. **Generate ad creatives** for the LED mask launch campaign via ad-creative agent
3. **Set up LumiRecover storefront** — theme copy, homepage headline, announcement bar, and collection page via theme-editor

## API rate limits
- Shopify REST: 40 requests/second
- Shopify GraphQL: 50 points/second
- Higgsfield: add 1 second delay between generation requests
- Nano Banana 2 (Gemini): add 8 second delay between image generation requests
- Always add 500ms delay between bulk Shopify operations

## Ad Creative Psychology (added 2026-03-28)
- Ad creative agent now runs a 4-phase psychology-driven workflow before generating ANY creative
- Phase 1: Competitive intelligence via Facebook Ad Library + TikTok Creative Center
- Phase 2: Full creative autopsy on top 5 winning ads (hook, emotion, Cialdini stack, structure)
- Phase 3: Psychology-driven angle selection with 5-point conversion checklist
- Phase 4: Creative brief + prompt generation for Nano Banana 2 and Kling
- Agent produces a full strategy report and waits for approval before generating
- All decisions grounded in behavioral psychology: Cialdini's 7 principles, dopamine-driven impulse buying, neuromarketing, loss aversion, and platform-specific scroll-stopping patterns
- Psychology skill located at: `.claude/skills/ad-creative-psychology/SKILL.md`
