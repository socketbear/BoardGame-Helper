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
  assert.equal(revertTx(actors, set, now), true)
  assert.equal(bal(actors, '철수'), 7000)
  assert.equal(bal(actors, '영희'), 3000)
})

check('2. 무한 은행 transfer 와 취소 → 은행 ∞ 유지', () => {
  const actors = board(actor('은행', Infinity, true), actor('철수', 0))
  const tx = track(makeTransfer(actors, '은행', '철수', 1000, nextId(), now))
  assert.equal(bal(actors, '은행'), Infinity)
  assert.equal(bal(actors, '철수'), 1000)
  assert.equal(revertTx(actors, tx, now), true)
  assert.equal(bal(actors, '철수'), 0)
  assert.equal(bal(actors, '은행'), Infinity)
})

check('5. ∞ 가 낀 set 취소 → prevBalance 복원', () => {
  const a = board(actor('은행', 50000, true))
  const toInf = track(makeSet(a, '은행', Infinity, nextId(), now))
  assert.deepEqual(toInf.deltas, {})
  assert.equal(bal(a, '은행'), Infinity)
  assert.equal(revertTx(a, toInf, now), true)
  assert.equal(bal(a, '은행'), 50000)

  const b = board(actor('은행', Infinity, true))
  const toFinite = track(makeSet(b, '은행', 50000, nextId(), now))
  assert.deepEqual(toFinite.deltas, {})
  assert.equal(bal(b, '은행'), 50000)
  assert.equal(revertTx(b, toFinite, now), true)
  assert.equal(bal(b, '은행'), Infinity)
})

check('3. 같은 거래 두 번 revert → 두 번째 false, 잔액 불변', () => {
  const actors = board(actor('철수', 10000), actor('영희', 0))
  const tx = track(makeTransfer(actors, '철수', '영희', 2500, nextId(), now))
  assert.equal(revertTx(actors, tx, now), true)
  const snapshot = actors.map(a => a.balance)
  assert.equal(revertTx(actors, tx, now), false)
  assert.deepEqual(actors.map(a => a.balance), snapshot)
  assert.ok(tx.revertedAt instanceof Date)
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
