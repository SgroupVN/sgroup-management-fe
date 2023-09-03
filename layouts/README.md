## Layouts

Documentation

-   use lowercase
-   ie: default.vue or contactpage.vue
-   then add to a page either in the script tag or around your content
-   You can cancel the default layout from being applied to a page by adding layout: false to the definePageMeta({})

Add via script tag

```bash
<script setup>
definePageMeta({
  layout: "gallery"
})
</script>
```

Add in template

```bash
<template>
<NuxtLayout name="gallery">

  <!-- add your content in here -->
  </NuxtLayout>
</template>
```
