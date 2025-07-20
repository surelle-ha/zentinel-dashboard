// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/cloudinary',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate'
  ],

  devtools: {
    enabled: true
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: 'my-custom-preset',
    apiKey: process.env.CLOUDINARY_KEY,
    analytics: true,
    cloud: {},
    url: {},
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  future: {
    compatibilityVersion: 4
  },

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      include: undefined,
      exclude: [],
      saveRedirectToCookie: false,
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
