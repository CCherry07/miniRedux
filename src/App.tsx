import React from "react"
import { ajax } from "./network"

const Context = React.createContext<any>({})
interface State {
  user: Record<string, any>,
  group: Record<string, any>,
}
export const App = () => {
  return <div>
    <One></One>
    <Two></Two>
    <Three></Three>
  </div>
}
const One = () => {
  console.log('大儿子执行了')
  return <section>大儿子 </section>
}
const Two = () => {
  console.log('二儿子执行了')
  return <section>二儿子</section>
}
const Three = () => {
  console.log('幺儿子执行了')
  return <section>幺儿子
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

