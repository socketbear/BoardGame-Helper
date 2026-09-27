import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
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
import { ADJUSTS as adjusts, COLORS as colors } from './app/types/RichEnums'

// 기본 팔레트에 없는 색. 400 은 기본 글자색이 읽히는 밝기, 600 은 테두리용이라 두 톤은 꼭 있어야 한다.
const customColors = {
  coral: { 50: '#fef3f0', 100: '#fde4dd', 200: '#fbc8bb', 300: '#f9a590', 400: '#f67655', 500: '#f3461b', 600: '#d0320b', 700: '#aa2909', 800: '#882107', 900: '#6b1a06', 950: '#441004' },
  brown: { 50: '#faf7f4', 100: '#f4ede6', 200: '#e9dace', 300: '#dbc3ae', 400: '#c8a384', 500: '#b5845a', 600: '#976b44', 700: '#7b5737', 800: '#63462c', 900: '#4d3723', 950: '#312316' },
  gold: { 50: '#fcfaf3', 100: '#f8f3e2', 200: '#f1e6c6', 300: '#e8d6a1', 400: '#dbc170', 500: '#cfab3f', 600: '#af8f2c', 700: '#8f7424', 800: '#725d1d', 900: '#5a4916', 950: '#392e0e' },
  olive: { 50: '#fafaf4', 100: '#f3f4e6', 200: '#e8e9ce', 300: '#d9dbae', 400: '#c5c884', 500: '#b2b55a', 600: '#959744', 700: '#797b37', 800: '#61632c', 900: '#4c4d23', 950: '#303116' },
  mint: { 50: '#f4fbf8', 100: '#e4f6ef', 200: '#c9edde', 300: '#a7e2c9', 400: '#79d2ad', 500: '#4bc391', 600: '#37a477', 700: '#2d8661', 800: '#246b4d', 900: '#1c543d', 950: '#123627' },
  navy: { 50: '#f4f6fb', 100: '#e5e9f5', 200: '#cbd3eb', 300: '#aab7df', 400: '#7e92ce', 500: '#516cbd', 600: '#3c559f', 700: '#314581', 800: '#273768', 900: '#1f2b51', 950: '#141c34' },
}

export default defineConfig({
  theme: {
    colors: customColors,
  },
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
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
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
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
    // 네모 테두리는 bg 색의 숫자를 600 으로 바꿔 만든다(drag/Box.vue · MoneyBox.vue). 회색 은행용.
    'border-gray-600',
  ],
})
