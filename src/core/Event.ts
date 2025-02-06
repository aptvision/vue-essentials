import { JsonObject, TScalar } from '../interface'
import { uid } from 'quasar'

export interface IEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (name: string, callback: (params?: any) => void) => string;
  off: (nameOrId: string, payload?: JsonObject | TScalar) => void;
  trigger: (nameOrId: string, payload?: JsonObject | TScalar) => void
}
interface EventEntryInterface {
  id: string;
  name: string;
  callback: (payload: unknown) => void;
  once: boolean;
}
let events = [] as EventEntryInterface[]
export const useEvent = () => {
  const on = (name: string, callback: (payload: unknown) => void, once = false) => {
    const id = uid()
    events.push({
      id,
      name,
      callback,
      once
    } as EventEntryInterface)
    return id
  }
  const off = (nameOrId: string) => {
    events = events.filter(event => ![event.id, event.name].includes(nameOrId))
  }
  const trigger = (nameOrId: string, payload?: unknown) => {
    events.forEach(event => {
      if (![event.id, event.name].includes(nameOrId)) {
        return
      }
      if (event.callback && typeof event.callback === 'function') {
        event.callback(payload)
      }
      if (event.once) {
        off(nameOrId)
      }
    })
  }
  return { on, off, trigger }
}