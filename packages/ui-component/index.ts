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
import FInputSlider from './src/FInput/FInputSlider/FInputSlider.vue'

export {
  FButton,
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
  FInputCheckbox,
  FInputSlider,
}

import type { NotifyBannerProps } from './src/FNotify/FBanner/FBanner.vue'
import type { NotifySnackbarProps } from './src/FNotify/FSnackbar/FSnackbar.vue'
import type { NotifyInfobarProps } from './src/FNotify/FInfobar/FInfobar.vue'

export * from './src/types'
export type { NotifyBannerProps, NotifySnackbarProps, NotifyInfobarProps }
