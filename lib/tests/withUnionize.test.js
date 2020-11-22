"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
require("@testing-library/jest-dom/extend-expect");
const useDispatchable_1 = require("../useDispatchable");
const react_1 = require("@testing-library/react");
const unionize_1 = __importStar(require("unionize"));
const react_2 = __importDefault(require("react"));
const Actions = unionize_1.default({
    Inc: {},
    Dec: {},
    Fetch: unionize_1.ofType(),
    Futch: {},
    Got: unionize_1.ofType(),
    Break: {},
}, { value: "data" });
const reduce = (state, action, dispatch) => {
    const result = Actions.match(action, {
        Inc: () => ({ counter: state.counter + 1 }),
        Dec: () => ({ counter: state.counter - 1 }),
        Got: value => ({ counter: value }),
        Fetch: value => {
            dispatch(new Promise(resolve => {
                setTimeout(() => resolve(Actions.Got(value)), 200);
            }));
        },
        Futch: () => {
            dispatch(new Promise((_, reject) => {
                setTimeout(() => reject("Failure"), 200);
            }).catch(() => {
                return Actions.Got(0);
            }));
        },
        Break: () => {
            dispatch(new Promise((_, reject) => {
                setTimeout(() => reject("Failure"), 200);
            }));
        },
    }) ?? state;
    return result;
};
const Component = () => {
    const [state, dispatch] = useDispatchable_1.useDispatchable(reduce, { counter: 0 }, () => {
        return new Promise(r => r());
    });
    const up = () => dispatch(Actions.Inc());
    const down = () => dispatch(Actions.Dec());
    const fetch = () => dispatch(Actions.Fetch(1000));
    const futch = () => dispatch(Actions.Futch());
    const flutch = () => dispatch(Actions.Break());
    return react_2.default.createElement(react_2.default.Fragment, null,
        react_2.default.createElement("div", { "data-testid": "state", key: state.counter }, state.counter),
        react_2.default.createElement("button", { "data-testid": "up", onClick: up }, "up"),
        react_2.default.createElement("button", { "data-testid": "down", onClick: down }, "down"),
        react_2.default.createElement("button", { "data-testid": "fetch", onClick: fetch }, "fetch"),
        react_2.default.createElement("button", { "data-testid": "futch", onClick: futch }, "futch"),
        react_2.default.createElement("button", { "data-testid": "flutch", onClick: flutch }, "flutch"));
};
describe("useDispatchable", () => {
    it("accepts a reducer and returns state and dispatch", async () => {
        const body = react_1.render(react_2.default.createElement(Component, null));
        expect(body.getByTestId("state")).toHaveTextContent("0");
        react_1.fireEvent.click(body.getByTestId("up"));
        expect(body.getByTestId("state")).toHaveTextContent("1");
        react_1.fireEvent.click(body.getByTestId("down"));
        react_1.fireEvent.click(body.getByTestId("down"));
        expect(body.getByTestId("state")).toHaveTextContent("-1");
        react_1.fireEvent.click(body.getByTestId("fetch"));
        expect(body.getByTestId("state")).toHaveTextContent("-1");
        await new Promise(r => setTimeout(() => {
            expect(body.getByTestId("state")).toHaveTextContent("1000");
            r();
        }, 450));
        react_1.fireEvent.click(body.getByTestId("futch"));
        await new Promise(r => setTimeout(() => {
            expect(body.getByTestId("state")).toHaveTextContent("0");
            r();
        }, 450));
        react_1.fireEvent.click(body.getByTestId("flutch"));
        await new Promise(r => setTimeout(() => {
            console.warn(body.getByTestId("state"));
            expect(body.getByTestId("state")).toHaveTextContent("0");
            r();
        }, 450));
    });
});
//# sourceMappingURL=withUnionize.test.js.map