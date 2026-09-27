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

// 400 톤 색상각(hue) 순. 채도 낮은 slate·stone 은 맨 뒤. uno.config.ts safelist 도 이 목록을 쓴다.
// coral·brown·gold·olive·mint·navy 는 기본 팔레트에 없어서 uno.config.ts theme 에 정의돼 있다.
export const COLORS: string[] = [
  'red',
  'coral',
  'orange',
  'brown',
  'amber',
  'gold',
  'yellow',
  'olive',
  'lime',
  'green',
  'mint',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'navy',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'stone',
]
export const ADJUSTS: string[] = ['200', '300', '400', '500', '600', '700', '800', '900']
