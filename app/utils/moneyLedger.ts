import type { MoneyActor, MoneyTx } from '../types/MoneyBoardTypes'

/** actor 잔액에 deltas 를 sign 방향으로 적용한다(제자리 수정). Infinity 잔액은 유한 증감에 영향받지 않는다. */
export function applyDeltas(actors: MoneyActor[], deltas: Record<string, number>, sign: 1 | -1): void {
  for (const actor of actors) {
    const delta = deltas[actor.id]
    if (delta !== undefined)
      actor.balance += sign * delta
  }
}

export function makeTransfer(actors: MoneyActor[], fromId: string, toId: string, amount: number, id: string, now: Date): MoneyTx {
  const tx: MoneyTx = {
    id,
    timestamp: now,
    type: 'transfer',
    fromId,
    toId,
    amount,
    deltas: { [fromId]: -amount, [toId]: amount },
  }
  applyDeltas(actors, tx.deltas, 1)
  return tx
}

export function makeSet(actors: MoneyActor[], actorId: string, amount: number, id: string, now: Date): MoneyTx {
  const actor = actors.find(a => a.id === actorId)
  const prevBalance = actor?.balance ?? 0
  // 무한대가 끼면 증감으로 표현할 수 없다(∞ − ∞ = NaN) → deltas 를 비우고 롤백은 prevBalance 복원.
  const deltas = Number.isFinite(prevBalance) && Number.isFinite(amount)
    ? { [actorId]: amount - prevBalance }
    : {}
  if (actor)
    actor.balance = amount
  return { id, timestamp: now, type: 'set', toId: actorId, amount, deltas, prevBalance }
}

/** 거래의 deltas 를 부호 반전해 재적용한다. 이미 취소된 거래면 false. */
export function revertTx(actors: MoneyActor[], tx: MoneyTx, now: Date): boolean {
  if (tx.revertedAt)
    return false
  if (tx.type === 'set' && Object.keys(tx.deltas).length === 0 && tx.prevBalance !== undefined) {
    const actor = actors.find(a => a.id === tx.toId)
    if (actor)
      actor.balance = tx.prevBalance
  }
  else {
    applyDeltas(actors, tx.deltas, -1)
  }
  tx.revertedAt = now
  return true
}
