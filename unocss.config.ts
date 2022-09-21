import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
const colors: string[] = ['red', 'blue', 'green', 'orange', 'amber', 'yellow', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'pink', 'rose']
const adjusts: string[] = ['200', '300', '400', '500', '600', '700', '800', '900']

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    ['calc-border', 'border-2 border-gray-600 rounded'],
    ['tiny-btn', 'border px-1 hover:bg-green-600 hover:text-white hover:border-green-600 active:bg-green-300'],
    ['tiny-del-btn', 'border px-1 hover:bg-red-600 hover:text-white hover:border-red-600 active:bg-red-300'],
    ['name-tag', 'hover:bg-green-600 hover:text-white hover:border-green-600 active:bg-green-300'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: [
    ...'prose prose-sm m-auto text-left'.split(' '),
    ...Array.from({ length: colors.length }, (_, i) => `bg-${colors[i]}-400`),
    ...Array.from({ length: adjusts.length }, (_, i) => `bg-gray-${adjusts[i]}`),
    ...Array.from({ length: colors.length }, (_, i) => `border-${colors[i]}-600`),
  ],
})
