import { State } from "./userStore";


export const reducer = (state: State, action: any) => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    default:
      break;
  }
  return state
}
