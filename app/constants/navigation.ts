export interface NavItem {
  title: string
  path: string
  icon?: string
}

export const gameNavItems: NavItem[] = [
  { title: '부자 만들기', path: '/games/rich', icon: 'i-carbon-money' },
  { title: '하나비', path: '/games/hanabi', icon: 'i-carbon-fire' },
  { title: '판타지 왕국', path: '/games/fantasy-kingdom', icon: 'i-carbon-castle' },
  { title: '세븐 원더스 듀얼', path: '/games/seven-wonders-duel', icon: 'i-carbon-trophy' },
  { title: '카스카디아', path: '/games/cascadia', icon: 'i-carbon-tree' },
]

export const toolNavItems: NavItem[] = [
  { title: '머니 보드', path: '/tools/money-board', icon: 'i-carbon-currency' },
]

export const devNavItems: NavItem[] = [
  { title: 'Sandbox', path: '/sandbox', icon: 'i-carbon-code' },
]
