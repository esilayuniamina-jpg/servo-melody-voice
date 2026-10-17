import { GoogleGenerativeAI } from "@google/generativeai";
import { Octokit } from "octokit";
import Bottleneck from "bottleneck";

// 1. Konfigurasi Anti-Limit (Mencegah RPM & TPM Limit)
const limiter = new Bottleneck({
  minTime: 4500, // Jeda aman ~13 request per menit
  maxConcurrent: 1,
});

// 2. Fungsi Panggil Gemini AI dengan Anti-Limit
export const tanyaGemini = limiter.wrap(async (prompt, apiKey, modelName = "gemini-3.5-flash-lite") => {
  if (!apiKey) throw new Error("Masukkan GEMINI API Key terlebih dahulu.");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  return result.response.text();
});

// 3. Fungsi Kendali GitHub dengan Octokit
export async function cekRepoGitHub(githubToken, owner, repo, path = "") {
  if (!githubToken) throw new Error("Masukkan GITHUB TOKEN terlebih dahulu.");
  const octokit = new Octokit({ auth: githubToken });
  const res = await octokit.rest.repos.getContent({ owner, repo, path });
  return res.data;
}
