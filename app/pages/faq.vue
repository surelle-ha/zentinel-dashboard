<script setup lang="ts">
const features = ref([
  {
    title: 'Working Hard',
    description: 'Our team is actively building this page to bring you something awesome!',
    icon: 'i-lucide-hammer',
  },
  {
    title: 'Stay Tuned',
    description: 'We’ll be updating this section soon. Keep an eye out for new features.',
    icon: 'i-lucide-clock',
  },
  {
    title: 'Contact Us',
    description: 'Need help or have questions? Feel free to reach out anytime.',
    icon: 'i-lucide-message-circle',
    to: '/contact'
  }
])
</script>

<template>
  <div class="flex flex-col gap-6 sm:gap-8 lg:gap-14 w-full lg:max-w-5xl mx-auto">
    <UPageSection
      icon="i-lucide-construction"
      title="Page Under Construction"
      description="This page is currently being worked on. Check back soon for updates or explore other sections of the site."
      :features="features"
    />
  </div>
</template>
