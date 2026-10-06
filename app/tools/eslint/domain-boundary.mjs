import path from "node:path";

// Allow only relative imports that stay inside src/domain.
// Domain-to-domain aliases are intentionally prohibited: explicit relative
// paths keep the independent domain TypeScript project self-contained.
export const domainBoundary = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      dependency: "Domain dependencies must be relative imports within src/domain.",
      dynamic: "Domain imports must use a static string literal.",
      directive: "Framework directives are forbidden in the deterministic domain.",
      loader: "Module loaders are forbidden in the deterministic domain.",
    },
  },
  create(context) {
    const root = path.resolve(context.cwd, "src/domain");
    const filename = context.filename;
    function check(source) {
      if (!source || typeof source.value !== "string") {
        context.report({ node: source ?? context.sourceCode.ast, messageId: "dynamic" });
        return;
      }
      const specifier = source.value;
      const resolved = path.resolve(path.dirname(filename), specifier);
      const relative = path.relative(root, resolved);
      if (
        !(specifier.startsWith("./") || specifier.startsWith("../")) ||
        relative === ".." ||
        relative.startsWith(".." + path.sep) ||
        path.isAbsolute(relative) ||
        !["", ".ts"].includes(path.extname(resolved))
      ) {
        context.report({ node: source, messageId: "dependency" });
      }
    }
    return {
      ImportDeclaration(node) { check(node.source); },
      ExportNamedDeclaration(node) { if (node.source) check(node.source); },
      ExportAllDeclaration(node) { check(node.source); },
      ImportExpression(node) { check(node.source); },
      TSImportType(node) { check(node.source); },
      TSExternalModuleReference(node) { check(node.expression); },
      ExpressionStatement(node) {
        if (node.directive === "use client" || node.directive === "use server") {
          context.report({ node, messageId: "directive" });
        }
      },
      Identifier(node) {
        if (["require", "module", "exports"].includes(node.name)) {
          context.report({ node, messageId: "loader" });
        }
      },
    };
  },
};
