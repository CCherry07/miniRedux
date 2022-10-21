import React, { forwardRef, memo, useContext, useEffect, useState } from "react"
import { isObjectEqual } from "../utils"

const Context = React.createContext<unknown>(null)

interface Action<S> {
  type: String | Symbol
  payload: S
}
interface Store<S> {
  getState: () => S
  dispatch: (action: Action<S>) => void
  subscribe: (listener: (state: S) => void) => () => void
}
interface Provider<S> {
  children: React.ReactElement | React.ReactElement[]
  store: Store<S>
}
const createStore = <S, A extends Action<S>>(reducer: React.Reducer<S, A>, initState: S, middlewares?: Function[]) => {
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
  // TODO create store type
  function applyMiddleware(store: any, middlewares: Function[] = []) {
    middlewares = middlewares.slice()
    middlewares.reverse()
    let dispatch = store.dispatch
    middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
    return Object.assign({}, store, { dispatch })
  }
  return applyMiddleware(store, middlewares)
}


const connect = (mapStateToProps?: Function, mapDispatchToProps?: Function) => (Component: (props: any) => JSX.Element) => {
  const MemoComponent = memo(Component)
  const Wrapper = forwardRef((props, ref) => {
    const store = useContext(Context) as Store<unknown>
    const [, update] = useState({})
    const state = store.getState()
    const data = mapStateToProps ? mapStateToProps(state) : { state }
    const dispatchToProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : { dispatch: store.dispatch }
    useEffect(() => {
      const unsubscribe = store.subscribe((newState) => {
        const newData = mapStateToProps ? mapStateToProps(newState) : { state: newState }
        if (!isObjectEqual(data, newData)) {
          update({})
        }
      })
      return unsubscribe
    }, [mapStateToProps])
    const mapProps = { ...data, ...dispatchToProps }
    return (<MemoComponent {...props} {...store} {...mapProps} ref={ref}></MemoComponent>)
  })
  return Wrapper
}

function Provider<S>({ children, store }: Provider<S>) {
  return (<Context.Provider value={store}>
    {children}
  </Context.Provider>)
}

export {
  Provider,
  createStore,
  connect
}
