export default defineNuxtRouteMiddleware((to) => {
    if (process.server) return;
    const userStore = useUserStore();

    return nextTick(() => {
        const isAuthenticated = userStore.isAuthenticated;
        const allowedGuestRoutes = ['/auth/login', '/auth/register'];
        const isAuthRoute = to.path.startsWith('/auth');

        console.log('⛳ Route:', to.path, '| Authenticated:', isAuthenticated);

        if (isAuthRoute) {
            if (isAuthenticated) {
                return navigateTo('/');
            }
            if (!allowedGuestRoutes.includes(to.path)) {
                return navigateTo('/auth/login');
            }
            return;
        }

        if (!isAuthenticated) {
            return navigateTo('/auth/login');
        }
    });
});
