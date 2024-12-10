import { Notify } from 'quasar'
import type { QNotifyCreateOptions } from 'quasar'
import AptError from '../core/AptError'
import './quasar-init.js'

type NotifyPayload = unknown|string|QNotifyCreateOptions|Error|AptError
export const useNotify = () => {
  const payloadToNotifyObj = (payload: NotifyPayload): QNotifyCreateOptions => {
    if (!Notify.create) {
      throw new Error('Quasar Notify plugin needs to be enabled in the quasar.conf.js file in your local project')
    }
    const notifyObj = {} as QNotifyCreateOptions
    if (typeof payload === 'string') {
      notifyObj.message = payload
    } else if (typeof payload === 'object' && payload instanceof Error) {
      if (payload.message === 'Forbidden') {
        notifyObj.message = 'You don\'t have access to this resource'
      } else {
        notifyObj.message = payload.message
      }
    } else if (typeof payload === 'object' && payload && !Array.isArray(payload)) {
      return payload
    } else {
      notifyObj.message = 'Default message'
      console.warn('Unhandled notification payload type: ', typeof payload, payload)
    }
    return notifyObj
  }

  return {
    success (payload: NotifyPayload) {
      const notify = payloadToNotifyObj(payload)
      notify.type = 'positive'

      Notify.create(notify)
    },
    info (payload: NotifyPayload) {
      const notify = payloadToNotifyObj(payload)
      notify.type = 'info'
      Notify.create(notify)
    },
    error (payload: NotifyPayload) {
      const notify = payloadToNotifyObj(payload)
      notify.type = 'negative'
      Notify.create(notify)
    },
    critical (payload: NotifyPayload) {
      console.error(payload)
      const notify = payloadToNotifyObj(payload)
      notify.type = 'negative'
      Notify.create(notify)
    },
    log (payload: NotifyPayload) {
      if (process.env.NODE_ENV === 'development') {
        console.trace(payload)
      }
    }
  }
}
