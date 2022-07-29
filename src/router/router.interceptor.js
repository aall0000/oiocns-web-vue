import router from './index'
import { clearPending } from '@/services/pending'
import { useUserStore } from '@/store/user'

router.beforeEach((to, from, next) => {
  console.log('路由守卫')
  const store = useUserStore()
  if (store.userToken) {
    clearPending()
    next()
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})
