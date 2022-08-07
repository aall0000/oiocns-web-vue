import { onBeforeUnmount, onMounted, ref } from 'vue'

export default function () {
  const x = ref('')
  const y = ref('')

  // 鼠标点击操作函数回调
  const clickHandler = (event: any) => {
    console.log('市场菜市场',event.pageX,event.pageY);

    x.value = event.pageX
    y.value = event.pageY
  }

  // 页面加载完毕，再进行点击操作
  onMounted(() => {
    window.addEventListener('click', clickHandler)
  })

  // 页面卸载前给他删了
  onBeforeUnmount(() => {
    window.removeEventListener('click', clickHandler)
  })

  return {
    x,
    y
  }
}
