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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDispatchable = void 0;
const react_1 = __importStar(require("react"));
const useDispatchable = (reducer, initialState, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
errorHandler = (e) => {
    throw (e);
}) => {
    const dispatchRef = react_1.useRef();
    const dispatchingReducer = (state, action) => {
        return reducer(state, action, (task) => task.catch(errorHandler).then(action => {
            if (action) {
                dispatchRef.current?.(action);
            }
        }));
    };
    const [state, dispatch] = react_1.default.useReducer(dispatchingReducer, initialState);
    if (!dispatchRef.current) {
        dispatchRef.current = dispatch;
    }
    return [state, dispatchRef.current];
};
exports.useDispatchable = useDispatchable;
//# sourceMappingURL=useDispatchable.js.map