import { createStore } from "./redux";
import { reducer } from "./userReducer";
export interface State {
  user: Record<string, any>,
  group: string,
}
export const store = createStore(reducer, { user: { name: "cherry" }, group: "前端" })
