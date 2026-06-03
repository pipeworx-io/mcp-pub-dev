# mcp-pub-dev

pub.dev MCP — package registry for Dart & Flutter.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 725+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_packages` | Search pub.dev for Dart & Flutter packages by keyword. Returns matching package names and a next-page URL. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "pub-dev": {
      "url": "https://gateway.pipeworx.io/pub-dev/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 725+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Pub Dev data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
