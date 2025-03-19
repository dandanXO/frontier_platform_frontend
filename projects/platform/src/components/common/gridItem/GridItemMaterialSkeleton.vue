<template>
  <div class="relative">
    <!-- Main wrapper -->
    <div class="relative">
      <!-- Square aspect ratio container -->
      <div class="w-full aspect-square relative">
        <!-- Top selection bar area -->
        <div class="absolute z-10 top-0 left-0 w-full h-11">
          <SkeletonBase class="w-full h-full rounded-t-md opacity-10" />
        </div>

        <!-- Main image content -->
        <SkeletonBase class="absolute top-0 left-0 w-full h-full rounded-md" />
      </div>

      <!-- Caption area -->
      <SkeletonBase class="h-3 w-1/2 mt-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBase from '@/components/common/SkeletonBase.vue'
</script>
