import type { IBoardData } from '~/types'
import { UNIT_POSITION } from '~/enums'

export const getData = (): IBoardData => ({
  unit: '만원',
  unitPosition: UNIT_POSITION.BACK,
  typeList: [{
    id: 'real',
    name: '부동산',
    color: 'yellow-400',
    children: [
      {
        id: 'vill',
        name: '빌라',
        inout: 'in',
        amount: 200,
        worth: 9500,
      },
      {
        id: 'aprt',
        name: '아파트',
        inout: 'in',
        amount: 1000,
        worth: 19500,
      },
      {
        id: 'site',
        name: '대지',
        inout: 'in',
        amount: 100,
        worth: 5000,
      },
    ],
  },
  {
    id: 'invt',
    name: '투자',
    color: 'red-400',
    children: [
      {
        id: 'invt1',
        name: '엔터테인먼트',
        inout: 'in',
        amount: 5000,
        worth: 40000,
      },
      {
        id: 'invt2',
        name: '무역회사',
        inout: 'in',
        amount: 5000,
        worth: 40000,
      },
      {
        id: 'invt3',
        name: 'IT회사',
        inout: 'in',
        amount: 6000,
        worth: 50000,
      },
      {
        id: 'invt4',
        name: '음반회사',
        inout: 'in',
        amount: 6000,
        worth: 50000,
      },
    ],
  },
  {
    id: 'foud',
    name: '투자',
    color: 'green-400',
    children: [
      {
        id: 'foud1',
        name: '장어구이전문점',
        inout: 'in',
        amount: 2000,
        worth: 20000,
      },
      {
        id: 'foud2',
        name: '치킨체인점',
        inout: 'in',
        amount: 1000,
        worth: 10000,
      },
    ],
  },
  ],
})
