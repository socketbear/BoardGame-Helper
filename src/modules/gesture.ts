import { GesturePlugin } from '@vueuse/gesture'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ app }) => {
  app.use(GesturePlugin)
}
