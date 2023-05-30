declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FButton: typeof import('./src/FButton/FButton.vue').default
    FSvgIcon: typeof import('./src/FSvgIcon/FSvgIcon.vue').default
    FLabel: typeof import('./src/FLabel/FLabel.vue').default
    fScrollbarContainer: typeof import('./src/FScrollbarContainer/FScrollbarContainer.vue').default
  }
}

export {}
