import type { App } from 'vue'

export default {
  install(app: App) {
    const components = import.meta.glob('./src/**/*.vue', { eager: true })
    for (const path in components) {
      const component = components[path].default
      app.component(component.name, component)
    }
  },
}

import FButton from './src/FButton/FButton.vue'
import FBadge from './src/FBadge/FBadge.vue'
import FButtonLabel from './src/FButtonLabel/FButtonLabel.vue'
import FSvgIcon from './src/FSvgIcon/FSvgIcon.vue'
import FLabel from './src/FLabel/FLabel.vue'
import FScrollbarContainer from './src/FScrollbarContainer/FScrollbarContainer.vue'
import FBanner from './src/FNotify/FBanner/FBanner.vue'
import FSnackbar from './src/FNotify/FSnackbar/FSnackbar.vue'
import FInfobar from './src/FNotify/FInfobar/FInfobar.vue'
import FPopper from './src/FPopper/FPopper.vue'
import FContextualMenu from './src/FContextualMenu/FContextualMenu.vue'
import FTabs from './src/FTabs/FTabs.vue'
import FInputCheckbox from './src/FInput/FInputCheckbox/FInputCheckbox.vue'
import FInputText from './src/FInput/FInputText/FInputText.vue'
import FInputSlider from './src/FInput/FInputSlider/FInputSlider.vue'
import FInputTap from './src/FInput/FInputTap/FInputTap.vue'
import FTooltipStandard from './src/FTooltip/FTooltipStandard/FTooltipStandard.vue'
import FTooltipMedia from './src/FTooltip/FTooltipMedia/FTooltipMedia.vue'
import FAvatar from './src/FAvatar/FAvatar.vue'
import FTag from './src/FTag/FTag.vue'

export {
  FButton,
  FBadge,
  FButtonLabel,
  FSvgIcon,
  FLabel,
  FScrollbarContainer,
  FBanner,
  FSnackbar,
  FInfobar,
  FPopper,
  FContextualMenu,
  FTabs,
  FInputText,
  FInputCheckbox,
  FInputSlider,
  FInputTap,
  FTooltipStandard,
  FTooltipMedia,
  FAvatar,
  FTag,
}

import type { NotifyBannerProps } from './src/FNotify/FBanner/FBanner.vue'
import type { NotifySnackbarProps } from './src/FNotify/FSnackbar/FSnackbar.vue'
import type { NotifyInfobarProps } from './src/FNotify/FInfobar/FInfobar.vue'

export * from './src/types'
export type { NotifyBannerProps, NotifySnackbarProps, NotifyInfobarProps }
