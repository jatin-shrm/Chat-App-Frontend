import { of, from } from "rxjs";
import { catchError, switchMap, mergeMap } from "rxjs/operators";
import type { Epic } from "redux-observable";
import { websocketService } from "../../services/websocket";
import {
  connectRequest,
  connectSuccess,
  connectFailure,
  disconnect,
} from "./websocketSlice";

export const connectEpic: Epic = (action$) => {
  return action$.pipe(
    switchMap((action) => {
      if (connectRequest.match(action)) {
        // Convert promise to observable and handle connection
        return from(websocketService.connect()).pipe(
          mergeMap(() => {
            // Connection successful
            return of(connectSuccess());
          }),
          catchError((error: any) => {
            // Connection failed
            return of(
              connectFailure(error.message || "Failed to connect to WebSocket")
            );
          })
        );
      }
      return of();
    }),
    catchError((error) => {
      return of(
        connectFailure(error.message || "An unexpected error occurred")
      );
    })
  );
};

/**
 * Disconnect Epic
 *
 * Handles WebSocket disconnection
 */
export const disconnectEpic: Epic = (action$) => {
  return action$.pipe(
    switchMap((action) => {
      if (disconnect.match(action)) {
        // Disconnect websocket
        websocketService.disconnect();
        // Return empty observable (reducer handles state update)
        return of();
      }
      return of();
    })
  );
};

/**
 * Note: State syncing with websocket service will be handled in App.tsx
 * since epics are action-driven and we need continuous state updates.
 * The websocket service's subscribeToState will be used there to dispatch
 * updateConnectionState actions.
 */
