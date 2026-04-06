import type { NextConfig } from "next";
import { readFileSync } from "node:fs";

function getGitSha(): string {
  try {
    return readFileSync("git-sha.txt", "utf-8").trim();
  } catch {
    return "dev";
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_GIT_SHA: getGitSha(),
  },
};

export default nextConfig;
