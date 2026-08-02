import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
    plugins: [
        pluginReact({
            reactCompiler: true,
        }),
        pluginTailwindcss(),
    ],
    output: {
        assetPrefix: '/csarch2-ieee754-sp-fp-project/',
    },
    html: {
        title: 'Binary 32-bit Floating-Point Machine'
    }
});
