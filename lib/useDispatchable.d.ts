import React from "react";
export interface Task<A> {
    (task: Promise<A>): void;
}
export interface ReducerType<S, A> {
    (state: S, action: A, dispatch: Task<A>): S;
}
export declare const useDispatchable: <S, A>(reducer: ReducerType<S, A>, initialState: S, errorHandler?: (reason: any) => Promise<void | A>) => [S, React.Dispatch<A>];
//# sourceMappingURL=useDispatchable.d.ts.map