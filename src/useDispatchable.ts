import React, { Reducer, useRef } from "react";

/**
 * A task is a function that takes a promise that will eventually result in dispatchting another action
 * @param task Promise that returns an action
 */
export interface Task<A> { (task: Promise<A>): void }

/**
 * Type for reducer functions to be used with @see useDispatchable
 * @param state Current state
 * @param action Action to perform
 * @param dispatch dispatch function to deploy asynchronous actions
 * @returns new state  
 */
export interface ReducerType<S,A> { (state: Readonly<S>, action: A, dispatch: Task<A>): Readonly<S>; }

/**
 * Error handler to deal with @see Task promises that get rejected.
 * @param reason rejection reason
 * @returns either a valid and resolvable promise for an action (that will be performed) or an (empty) Promise<void>
 * A custom error handler may either return 
 */
export interface ErrorHandler<A> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reason: any): Promise<A | void>
}

/**
 * useDispatchable Hook. Local synchronous and asychronous state management.
 * @param reducer Reducer function. @see ReducerType
 * @param initialState Initial state to be managed.
 * @param errorHandler Optional error handler for asynchronous actions that result in rejected promises. 
 *                     Defaults to a handler that will throw the rejection error.
 */
export const useDispatchable = <S, A>(
    reducer: ReducerType<S,A>, initialState: S,
    errorHandler: ErrorHandler<A> = (e) => {
        throw(e); 
    }
): [S, React.Dispatch<A>] => {
    const dispatchRef = useRef<React.Dispatch<A>>();
    const dispatchingReducer: Reducer<S, A> = (state, action)  => {
        return reducer(state, action, (task) => task.catch(errorHandler).then(action => {
            if (action) { 
                dispatchRef.current?.(action);
            }
        }));
    };
    const [state, dispatch] = React.useReducer<Reducer<S,A>>(dispatchingReducer, initialState);
    if (!dispatchRef.current) {
        dispatchRef.current = dispatch;
    }
    return [state, dispatchRef.current];
};