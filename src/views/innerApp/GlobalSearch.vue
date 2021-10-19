<template lang="pug">
h1 I'm {{$route.name}} Page
tooltip(placement="right" class="m-20")
  svg-icon(iconName="info_outline")
  template(#content)
    div(class="p-5 w-75")
      img(src="https://picsum.photos/260/155" class="rounded")
      p(class="pt-5 text-body2 line-height-1.6 text-primary") {{$t('DD0010')}}
tooltip(placement="left" class="m-20")
  div(class="w-5 h-5 bg-red-300 rounded")
  template(#content)
    div(class="w-30 h-11 relative")
      div(class="bg-red-300 w-30 h-30 absolute -top-29 rounded-t")
      div(class="p-2 text-primary text-caption font-bold")
        div(class="pb-1") 18-4148 TCX
        div Dark gray
</template>

<script>
export default {
  name: 'GlobalSearch'
}
</script>
