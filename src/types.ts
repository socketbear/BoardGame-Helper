import { type ViteSSGContext } from 'vite-ssg'
import type { FINANCIAL_TYPE, IN_OUT } from './enums'
import type { UNIT_POSITION } from '~/enums'

export type UserModule = (ctx: ViteSSGContext) => void
export interface avatar {
  id: string
  name: string
  color?: string
  budget: number
  unit: string
  trans?: number
  useReport: boolean
}
export type Inout = IN_OUT.IN | IN_OUT.OUT
export interface IFinancial {
  id: string
  parentType: FINANCIAL_TYPE | string
  childType: FINANCIAL_TYPE | string
  inout: Inout
  amount: number
  worth: number
}
export interface IFinancialTypeList {
  id: string
  name: string
  color?: string
  children: IFinancialType[]
}
export interface IFinancialType {
  id: string
  name: string
  inout: Inout
  amount: number
  worth: number
  color?: string
}
export interface IFinancialStatementProps {
  financialId: string
  title: string
  typeList: IFinancialTypeList[]
}

export interface IPopupState {
  show: boolean
  state: string
  from?: avatar
  to?: avatar
  title: string
}

export interface IBoardData {
  unit: string
  unitPosition: UNIT_POSITION
  typeList: IFinancialTypeList[]
  preDefinedPlayers: string[]
}
