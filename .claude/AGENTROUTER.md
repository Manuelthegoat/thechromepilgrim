# AgentRouter configuration

This project routes Claude Code through AgentRouter's Anthropic-compatible API.

Before starting Claude Code, set an AgentRouter key in your shell:

```bash
export ANTHROPIC_AUTH_TOKEN='your-new-agentrouter-key'
claude
```

The project settings configure the Anthropic-compatible endpoint
`https://agentrouter.org` (without `/v1`) and select `claude-opus-4-8`.
The API key is intentionally not stored in the project.

To temporarily switch to another model made available by AgentRouter, start Claude
Code with its documented model ID. For example:

```bash
ANTHROPIC_MODEL='claude-opus-4-7' claude
```

AgentRouter's Claude Code guide currently documents `claude-opus-4-6`,
`claude-opus-4-7`, and `claude-opus-4-8`; it does not document an Opus 5 ID.
