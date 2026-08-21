import { graphqlRequest } from "../services/shopify-api.server";

/**
 * Writes theme files and throws when Shopify refuses any of them.
 *
 * ## Why not use the shared uploader
 *
 * `upsertThemeFilesBatched` handles batching and retries well, but on a
 * `userErrors` response it does this:
 *
 * ```
 * console.error(`[FastUpload] ❌ Shopify user errors in batch:`, …);
 * ```
 *
 * …and then returns normally. The caller cannot tell a rejected write from an
 * accepted one. That is how "Invalid schema: setting with id=… default must be a
 * step in the range" appeared in the log while the apply reported success, and
 * it is the same shape as every other failure this module was written to remove:
 * the error existed, nobody was told.
 *
 * Changing the shared function would touch every caller in the app. This one is
 * used only by PageKit, where a refused write has to stop the apply.
 */

const MUTATION = `
  mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
    themeFilesUpsert(themeId: $themeId, files: $files) {
      upsertedThemeFiles { filename }
      userErrors { field message }
    }
  }
`;

export class ThemeWriteError extends Error {
  constructor(
    message: string,
    /** One entry per file Shopify refused. */
    public readonly failures: Array<{ file: string; message: string }>
  ) {
    super(message);
    this.name = "ThemeWriteError";
  }
}

/** Shopify's documented ceiling for one `themeFilesUpsert` call. */
const BATCH = 50;

export interface WriteResult {
  written: string[];
}

export async function writeThemeFiles(
  shop: any,
  themeId: string,
  files: Record<string, string>
): Promise<WriteResult> {
  const entries = Object.entries(files);
  if (!entries.length) return { written: [] };

  // Snippets and assets before the sections that render them, and templates
  // last. A template referencing a section that has not landed yet renders as a
  // gap until the next request.
  const weight = (name: string) => {
    if (name.startsWith("assets/")) return 1;
    if (name.startsWith("snippets/")) return 2;
    if (name.startsWith("sections/") && name.endsWith(".liquid")) return 3;
    if (name.startsWith("sections/")) return 4; // section groups
    if (name.startsWith("templates/")) return 5;
    return 6;
  };

  const sorted = entries
    .sort((a, b) => weight(a[0]) - weight(b[0]))
    .map(([filename, content]) => ({
      filename,
      body: { type: "TEXT", value: content },
    }));

  const themeGid = `gid://shopify/OnlineStoreTheme/${themeId}`;
  const failures: Array<{ file: string; message: string }> = [];
  const written: string[] = [];

  for (let i = 0; i < sorted.length; i += BATCH) {
    const batch = sorted.slice(i, i + BATCH);

    let res: any;
    try {
      res = await graphqlRequest(shop.shopDomain, shop.accessToken, MUTATION, {
        themeId: themeGid,
        files: batch,
      }, false);
    } catch (err: any) {
      // A transport failure is not a per-file error, so it names the whole
      // batch rather than pretending to know which file was at fault.
      throw new ThemeWriteError(
        `Shopify did not accept ${batch.length} file(s): ${err.message}`,
        batch.map(f => ({ file: f.filename, message: err.message }))
      );
    }

    const payload = res?.themeFilesUpsert;
    for (const e of payload?.userErrors || []) {
      // `field` is a GraphQL path like ["files", "3", "body"] — the index points
      // back at the file, which is more useful than the path.
      const idx = Number((e.field || []).find((f: string) => /^\d+$/.test(f)));
      const file = Number.isInteger(idx) && batch[idx] ? batch[idx].filename : "(unknown file)";
      failures.push({ file, message: e.message });
    }

    for (const f of payload?.upsertedThemeFiles || []) written.push(f.filename);
  }

  if (failures.length) {
    const first = failures[0];
    throw new ThemeWriteError(
      `Shopify refused ${failures.length} of ${sorted.length} file(s). First: ${first.file} — ${first.message}`,
      failures
    );
  }

  return { written };
}
