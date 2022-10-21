import { connect } from "../../redux";
import { State } from "./userStore";

function userDispatchs(dispatch: any) {
  return {
    updateUser: (payload: Extract<"user", State>) => {
      dispatch({
        type: 'update', payload: {
          user: payload
        }
      })
    }
  }
}
const userSelector = (state: { user: any; }) => ({ user: state.user })

export const userConnector = connect(userSelector, userDispatchs)
