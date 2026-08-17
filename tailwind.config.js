/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────
//  CrashRating — Tailwind CSS v4 config
//  Custom colors and fonts are defined in src/app/globals.css
//  via the @theme rule (v4 convention). This file only registers
//  the @tailwindcss/typography plugin for the `prose` class.
// ─────────────────────────────────────────────────────────────
module.exports = {
  plugins: [require("@tailwindcss/typography")],
};
