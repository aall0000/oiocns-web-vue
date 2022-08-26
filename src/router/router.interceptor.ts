import router from './index'
import { clearPending } from '@/services/pending'
import { useUserStore } from '@/store/user'

router.beforeEach((to, from, next) => {
  const store = useUserStore()

  // console.log('路由守卫', 'token===>', !!store.userToken, 'to===>', to.path, 'from===>', from.path)

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
