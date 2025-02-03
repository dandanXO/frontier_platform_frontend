declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FButton: typeof import('./src/FButton/FButton.vue').default
    FBadge: typeof import('./src/FBadge/FBadge.vue').default
    FButtonLabel: typeof import('./src/FButtonLabel/FButtonLabel.vue').default
    FSvgIcon: typeof import('./src/FSvgIcon/FSvgIcon.vue').default
    FLabel: typeof import('./src/FLabel/FLabel.vue').default
    FScrollbarContainer: typeof import('./src/FScrollbarContainer/FScrollbarContainer.vue').default
    FBanner: typeof import('./src/FNotify/FBanner/FBanner.vue').default
    FSnackbar: typeof import('./src/FNotify/FSnackbar/FSnackbar.vue').default
    FInfobar: typeof import('./src/FNotify/FInfobar/FInfobar.vue').default
    FAlert: typeof import('./src/FNotify/FAlert/FAlert.vue').default
    FPopper: typeof import('./src/FPopper/FPopper.vue').default
    FContextualMenu: typeof import('./src/FContextualMenu/FContextualMenu.vue').default
    FTabs: typeof import('./src/FTabs/FTabs.vue').default
    FInputText: typeof import('./src/FInput/FInputText/FInputText.vue').default
    FInputCheckbox: typeof import('./src/FInput/FInputCheckbox/FInputCheckbox.vue').default
    FInputSlider: typeof import('./src/FInput/FInputSlider/FInputSlider.vue').default
    FInputToggle: typeof import('./src/FInput/FInputToggle/FInputToggle.vue').default
    FInputTap: typeof import('./src/FInput/FInputTap/FInputTap.vue').default
    FPill: typeof import('./src/FPill/FPill.vue').default
    FTooltipStandard: typeof import('./src/FTooltip/FTooltipStandard/FTooltipStandard.vue').default
    FTooltipMedia: typeof import('./src/FTooltip/FTooltipMedia/FTooltipMedia.vue').default
    FTooltip: typeof import('./src/FTooltip/FTooltip/FTooltip.vue').default
    FAvatar: typeof import('./src/FAvatar/FAvatar.vue').default
    FTag: typeof import('./src/FTag/FTag.vue').default
  }
}

export {}
