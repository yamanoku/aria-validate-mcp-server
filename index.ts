#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import process from "node:process";

import {
  validateRole,
  ValidateRoleInputSchema,
} from "./tools/validate-role.ts";
import {
  validateAriaAttribute,
  validateAriaInputSchema,
} from "./tools/validate-aria.ts";
import {
  listAriaData,
  ListAriaDataInputSchema,
} from "./tools/list-aria-data.ts";

// MCPサーバーの初期化
const server = new McpServer({
  name: "ARIA Validate MCP Server",
  version: "0.0.1",
  capabilities: {
    tools: {},
  },
});

// Tools
server.tool(
  "validate_role_attribute",
  {
    title: "Role属性のバリデーション",
    description:
      "指定されたARIAロールが有効かどうかを検証し、そのプロパティ、必須属性、サポートされている属性を返します",
    inputSchema: ValidateRoleInputSchema,
    readOnlyHint: true,
  },
  async ({ role }) => {
    const result = await validateRole({ role });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result as unknown as { [x: string]: unknown },
    };
  },
);

server.tool(
  "validate_aria_attribute",
  {
    title: "ARIA属性の検証",
    description:
      "ARIA属性が存在するか確認し、指定されたロールとの互換性をチェックし、属性値を検証します",
    inputSchema: validateAriaInputSchema,
    readOnlyHint: true,
  },
  async ({ attribute, value }) => {
    const result = await validateAriaAttribute({ attribute, value });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result as unknown as { [x: string]: unknown },
    };
  },
);

server.tool(
  "list_arias_roles_data",
  {
    title: "ARIA・Role属性のリスト一覧",
    description:
      "aria-queryから利用可能なすべてのARIAロールおよび属性をリスト表示します。フィルタリングも可能です",
    inputSchema: ListAriaDataInputSchema,
    readOnlyHint: true,
  },
  async ({ type }) => {
    const result = await listAriaData({ type });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result as unknown as { [x: string]: unknown },
    };
  },
);

// 起動
async function setMCPServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ARIA Attribute Server running on stdio");
}

setMCPServer().catch((error) => {
  console.error("Fatal error in setMCPServer():", error);
  process.exit(1);
});
