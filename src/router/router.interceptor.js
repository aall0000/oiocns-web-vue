import router from './index';
import { clearPending } from '@/services/pending';

router.beforeEach((to, from, next) => {
  console.log('路由守卫');
  clearPending();
  next();
});
