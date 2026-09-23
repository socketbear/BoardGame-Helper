/**
 * 범용 머니 보드 — 참가자 간 금액을 주고받고 되돌리는 도구.
 * 특정 보드게임에 묶이지 않는다(부자만들기 전용 개념인 재무제표·단위·사운드는 여기 없다).
 */

/** 보드 위의 네모 하나. 은행도 참가자의 한 종류다. */
export interface MoneyActor {
  id: string
  name: string
  /** UnoCSS 배경 클래스. 예: 'bg-blue-400' */
  color: string
  /** 무한 은행이면 Number.POSITIVE_INFINITY. 증감이 자연히 무시된다. */
  balance: number
  isBank: boolean
}

/**
 * transfer = A가 B에게 보냄 · set = 자기 자신 잔액을 새 값으로 덮어씀
 * revert = 다른 거래(revert 포함)를 취소한 거래. 취소도 기록에 쌓이고 다시 취소할 수 있다.
 */
export type MoneyTxType = 'transfer' | 'set' | 'revert'

/**
 * 거래 한 건. 기록은 **추가만** 된다 — 취소도 지우거나 고치지 않고 새 `revert` 거래로 쌓는다.
 *
 * 롤백은 `deltas` 의 **부호를 뒤집어 다시 적용**하는 방식이다.
 * "그 시점 잔액으로 되돌리기"가 아니라 "이 거래의 증감만 상쇄"하는 것이라
 * 뒤에 다른 거래가 몇 건 쌓였든 순서와 무관하게 아무 항목이나 취소할 수 있다.
 * balance 가 Infinity 인 무한 은행은 어떤 delta 를 더해도 Infinity 라 별도 처리가 필요 없다.
 */
export interface MoneyTx {
  id: string
  timestamp: Date
  type: MoneyTxType
  /** transfer 일 때 보낸 쪽. set 이면 없음. revert 는 취소 대상 거래의 값을 그대로 복사(표시용). */
  fromId?: string
  /** 받는 쪽(transfer) 또는 잔액을 바꾼 대상(set). revert 는 취소 대상 거래의 값을 그대로 복사. */
  toId: string
  /** 화면 표시용. transfer = 이동 금액, set = 변경 후 잔액. revert 는 취소 대상 거래의 값을 그대로 복사. */
  amount: number
  /**
   * actorId → 잔액 증감. 롤백은 이 값의 부호를 뒤집어 재적용한다.
   * **유한한 값만 담는다.** 무한대가 끼는 set 은 증감으로 표현이 안 되므로 비워 두고 `prevBalance` 를 쓴다.
   */
  deltas: Record<string, number>
  /**
   * 이 거래 직전 `toId` 의 잔액. `deltas` 가 비어 있으면(∞ ↔ 유한 전환이라 증감으로 표현 불가,
   * ∞ − ∞ = NaN 회피) 롤백은 "이 잔액으로 복원"이 된다. revert 거래도 같은 규칙을 따른다.
   */
  prevBalance?: number
  /** revert 거래일 때 취소 대상 거래의 id. */
  revertOfId?: string
  /**
   * 이 거래를 취소한 revert 거래의 id. 있으면 이미 취소됐으므로 이 거래는 다시 취소할 수 없다 —
   * 되살리려면 그 revert 거래를 취소한다. 한 흐름에서 취소 가능한 건 항상 가장 최근 것 하나다.
   */
  revertedById?: string
}

/** 화살표 한 줄이 가리키는 좌표(보드 컨테이너 기준). */
export interface ArrowPoint {
  x: number
  y: number
}
