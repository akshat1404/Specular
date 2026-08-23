import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCache } from "./cache/cache.js";
import { generateSummaryPdf } from "./summary/pdf.js";
import type { CrawlTarget } from "./targets/types.js";
import type { ProductReport } from "./aggregator/aggregate.js";
import type { ExtractedPage } from "./extractor/types.js";

const REPORTS_ROOT = path.resolve(process.cwd(), "reports");

interface ReportJson {
  target: CrawlTarget;
  report: ProductReport;
}

function parseArgs(argv: string[]): { targetKey: string } {
  const arg = argv.find((a) => a.startsWith("--target="));
  const targetKey = arg?.slice("--target=".length);
  if (!targetKey) {
    throw new Error("usage: summary-pdf --target=<key>  (reads reports/<key>/report.json — run validate/audit for that target first)");
  }
  return { targetKey };
}

function loadReportJson(targetKey: string): ReportJson {
  const reportJsonPath = path.join(REPORTS_ROOT, targetKey, "report.json");
  try {
    return JSON.parse(readFileSync(reportJsonPath, "utf-8")) as ReportJson;
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    throw new Error(
      code === "ENOENT"
        ? `no report.json for target "${targetKey}" at ${reportJsonPath} — run "npm run validate -- --target=${targetKey}" or "npm run audit -- --key=${targetKey} ..." first`
        : `could not read/parse ${reportJsonPath}: ${(e as Error).message}`
    );
  }
}

/**
 * Deliberately its own step, not folded into validate.ts/audit.ts's
 * default path — rendering a second full page plus a PDF export adds real
 * time, and not every run needs a polished handout. Reads the already-
 * written reports/<key>/report.json (works the same whether that target
 * came from the registry via validate.ts or was ad hoc via audit.ts — this
 * has no idea which) and the same content-addressed screenshot cache
 * runCrawlTarget.ts already populated, so it does no crawling of its own.
 */
export async function main(argv: string[] = process.argv.slice(2)): Promise<string> {
  const { targetKey } = parseArgs(argv);
  const { target, report } = loadReportJson(targetKey);

  const extractedByUrl = new Map<string, ExtractedPage>();
  for (const page of report.pages) {
    const cached = readCache(targetKey, page.page);
    if (cached) extractedByUrl.set(page.page, cached);
  }

  const outPath = path.join(REPORTS_ROOT, targetKey, "summary.pdf");
  await generateSummaryPdf(target, report, extractedByUrl, outPath);
  console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
  return outPath;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
