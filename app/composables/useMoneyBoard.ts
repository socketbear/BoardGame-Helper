import type { MoneyActor, MoneyTx } from '~/types/MoneyBoardTypes'

export default function useMoneyBoard() {
  const { getUniqueId } = useUtils()
  const actors = ref<MoneyActor[]>([])
  const histories = ref<MoneyTx[]>([])

  const hasActor = (id: string) => actors.value.some(a => a.id === id)

  function addActor(input: Omit<MoneyActor, 'id'>): MoneyActor {
    const actor: MoneyActor = { ...input, id: getUniqueId() }
    actors.value.push(actor)
    return actor
  }

  function transfer(fromId: string, toId: string, amount: number): MoneyTx | undefined {
    if (fromId === toId || !(amount > 0) || !Number.isFinite(amount) || !hasActor(fromId) || !hasActor(toId))
      return undefined
    const tx = makeTransfer(actors.value, fromId, toId, amount, getUniqueId(), new Date())
    histories.value.unshift(tx)
    return tx
  }

  function setBalance(id: string, amount: number): MoneyTx | undefined {
    if (Number.isNaN(amount) || !hasActor(id))
      return undefined
    const tx = makeSet(actors.value, id, amount, getUniqueId(), new Date())
    histories.value.unshift(tx)
    return tx
  }

  function revert(txId: string): boolean {
    const tx = histories.value.find(t => t.id === txId)
    return tx ? revertTx(actors.value, tx, new Date()) : false
  }

  function reset() {
    actors.value = []
    histories.value = []
  }

  return { actors, histories, addActor, transfer, setBalance, revert, reset }
}
