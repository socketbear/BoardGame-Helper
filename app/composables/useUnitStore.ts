import { acceptHMRUpdate, defineStore } from 'pinia'
import { UNIT_POSITION } from '~/types/RichEnums'

export const useUnitStore = defineStore('unit', () => {
  const currency: {
    unit: string
    unitPosition: UNIT_POSITION
  } = reactive({
    unit: '₩',
    unitPosition: UNIT_POSITION.FRONT,
  })

  function setUnit(unit: string, unitPosition: UNIT_POSITION = UNIT_POSITION.FRONT) {
    currency.unit = unit
    currency.unitPosition = unitPosition
  }

  return {
    currency,
    setUnit,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUnitStore, import.meta.hot))
