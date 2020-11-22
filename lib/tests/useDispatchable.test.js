"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
require("@testing-library/jest-dom/extend-expect");
const useDispatchable_1 = require("../useDispatchable");
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const reduce = (state, action, dispatch) => {
    switch (action) {
        case "inc": return { counter: state.counter + 1 };
        case "dec": return { counter: state.counter - 1 };
        case "got": return { counter: 1000 };
        case "fetch": dispatch(new Promise(resolve => {
            setTimeout(() => resolve("got"), 500);
        }));
    }
    return state;
};
const Component = () => {
    const [state, dispatch] = useDispatchable_1.useDispatchable(reduce, { counter: 0 });
    const up = () => dispatch("inc");
    const down = () => dispatch("dec");
    const fetch = () => dispatch("fetch");
    return react_2.default.createElement(react_2.default.Fragment, null,
        react_2.default.createElement("div", { "data-testid": "state" }, state.counter),
        react_2.default.createElement("button", { "data-testid": "up", onClick: up }, "up"),
        react_2.default.createElement("button", { "data-testid": "down", onClick: down }, "down"),
        react_2.default.createElement("button", { "data-testid": "fetch", onClick: fetch }, "fetch"));
};
describe("useDispatchable", () => {
    it("accepts a reducer and returns state and dispatch", (done) => {
        const body = react_1.render(react_2.default.createElement(Component, null));
        expect(body.getByTestId("state")).toHaveTextContent("0");
        react_1.fireEvent.click(body.getByTestId("up"));
        expect(body.getByTestId("state")).toHaveTextContent("1");
        react_1.fireEvent.click(body.getByTestId("down"));
        react_1.fireEvent.click(body.getByTestId("down"));
        expect(body.getByTestId("state")).toHaveTextContent("-1");
        react_1.fireEvent.click(body.getByTestId("fetch"));
        setTimeout(() => {
            expect(body.getByTestId("state")).toHaveTextContent("1000");
            done();
        }, 1650);
    });
});
//# sourceMappingURL=useDispatchable.test.js.map