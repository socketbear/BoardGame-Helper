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
          id: 'vill1',
          name: '빌라',
          inout: 'in',
          amount: 450,
          worth: 9600,
        },
        {
          id: 'vill2',
          name: '빌라',
          inout: 'in',
          amount: 350,
          worth: 8400,
        },
        {
          id: 'aprt1',
          name: '아파트',
          inout: 'in',
          amount: 1700,
          worth: 29200,
        },
        {
          id: 'aprt2',
          name: '아파트',
          inout: 'in',
          amount: 1200,
          worth: 16100,
        },
        {
          id: 'site1',
          name: '대지',
          inout: 'in',
          amount: 250,
          worth: 5000,
        },
        {
          id: 'site2',
          name: '대지',
          inout: 'in',
          amount: 500,
          worth: 10000,
        },
        {
          id: 'opistel1',
          name: '오피스텔',
          inout: 'in',
          amount: 700,
          worth: 13000,
        },
        {
          id: 'opistel2',
          name: '오피스텔',
          inout: 'in',
          amount: 900,
          worth: 16000,
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
          name: '연예인 엔터테인먼트',
          inout: 'in',
          amount: 6000,
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
          name: 'IT벤쳐회사',
          inout: 'in',
          amount: 6000,
          worth: 40000,
        },
        {
          id: 'invt4',
          name: '음반회사',
          inout: 'in',
          amount: 5000,
          worth: 40000,
        },
        {
          id: 'invt5',
          name: '의류백화점',
          inout: 'in',
          amount: 7000,
          worth: 50000,
        },
        {
          id: 'invt6',
          name: '게임소프트 회사',
          inout: 'in',
          amount: 6000,
          worth: 40000,
        },
        {
          id: 'invt7',
          name: '영화제작사',
          inout: 'in',
          amount: 7000,
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
          amount: 4000,
          worth: 20000,
        },
        {
          id: 'foud2',
          name: '치킨체인점',
          inout: 'in',
          amount: 1000,
          worth: 5000,
        },
        {
          id: 'foud3',
          name: '슈퍼마켓',
          inout: 'in',
          amount: 1800,
          worth: 10000,
        },
        {
          id: 'foud4',
          name: '헬스클럽',
          inout: 'in',
          amount: 3000,
          worth: 15000,
        },
        {
          id: 'foud5',
          name: '호프집',
          inout: 'in',
          amount: 2500,
          worth: 10000,
        },
        {
          id: 'foud6',
          name: '화장품 전문점',
          inout: 'in',
          amount: 1800,
          worth: 10000,
        },
        {
          id: 'foud7',
          name: '어린이 영어학원',
          inout: 'in',
          amount: 2500,
          worth: 14000,
        },
        {
          id: 'foud8',
          name: '토스트 전문점',
          inout: 'in',
          amount: 1300,
          worth: 5000,
        },
        {
          id: 'foud9',
          name: '숯불갈비 전문점',
          inout: 'in',
          amount: 3000,
          worth: 15000,
        },
        {
          id: 'foud10',
          name: '참치회 전문점',
          inout: 'in',
          amount: 4000,
          worth: 20000,
        },
        {
          id: 'foud11',
          name: '피자 전문점',
          inout: 'in',
          amount: 2000,
          worth: 10000,
        },
        {
          id: 'foud12',
          name: 'PC방',
          inout: 'in',
          amount: 2000,
          worth: 18000,
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
