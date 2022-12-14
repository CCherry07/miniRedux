import React, { memo } from "react"
import { userConnector } from "./store/user/connector";
import { Provider, connect } from './redux';
import { store } from "./store/user/userStore";
import { ajax } from "./network";

export const App = () => {
  return <Provider store={store}>
    <One></One>
    <Two></Two>
    <Three></Three>
  </Provider>
}
const One = memo(() => {
  console.log('One执行了')
  return <section>One
    <User></User>
  </section>
})
const Two = userConnector(({ user }) => {
  console.log('Two执行了');
  return <section>Two
    <div>name:{user.name}</div>
  </section>
})
const Three = () => {
  console.log('Three执行了')
  return <section>Three
    <div>
      <UserModifier />
    </div>
  </section>
}


const User = userConnector(({ user }) => {
  console.log('User执行了')
  return <div>User: {user.name} </div>
})



const fetchUserPromise = () => {
  return ajax('/user').then(response => response.data)
}
// const fetchUser = (dispatch) => {
//   return ajax('/user').then(response => dispatch({ type: 'update', payload: response.data }))
// }
const UserModifier = connect(undefined, undefined)(({ user, dispatch }: { user: any, dispatch: any }) => {
  const handleChange = (e: any) => {
    // updateUser(() => ({ name: e.target.value }))
    dispatch({
      type: "update",
      payload: fetchUserPromise()
    })
  }
  return (
    <div>
      <input type="text" onChange={handleChange} />
      {/* <button onClick={onClick} > 异步获取 user </button> */}
    </div>
  )
})

