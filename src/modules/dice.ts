import { type UserModule } from '~/types'

export const install: UserModule = ({ app, isClient }) => {
  if (isClient) {
    // import('@3d-dice/dice-box').then((DiceBox) => {
    //   app.provide('DiceBox', DiceBox.default)
    // })
  }
}
