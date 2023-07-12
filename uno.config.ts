import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () => import('@iconify-json/carbon').then((i) => i.icons),
        vs: () => import('@iconify-json/vscode-icons').then((i) => i.icons),
      },
    }),
  ],
})
