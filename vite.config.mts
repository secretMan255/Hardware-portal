// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

import fs from "node:fs";
import path from "node:path";
const __dirname = import.meta.dirname;

function fixSourceMaps() {
  let currentInterval;
  return {
    name: "fix-source-map",
    enforce: "post",
    transform: function (source) {
      if (currentInterval) {
        return;
      }
      currentInterval = setInterval(function () {
        const nodeModulesPath = path.join(
          __dirname,
          "node_modules",
          ".vite",
          "deps"
        );
        if (fs.existsSync(nodeModulesPath)) {
          clearInterval(currentInterval);
          currentInterval = null;
          const files = fs.readdirSync(nodeModulesPath);
          files.forEach(function (file) {
            const mapFile = file + ".map";
            const mapPath = path.join(nodeModulesPath, mapFile);
            if (fs.existsSync(mapPath)) {
              let mapData = JSON.parse(fs.readFileSync(mapPath, "utf8"));
              if (!mapData.sources || mapData.sources.length == 0) {
                mapData.sources = [
                  path.relative(mapPath, path.join(nodeModulesPath, file)),
                ];
                fs.writeFileSync(mapPath, JSON.stringify(mapData), "utf8");
              }
            }
          });
        }
      }, 100);
      return source;
    },
  };
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    fixSourceMaps(),
    VueRouter({
      dts: "src/typed-router.d.ts",
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        {
          "vue-router/auto": ["useRoute", "useRouter"],
        },
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: "src/components.d.ts",
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
      },
    },
  },
});
