/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";

import { Task, useDispatchable } from "../useDispatchable";
import { fireEvent, render } from "@testing-library/react";
import React from "react";

type Actions = "inc" | "dec" | "fetch" | "got";
interface State {counter: number}


const reduce = (state: State, action: Actions, dispatch: Task<Actions>): State => {
    switch(action) {
        case "inc": return {counter: state.counter + 1};
        case "dec": return {counter: state.counter - 1};
        case "got": return {counter: 1000};
        case "fetch": dispatch(new Promise(resolve => {
            setTimeout(() => resolve("got"), 500);
        }));
    }
    return state;
};

const Component = () => {
    const [state, dispatch] = useDispatchable(reduce, {counter: 0});
    const up = () => dispatch("inc");
    const down = () => dispatch("dec");
    const fetch = () => dispatch("fetch");
    return <>
        <div data-testid="state">{state.counter}</div>
        <button data-testid="up" onClick={up}>up</button>
        <button data-testid="down" onClick={down}>down</button>
        <button data-testid="fetch" onClick={fetch}>fetch</button>
    </>;
};

describe("useDispatchable", () => {
    it("accepts a reducer and returns state and dispatch", (done) => {
        const body = render(<Component />);
        expect(body.getByTestId("state" as any)).toHaveTextContent("0");
        fireEvent.click(body.getByTestId("up" as any));
        expect(body.getByTestId("state" as any)).toHaveTextContent("1");
        fireEvent.click(body.getByTestId("down" as any));
        fireEvent.click(body.getByTestId("down" as any));
        expect(body.getByTestId("state" as any)).toHaveTextContent("-1");
        fireEvent.click(body.getByTestId("fetch" as any)); 
        setTimeout(() => {
            expect(body.getByTestId("state" as any)).toHaveTextContent("1000");
            done();
        }, 1650);
    });
});
