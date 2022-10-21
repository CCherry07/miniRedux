import React, { memo } from "react"
import { userConnector } from "./connector";
import { Provider, connect } from './redux';
import { store } from "./userStore";
import type { State } from "./userStore";

export const App = () => {
  return <Provider store={store}>
    <One></One>
    <Two></Two>
    <Three></Three>
  </Provider>
}
const One = memo(() => {
  console.log('One执行了')
  return <section>One </section>
})
const Two = userConnector(({ user }) => {
  return <section>Two
    <div>name:{user.name}</div>
  </section>
})
const Three = connect()(() => {
  console.log('Three执行了')
  return <section>Three
    <div>
      <UserModifier />
    </div>
  </section>
})


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


const UserModifier = userConnector(({ user, updateUser }: { user: any, updateUser: any }) => {
  const handleChange = (e: any) => {
    updateUser({ name: e.target.value })
  }
  return (
    <div>
      <div>User: {user.name} </div>
      <input type="text" onChange={handleChange} />
      {/* <button onClick={onClick} > 异步获取 user </button> */}
    </div>
  )
})

