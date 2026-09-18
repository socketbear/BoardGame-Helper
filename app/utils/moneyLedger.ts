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

/**
 * 대상 거래를 취소하는 새 `revert` 거래를 만들어 적용한다. 대상은 `revertedById` 만 찍힌다.
 * 대상 deltas 가 있으면 부호 반전 적용, 비었으면 `toId` 를 대상 `prevBalance` 로 복원
 * (새 거래는 deltas 를 비우고 복원 직전 잔액을 prevBalance 로 남겨 다시 취소할 수 있게 한다).
 * 이미 취소된 거래면 undefined.
 */
export function revertTx(actors: MoneyActor[], target: MoneyTx, id: string, now: Date): MoneyTx | undefined {
  if (target.revertedById)
    return undefined
  const actor = actors.find(a => a.id === target.toId)
  const prevBalance = actor?.balance
  const restore = Object.keys(target.deltas).length === 0
  const deltas: Record<string, number> = {}
  if (!restore) {
    for (const [actorId, delta] of Object.entries(target.deltas))
      deltas[actorId] = -delta
    applyDeltas(actors, deltas, 1)
  }
  else if (actor && target.prevBalance !== undefined) {
    actor.balance = target.prevBalance
  }
  target.revertedById = id
  return {
    id,
    timestamp: now,
    type: 'revert',
    fromId: target.fromId,
    toId: target.toId,
    amount: target.amount,
    deltas,
    prevBalance,
    revertOfId: target.id,
  }
}
