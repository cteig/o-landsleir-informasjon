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
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY ?? "",
  },
};

export default nextConfig;
