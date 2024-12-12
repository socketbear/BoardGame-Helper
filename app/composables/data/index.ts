import type { IBoardData } from '~/types/RichTypes'
import { BOARD_GAME } from '~/types/RichEnums'

export async function useBoardData(boardGame: BOARD_GAME): Promise<void | IBoardData> {
  if (boardGame === BOARD_GAME.RICH) {
    const { getData } = await import('./rich')
    return getData()
  }
}
