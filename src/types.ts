import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void
export interface avatar {
  id: string
  name: string
  color?: string
  budget: number
  unit: string
  trans?: number
}

export interface IFinancialTypeList {
  id: string
  name: string
  inout?: string
  amount?: number
  children?: IFinancialTypeList[]
}
export interface IFinancialStatementProps {
  title: string
  typeList: IFinancialTypeList[]
}
