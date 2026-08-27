# mcp-pub-dev

pub.dev MCP — package registry for Dart & Flutter.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1481+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_package` | Get metadata for a Dart/Flutter package on pub.dev: latest version, description, homepage, repository, supported SDK environment, and publish date (from the pubspec). |
| `get_package_score` | Get the pub.dev quality score for a Dart/Flutter package: granted/max pub points, like count, popularity, 30-day download count, and classification tags (platforms, SDKs, license). |
| `search_packages` | Search pub.dev for Dart & Flutter packages by keyword. Returns matching package names and a next-page URL. |
| `list_versions` | List all published versions of a Dart/Flutter package on pub.dev, with each version string and its publish date, plus the current latest version. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "pub_dev": {
      "url": "https://gateway.pipeworx.io/pub_dev/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/pub_dev/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1481+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Pub Dev data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
