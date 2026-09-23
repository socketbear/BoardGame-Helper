// node test/moneyLedger.check.mjs — moneyLedger 순수 로직 self-check (Node 타입 스트리핑)
import assert from 'node:assert/strict'
import process from 'node:process'
import { makeSet, makeTransfer, revertTx } from '../app/utils/moneyLedger.ts'

const now = new Date()
let seq = 0
const nextId = () => `tx${++seq}`
const actor = (id, balance, isBank = false) => ({ id, name: id, color: 'bg-gray-400', balance, isBank })
const bal = (actors, id) => actors.find(a => a.id === id).balance
const allTxs = []
function track(tx) {
  allTxs.push(tx)
  return tx
}
/** revertTx 를 새 id 로 호출하고 만들어진 revert 거래를 기록에 넣는다. */
function rev(actors, target) {
  const tx = revertTx(actors, target, nextId(), now)
  return tx && track(tx)
}
/** 체인에서 아직 취소되지 않은(=취소 가능한) 거래 id 목록. */
const revertable = chain => chain.filter(tx => !tx.revertedById).map(tx => tx.id)
const allActors = []
function board(...list) {
  allActors.push(...list)
  return list
}

function check(name, fn) {
  fn()
  process.stdout.write(`ok - ${name}\n`)
}

check('1. set 취소는 deltas 부호 반전(뒤 transfer 보존) → 철수 7000', () => {
  const actors = board(actor('철수', 10000), actor('영희', 0))
  const set = track(makeSet(actors, '철수', 5000, nextId(), now))
  track(makeTransfer(actors, '철수', '영희', 3000, nextId(), now))
  assert.equal(bal(actors, '철수'), 2000)
  const r = rev(actors, set)
  assert.equal(r.type, 'revert')
  assert.equal(r.revertOfId, set.id)
  assert.deepEqual(r.deltas, { 철수: 5000 })
  assert.equal(set.revertedById, r.id)
  assert.equal(set.amount, 5000)
  assert.deepEqual(set.deltas, { 철수: -5000 })
  assert.equal(bal(actors, '철수'), 7000)
  assert.equal(bal(actors, '영희'), 3000)
})

check('2. 무한 은행 transfer 와 취소 → 은행 ∞ 유지', () => {
  const actors = board(actor('은행', Infinity, true), actor('철수', 0))
  const tx = track(makeTransfer(actors, '은행', '철수', 1000, nextId(), now))
  assert.equal(bal(actors, '은행'), Infinity)
  assert.equal(bal(actors, '철수'), 1000)
  const r = rev(actors, tx)
  assert.equal(r.fromId, '은행')
  assert.equal(r.toId, '철수')
  assert.equal(r.amount, 1000)
  assert.equal(bal(actors, '철수'), 0)
  assert.equal(bal(actors, '은행'), Infinity)
})

check('5. ∞ 가 낀 set 취소 → prevBalance 복원', () => {
  const a = board(actor('은행', 50000, true))
  const toInf = track(makeSet(a, '은행', Infinity, nextId(), now))
  assert.deepEqual(toInf.deltas, {})
  assert.equal(bal(a, '은행'), Infinity)
  const ra = rev(a, toInf)
  assert.deepEqual(ra.deltas, {})
  assert.equal(ra.prevBalance, Infinity)
  assert.equal(bal(a, '은행'), 50000)

  const b = board(actor('은행', Infinity, true))
  const toFinite = track(makeSet(b, '은행', 50000, nextId(), now))
  assert.deepEqual(toFinite.deltas, {})
  assert.equal(bal(b, '은행'), 50000)
  assert.ok(rev(b, toFinite))
  assert.equal(bal(b, '은행'), Infinity)
})

check('3. 같은 거래 두 번 revert → 두 번째 undefined, 잔액·기록 불변', () => {
  const actors = board(actor('철수', 10000), actor('영희', 0))
  const tx = track(makeTransfer(actors, '철수', '영희', 2500, nextId(), now))
  const r = rev(actors, tx)
  assert.ok(r)
  const snapshot = actors.map(a => a.balance)
  const count = allTxs.length
  assert.equal(rev(actors, tx), undefined)
  assert.deepEqual(actors.map(a => a.balance), snapshot)
  assert.equal(allTxs.length, count)
  assert.equal(tx.revertedById, r.id)
})

check('6. 취소의 취소 → 다시 송금 상태, 기록 3건, 최신 revert 만 취소 가능', () => {
  const actors = board(actor('철수', 10000), actor('영희', 0))
  const tx = track(makeTransfer(actors, '철수', '영희', 3000, nextId(), now))
  const r1 = rev(actors, tx)
  assert.equal(bal(actors, '철수'), 10000)
  assert.equal(bal(actors, '영희'), 0)
  const r2 = rev(actors, r1)
  assert.equal(r2.revertOfId, r1.id)
  assert.equal(bal(actors, '철수'), 7000)
  assert.equal(bal(actors, '영희'), 3000)
  const chain = [tx, r1, r2]
  assert.deepEqual(revertable(chain), [r2.id])
  assert.equal(rev(actors, tx), undefined)
  assert.equal(rev(actors, r1), undefined)
  assert.equal(bal(actors, '철수'), 7000)
})

check('7. 3단 체인(송금→취소→취소→취소) → 원복, 각 단계 취소 가능은 최신 1건', () => {
  const actors = board(actor('철수', 10000), actor('영희', 0))
  const chain = [track(makeTransfer(actors, '철수', '영희', 3000, nextId(), now))]
  const expected = [[10000, 0], [7000, 3000], [10000, 0]]
  for (const [철수, 영희] of expected) {
    chain.push(rev(actors, chain.at(-1)))
    assert.equal(bal(actors, '철수'), 철수)
    assert.equal(bal(actors, '영희'), 영희)
    assert.deepEqual(revertable(chain), [chain.at(-1).id])
  }
  assert.equal(chain.length, 4)
})

check('8. ∞ 체인: 50000 → set ∞ → 취소(50000) → 취소(∞) → 취소(50000)', () => {
  const actors = board(actor('은행', 50000, true))
  const chain = [track(makeSet(actors, '은행', Infinity, nextId(), now))]
  assert.equal(bal(actors, '은행'), Infinity)
  for (const expected of [50000, Infinity, 50000]) {
    chain.push(rev(actors, chain.at(-1)))
    assert.equal(bal(actors, '은행'), expected)
    assert.deepEqual(chain.at(-1).deltas, {})
    assert.deepEqual(revertable(chain), [chain.at(-1).id])
  }
})

check('4. 어디에도 NaN 없음', () => {
  for (const a of allActors)
    assert.ok(!Number.isNaN(a.balance), `${a.id} balance NaN`)
  for (const tx of allTxs) {
    assert.ok(!Number.isNaN(tx.amount), `${tx.id} amount NaN`)
    assert.ok(tx.prevBalance === undefined || !Number.isNaN(tx.prevBalance), `${tx.id} prevBalance NaN`)
    for (const [id, d] of Object.entries(tx.deltas))
      assert.ok(Number.isFinite(d), `${tx.id} delta ${id} not finite`)
  }
})

process.stdout.write('all checks passed\n')
