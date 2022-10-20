import React from "react"
import { Provider, createStore, connect } from './redux';
const reducer = (state: State, action: any) => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    default:
      break;
  }
  return state
}
const store = createStore(reducer, { user: { name: "cherry" }, group: "前端" })
interface State {
  user: Record<string, any>,
  group: string,
}
export const App = () => {
  return <Provider store={store}>
    <One></One>
    <Two></Two>
    <Three></Three>
  </Provider>
}
const One = connect(({ dispatch }) => {
  console.log('One执行了')
  setTimeout(() => {
    dispatch({
      type: "update", payload: {
        user: { name: "kd" }
      }
    })
  }, 1000)
  return <section>One </section>
})
const Two = connect(({ getState }) => {
  console.log('Two执行了')
  const state = getState()
  console.log(state);
  return <section>Two
    <div>name:{state.user.name}</div>
  </section>
})
const Three = () => {
  console.log('Three执行了')
  return <section>Three
    <div></div>
  </section>
}


const User = (({ user }: State) => {
  console.log('User执行了 ' + Math.random())
  return <div>User: {user.name} </div>
})



// const fetchUserPromise = () => {
//   return ajax('/user').then(response => response.data)
// }
// const fetchUser = (dispatch) => {
//   return ajax('/user').then(response => dispatch({ type: 'updateUser', payload: response.data }))
// }
const UserModifier = ({ state }: { state: State }) => {
  console.log('UserModifier执行了')
  return (
    <div>
      <div>User: {state.user.name} </div>
      {/* <button onClick={onClick} > 异步获取 user </button> */}
    </div>
  )
}

