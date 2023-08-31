declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ModelEditor: typeof import('./src/components/ModelEditor.vue').default
  }
}

export {}
