import type { IBoardData } from '~/types'
import { UNIT_POSITION } from '~/enums'

export const getData = (): IBoardData => ({
  unit: '만원',
  unitPosition: UNIT_POSITION.BACK,
  preDefinedPlayers: ['도바킨', '엄마', '아빠', '삼촌'],
  typeList: [
    {
      id: 'unknown',
      name: '없음',
      children: [
        {
          id: 'unknown-child',
          name: '없음',
          inout: 'in',
          amount: 0,
          worth: 0,
        },
      ],
    },

    {
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
      name: '창업',
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
    {
      id: 'out',
      name: '지출',
      color: 'red-400',
      children: [
        {
          id: 'loan100',
          name: '이자 100',
          inout: 'out',
          amount: 100,
          worth: 0,
        },
        {
          id: 'loan200',
          name: '이자 200',
          inout: 'out',
          amount: 200,
          worth: 0,
        },
        {
          id: 'insur1',
          name: '자동차보험',
          inout: 'out',
          amount: 10,
          worth: 0,
        },
        {
          id: 'insur2',
          name: '생명보험',
          inout: 'out',
          amount: 10,
          worth: 0,
        },
      ],
    },
    {
      id: 'income',
      name: '수입',
      color: 'green-400',
      children: [
        {
          id: 'salary',
          name: '월급',
          inout: 'in',
          amount: 200,
          worth: 0,
        },
      ],
    },
  ],
})
