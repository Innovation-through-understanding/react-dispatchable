/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";

import { Task, useDispatchable } from "../useDispatchable";
import { fireEvent, render } from "@testing-library/react";
import unionize, { UnionOf, ofType } from "unionize";
import React from "react";

const Actions = unionize({
    Inc: {},
    Dec: {},
    Fetch: ofType<number>(),
    Futch: {},
    Got: ofType<number>(),
    Break: {},
}, {value: "data"});

type Action = UnionOf<typeof Actions>;

interface State {counter: number}


const reduce = (state: State, action: Action, dispatch: Task<Action>): State => {
    const result = Actions.match<State | void>(action, {
        Inc: () => ({counter: state.counter + 1}),
        Dec: () => ({counter: state.counter - 1}),
        Got: value => ({counter: value}),
        Fetch: value => { 
            dispatch(new Promise(resolve => {
                setTimeout(() => resolve(Actions.Got(value)), 200);
            })); 
        },
        Futch: () => {
            dispatch(new Promise<Action>((_, reject) => {
                setTimeout(() => reject("Failure"), 200);
            }).catch(() => {
                return Actions.Got(0); 
            }));
        },
        Break: () => {
            dispatch(new Promise<Action>((_, reject) => {
                setTimeout(() => reject("Failure"), 200);
            }));
        },
    }) ?? state;
    return result as State;
};

const Component = () => {
    const [state, dispatch] = useDispatchable(reduce, {counter: 0}, () => {
        return new Promise<void>(r => r()); 
    });
    const up = () => dispatch(Actions.Inc());
    const down = () => dispatch(Actions.Dec());
    const fetch = () => dispatch(Actions.Fetch(1000));
    const futch = () => dispatch(Actions.Futch());
    const flutch = () => dispatch(Actions.Break());
    return <>
        <div data-testid="state" key={state.counter}>{state.counter}</div>
        <button data-testid="up" onClick={up}>up</button>
        <button data-testid="down" onClick={down}>down</button>
        <button data-testid="fetch" onClick={fetch}>fetch</button>
        <button data-testid="futch" onClick={futch}>futch</button>
        <button data-testid="flutch" onClick={flutch}>flutch</button>
    </>;
};

describe("useDispatchable", () => {
    it("accepts a reducer and returns state and dispatch", async () => {
        const body = render(<Component />);
        expect(body.getByTestId("state" as any)).toHaveTextContent("0");
        fireEvent.click(body.getByTestId("up" as any));
        expect(body.getByTestId("state" as any)).toHaveTextContent("1");
        fireEvent.click(body.getByTestId("down" as any));
        fireEvent.click(body.getByTestId("down" as any));
        expect(body.getByTestId("state" as any)).toHaveTextContent("-1");
        fireEvent.click(body.getByTestId("fetch" as any)); 
        expect(body.getByTestId("state" as any)).toHaveTextContent("-1");
        await new Promise<void>(r => setTimeout(() => {
            expect(body.getByTestId("state" as any)).toHaveTextContent("1000");
            r();
        }, 450));
        fireEvent.click(body.getByTestId("futch" as any)); 
        await new Promise<void>(r => setTimeout(() => {
            expect(body.getByTestId("state" as any)).toHaveTextContent("0");
            r();
        }, 450));
        fireEvent.click(body.getByTestId("flutch" as any)); 
        await new Promise<void>(r => setTimeout(() => {
            console.warn((body.getByTestId("state" as any) as any));
            expect(body.getByTestId("state" as any)).toHaveTextContent("0");
            r();
        }, 450));
    });
});
