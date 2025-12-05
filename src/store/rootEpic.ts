import { combineEpics } from "redux-observable";
import type { Epic } from "redux-observable";
import {
  loginEpic,
  registerEpic,
  logoutEpic,
} from "../features/auth/authEpics";
import {
  connectEpic,
  disconnectEpic,
} from "../features/websocket/websocketEpics";


const rootEpic: Epic = combineEpics(
  // Auth epics
  loginEpic,
  registerEpic,
  logoutEpic,

  // WebSocket epics
  connectEpic,
  disconnectEpic

  // Add more feature epics here as needed
);

export default rootEpic;
