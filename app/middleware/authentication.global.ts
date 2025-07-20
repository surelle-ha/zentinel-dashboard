export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;
  const userStore = useUserStore();

  return nextTick(() => {
    const isAuthenticated = userStore.isAuthenticated;
    const guestRoutes = ['/auth/login', '/auth/register'];
    const publicRoutes = ['/', '/faq'];

    if (!isAuthenticated && ![...guestRoutes, ...publicRoutes].includes(to.path)) {
      return navigateTo('/auth/login');
    }

    if (isAuthenticated && guestRoutes.includes(to.path)) {
      return navigateTo('/home');
    }
  });
});