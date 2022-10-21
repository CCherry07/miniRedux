const dispatchWithFunction = (store: any) => (dispatch: any) => (action: any) => {
  let _dispatch = dispatch
  dispatch = (action: (arg0: void) => void) => {
    if (action instanceof Function) {
      action(dispatch)
    } else {
      _dispatch(action)
    }
  }
  dispatch(action)
  return dispatch
}

export const middlewares = [dispatchWithFunction]
