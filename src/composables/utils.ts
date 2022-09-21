export const getUniqueId = (length = 16): string => {
  return Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace('.', '')
}

export const getColors = (): string[] => {
  return ['red', 'blue', 'green', 'orange', 'amber', 'yellow', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'pink', 'rose']
}

export const getColorAdjusts = (): string[] => {
  return ['400', '500', '600', '700', '800', '900']
}
