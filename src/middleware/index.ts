const dispatchWithFunction = (store: any) => (dispatch: any) => (action: any) => {
  let _dispatch = dispatch
  function handDispatch(action: (arg0: void) => void) {
    if (action instanceof Function) {
      action(handDispatch(action))
    } else {
      _dispatch(action)
    }
  }
  handDispatch(action)
  return store
}

export const middlewares = [dispatchWithFunction]
