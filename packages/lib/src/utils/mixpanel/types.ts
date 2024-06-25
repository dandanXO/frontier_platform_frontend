export type Properties = Record<
  string,
  string | number | boolean | Record<string, any>
>

export interface trackParams {
  eventName: string
  properties?: Properties
}
