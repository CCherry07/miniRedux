import React, { forwardRef, memo, useContext, useEffect, useState } from "react"

const isObjectEqual = (obj1: any, obj2: any): boolean => {
  let o1 = obj1 instanceof Object;
  let o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    return obj1 === obj2
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (let attr in obj1) {
    let a1 = Object.prototype.toString.call(obj1[attr]) == '[object Object]'
    let a2 = Object.prototype.toString.call(obj2[attr]) == '[object Object]'
    let arr1 = Object.prototype.toString.call(obj1[attr]) == '[object Array]'
    if (a1 && a2) {
      return isObjectEqual(obj1[attr], obj2[attr])
    } else if (arr1) {
      if (obj1[attr].toString() != obj2[attr].toString()) {
        return false;
      }
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
const Context = React.createContext<unknown>(null)

interface Action<S> {
  type: String | Symbol
  payload: S
}
interface Store<S> {
  getState: () => S
  dispatch: (action: Action<unknown>) => void
  subscribe: (listener: (state: S) => void) => () => void
}
interface Provider<S> {
  children: React.ReactElement | React.ReactElement[]
  store: Store<S>
}
const createStore = <S, A extends Action<S>>(reducer: React.Reducer<S, A>, initState: S) => {
  let currentReducer = reducer
  let currentState = initState
  let currentListeners: ((state: S) => void)[] | null = []
  let nextListeners = currentListeners
  function getState() {
    return currentState
  }
  function dispatch(action: A) {
    currentState = currentReducer(currentState, action)
    observer(currentState)
  }
  function subscribe(listener: (state: S) => void) {
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
  function observer(state: S) {
    nextListeners.map(fn => fn(state))
  }
  const store = {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  }
  return store
}


const connect = (selector?: Function) => (Component: (props: any) => JSX.Element) => {
  const MemoComponent = memo(Component)
  const Wrapper = forwardRef((props, ref) => {
    const store = useContext(Context) as Store<unknown>
    const [, update] = useState({})
    const state = store.getState()
    const data = selector ? selector(state) : { state }
    useEffect(() => {
      const unsubscribe = store.subscribe((newState) => {
        const newData = selector ? selector(newState) : { state: newState }
        if (!isObjectEqual(data, newData)) {
          update({})
        }
      })
      return unsubscribe
    }, [])
    return (<MemoComponent {...props} {...store} {...data} ref={ref}></MemoComponent>)
  })
  return Wrapper
}

function Provider({ children, store }: Provider<unknown>) {
  return (<Context.Provider value={store}>
    {children}
  </Context.Provider>)
}

export {
  Provider,
  createStore,
  connect
}
