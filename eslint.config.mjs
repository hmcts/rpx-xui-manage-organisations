import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const legacyConfig = require("./.eslintrc.cjs");
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig(compat.config(legacyConfig));
