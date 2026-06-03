interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * pub.dev MCP — package registry for Dart & Flutter.
 */


const BASE = 'https://pub.dev';
const UA = 'pipeworx/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_package',
    description:
      'Get metadata for a Dart/Flutter package on pub.dev: latest version, description, homepage, repository, supported SDK environment, and publish date (from the pubspec).',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'pub.dev package name, e.g. "http" or "provider".' } },
      required: ['name'],
    },
  },
  {
    name: 'get_package_score',
    description:
      'Get the pub.dev quality score for a Dart/Flutter package: granted/max pub points, like count, popularity, 30-day download count, and classification tags (platforms, SDKs, license).',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'pub.dev package name, e.g. "http".' } },
      required: ['name'],
    },
  },
  {
    name: 'search_packages',
    description: 'Search pub.dev for Dart & Flutter packages by keyword. Returns matching package names and a next-page URL.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search terms, e.g. "state management" or "http client".' },
        page: { type: 'number', description: 'Result page (default 1).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_versions',
    description:
      'List all published versions of a Dart/Flutter package on pub.dev, with each version string and its publish date, plus the current latest version.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'pub.dev package name, e.g. "http".' } },
      required: ['name'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_package': {
      const pkg = reqStr(args, 'name', '"http"');
      const data = await pubGet(`/api/packages/${encodeURIComponent(pkg)}`);
      if (isError(data)) return data;
      const latest = (data as Record<string, any>).latest ?? {};
      const pubspec = latest.pubspec ?? {};
      return {
        name: (data as Record<string, any>).name ?? pkg,
        latest_version: latest.version,
        description: pubspec.description,
        homepage: pubspec.homepage,
        repository: pubspec.repository,
        environment: pubspec.environment,
        published: latest.published,
      };
    }
    case 'get_package_score': {
      const pkg = reqStr(args, 'name', '"http"');
      const data = await pubGet(`/api/packages/${encodeURIComponent(pkg)}/score`);
      if (isError(data)) return data;
      const s = data as Record<string, any>;
      return {
        name: pkg,
        grantedPoints: s.grantedPoints ?? null,
        maxPoints: s.maxPoints ?? null,
        likeCount: s.likeCount ?? null,
        popularityScore: s.popularityScore ?? null,
        downloadCount30Days: s.downloadCount30Days ?? null,
        tags: s.tags ?? [],
      };
    }
    case 'search_packages': {
      const query = reqStr(args, 'query', '"http client"');
      const page = typeof args.page === 'number' ? args.page : 1;
      const data = await pubGet(`/api/search?q=${encodeURIComponent(query)}&page=${page}`);
      if (isError(data)) return data;
      const s = data as Record<string, any>;
      return {
        packages: (s.packages ?? []).map((p: any) => p.package),
        next: s.next ?? null,
      };
    }
    case 'list_versions': {
      const pkg = reqStr(args, 'name', '"http"');
      const data = await pubGet(`/api/packages/${encodeURIComponent(pkg)}`);
      if (isError(data)) return data;
      const d = data as Record<string, any>;
      return {
        name: d.name ?? pkg,
        latest: d.latest?.version,
        versions: (d.versions ?? []).map((v: any) => ({ version: v.version, published: v.published })),
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function pubGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) {
    return { error: res.status, message: (await res.text().catch(() => '')).slice(0, 200) || res.statusText };
  }
  return res.json();
}

function isError(data: unknown): data is { error: number; message: string } {
  return typeof data === 'object' && data !== null && 'error' in data;
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
