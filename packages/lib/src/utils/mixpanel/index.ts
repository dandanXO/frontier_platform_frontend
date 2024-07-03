import type { trackParams, Properties } from './types'
import mixpanel from 'mixpanel-browser'

const COMPANY_EMAIL = '@frontier.cool'
const token = import.meta.env.VITE_APP_MIXPANEL_TOKEN

const getDistinctId = () => {
  try {
    return mixpanel?.get_distinct_id?.()
  } catch (error) {
    return false
  }
}

const isExternalUserEmail = () =>
  !String(getDistinctId()).endsWith(COMPANY_EMAIL)

const isTrackerEnabled = () => token && isExternalUserEmail()

const executeIfEnabled =
  (fn: Function) =>
  (...args: any[]) => {
    if (isTrackerEnabled()) {
      fn(...args)
    }
  }

export const initTracker = executeIfEnabled(() => {
  token && mixpanel.init(token)
})

export const track = executeIfEnabled(
  ({ eventName, properties }: trackParams) =>
    mixpanel.track(eventName, properties)
)

export const setTrackerId = executeIfEnabled((id: string) =>
  mixpanel.identify(id)
)

export const setProfileTrackerProperties = executeIfEnabled(
  (properties: Properties) => mixpanel.people.set(properties)
)

export const setDefaultTrackerProperties = executeIfEnabled(
  (properties: Properties) => mixpanel.register(properties)
)

export const resetTracker = executeIfEnabled(() => {
  if (getDistinctId()) {
    mixpanel.reset()
  }
})
