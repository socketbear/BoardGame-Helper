import type { IBoardData } from '~/types'
import { BOARD_GAME } from '~/enums'

export const useBoardData = async (boardGame: BOARD_GAME): Promise<void | IBoardData> => {
  if (boardGame === BOARD_GAME.RICH) {
    const { getData } = await import('./rich')
    return getData()
  }
}
