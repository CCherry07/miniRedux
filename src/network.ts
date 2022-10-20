type AjaxFn = (uri: string) => Promise<any>
const ajax: AjaxFn = (uri: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: { name: '3秒后的frank' } })
    }, 3000)
  })
}

export {
  ajax
}
