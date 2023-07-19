declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FButton: typeof import('./src/FButton/FButton.vue').default
    FSvgIcon: typeof import('./src/FSvgIcon/FSvgIcon.vue').default
    FLabel: typeof import('./src/FLabel/FLabel.vue').default
    fScrollbarContainer: typeof import('./src/FScrollbarContainer/FScrollbarContainer.vue').default
    FInfobar: typeof import('./src/FNotify/FInfobar/FInfobar.vue').default
    FPopper: typeof import('./src/FPopper/FPopper.vue').default
    FContextualMenu: typeof import('./src/FContextualMenu/FContextualMenu.vue').default
  }
}

export {}
