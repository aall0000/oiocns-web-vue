export const debounce = (fun: any, delay?: number) => {
  let timer: any = ''
  return (args: any) => {
    let that: any = this
    let _args = args
    clearTimeout(timer)
    timer = setTimeout(function () {
      fun.call(that, _args)
    }, delay ?? 300)
  }
}
