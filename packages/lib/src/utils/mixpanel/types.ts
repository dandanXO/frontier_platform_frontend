export type Properties = Record<string, string | number | boolean>

export interface trackParams {
  eventName: string
  properties?: Properties
}
