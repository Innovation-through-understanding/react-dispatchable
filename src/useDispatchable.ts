import React, { Reducer, useRef } from "react";

export interface Task<A> { (task: Promise<A>): void }
export interface ReducerType<S,A> { (state: S, action: A, dispatch: Task<A>): S; }

export const useDispatchable = <S, A>(
    reducer: ReducerType<S,A>, initialState: S,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorHandler: (reason: any) => Promise<A | void> = (e) => {
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