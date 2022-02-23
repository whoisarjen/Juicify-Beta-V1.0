import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies';

Vue.use(VueRouter)
Vue.use(VueCookies)

const routes = [
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/Admin.vue')
    },
    {
        path: '/tutorial',
        name: 'tutorial',
        component: () => import('@/components/coach/tutorial.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('@/views/Contact.vue')
    },
    {
        path: '/regulations',
        name: 'regulations',
        component: () => import('@/views/Regulations.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        beforeEnter: logouted
    },
    {
        path: '/register/:login/:code',
        name: 'active-account',
        component: () => import('@/views/Register.vue'),
        beforeEnter: logouted
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/views/Reset-password.vue'),
        beforeEnter: logouted
    },
    {
        path: '/reset-password/:login/:code',
        name: 'verification-reset-password-code',
        component: () => import('@/views/Reset-password.vue'),
        beforeEnter: logouted
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        beforeEnter: logouted
    },
    {
        path: '/login/:login/:code',
        name: 'confirm-email',
        component: () => import('@/views/Login.vue'),
        beforeEnter: logouted
    },
    {
        path: '/workout',
        name: 'workout',
        component: () => import('@/views/workout/workout.vue'),
        beforeEnter: logged
    },
    {
        path: '/:login/workout-result',
        name: 'workout-result',
        component: () => import('@/views/workout/result/workout-result.vue')
    },
    {
        path: '/:login/workout-result/:date/:id',
        name: 'workout-result-edit',
        component: () => import('@/views/workout/result/workout-result-edit.vue')
    },
    {
        path: '/:login/workout-plan',
        name: 'workout-plan',
        component: () => import('@/views/workout/plan/workout-plan.vue')
    },
    {
        path: '/:login/workout-plan/:id',
        name: 'workout-plan-edit',
        component: () => import('@/views/workout/plan/workout-plan-edit.vue')
    },
    {
        path: '/:login/workout-statistic',
        name: 'workout-statistic',
        component: () => import('@/views/workout/statistic/workout-statistic.vue'),
        beforeEnter: logged
    },
    {
        path: '/:login/workout-statistic/:id',
        name: 'workout-statistic-exercise',
        component: () => import('@/views/workout/statistic/workout-statistic-exercise.vue'),
        beforeEnter: logged
    },
    {
        path: '/:login/nutrition_diary/:date',
        name: 'nutrition_diary',
        component: () => import('@/views/Nutrition_diary.vue')
    },
    {
        path: '/coach',
        name: 'coach',
        component: () => import('@/views/Coach.vue'),
        beforeEnter: logged
    },
    {
        path: '/add-weight',
        name: 'add-weight',
        component: () => import('@/views/Add-weight.vue'),
        beforeEnter: logged
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/Settings.vue'),
        beforeEnter: logged
    },
    {
        path: '/messages',
        name: 'messages',
        component: () => import('@/views/Messages.vue'),
        beforeEnter: logged
    },
    {
        path: '/barcode-scanner',
        name: 'barcode-scanner',
        component: () => import('@/views/Barcode-scanner.vue'),
        beforeEnter: logged
    },
    {
        path: '/calories-manager',
        name: 'calories-manager',
        component: () => import('@/views/Calories-manager.vue'),
        beforeEnter: logged
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/Error403.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/Error404.vue')
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/Search.vue'),
        beforeEnter: logged
    },
    // Login musi być ostatni, bo wyłapuje nieznalezione routery
    {
        path: '/:login',
        name: 'profile',
        component: () => import('@/views/Profile.vue')
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        beforeEnter: logged
    },
    {
        path: '*',
        name: 'redirect',
        redirect: {name: 'home'}
    }
]

function logged (to, from, next) {
    if(Vue.$cookies.get("token")){
        next()
    }else{
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
}

function logouted(to, from, next){
    if(Vue.$cookies.get("token")){
        next({
            path: '/',
            query: { redirect: to.fullPath }
        })
    }else{
        next()
    }
}

const router = new VueRouter({
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    routes
})

export default router