import React from "react"

const Context = React.createContext<any>({})
interface Action<S> {
  type: String | Symbol
  payload: S
}
interface Store<S> {
  getState: () => S
  dispatch: (action: Action<unknown>) => void
  subscribe: (listener: () => void) => () => void
}
interface Provider<S> {
  children: React.ReactElement
  store: Store<S>
}
const createStore = <S, A extends Action<S>>(reducer: React.Reducer<S, A>, initState: S) => {
  let currentReducer = reducer
  let currentState = initState
  let currentListeners: (() => void)[] | null = []
  let nextListeners = currentListeners
  let isDispatching = false
  function getState() {
    return currentState
  }
  function dispatch(action: A) {
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
  }
  function subscribe(listener: () => void) {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners?.slice()
    }
    nextListeners.push(listener)
    return function unsubscribe() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners?.slice()
      }
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }
  function replaceReducer<S, A>(
    nextReducer: React.Reducer<S, A>) {
    reducer = nextReducer as any
  }
  const store = {
    getState,
    dispatch,
    subscribe,
    replaceReducer
  }
  return store
}
function Provider({ children, store }: Provider<unknown>) {
  return (<Context.Provider value={store}>
    {children}
  </Context.Provider>)
}

export {
  Provider,
  createStore
}
