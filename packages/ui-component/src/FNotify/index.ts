export * from './FInfobar/FInfobar.vue'
export * from './FBanner/FBanner.vue'
export * from './FSnackbar/FSnackbar.vue'

export interface Action {
  text: string
  handler(): void
  classes?: string
}
