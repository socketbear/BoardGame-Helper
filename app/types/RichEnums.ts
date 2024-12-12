export enum UNIT_POSITION {
  FRONT = 'front',
  BACK = 'back',
}

export enum BOARD_GAME {
  RICH,
}

export enum IN_OUT {
  IN = 'in',
  OUT = 'out',
}

export enum FINANCIAL_TYPE {
  PARENT_UNKNOWN = 'unknown',
  CHILD_UNKNOWN = 'unknown-child',
}

export const CUnits: string[] = ['₩', '$', '£', '¥', 'G', '']

export enum STAGE {
  PREPARE, START, END,
}

export const COLORS: string[] = ['red', 'blue', 'green', 'orange', 'amber', 'yellow', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'purple', 'pink', 'rose']
export const ADJUSTS: string[] = ['200', '300', '400', '500', '600', '700', '800', '900']
