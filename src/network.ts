type AjaxFn = (uri: string) => Promise<any>
const ajax: AjaxFn = (uri: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          user: { name: uri }
        }
      })
    }, 3000)
  })
}


export {
  ajax
}
