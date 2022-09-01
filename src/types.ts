import { type ViteSSGContext } from 'vite-ssg'
import type { IN_OUT } from './enums'
import type { UNIT_POSITION } from '~/enums'

export type UserModule = (ctx: ViteSSGContext) => void
export interface avatar {
  id: string
  name: string
  color?: string
  budget: number
  unit: string
  trans?: number
}
export type Inout = IN_OUT.IN | IN_OUT.OUT
export interface IFinancial {
  id: string
  parentType: string
  childType: string
  inout: Inout
  amount: number
  worth: number
}
export interface IFinancialTypeList {
  id: string
  name: string
  inout?: string
  amount?: number
  worth?: number
  color?: string
  children?: IFinancialTypeList[]
}
export interface IFinancialStatementProps {
  title: string
  typeList: IFinancialTypeList[]
}

export interface IBoardData {
  unit: string
  unitPosition: UNIT_POSITION
  typeList: IFinancialTypeList[]
}
