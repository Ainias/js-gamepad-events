"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helper_1 = require("js-helper/dist/shared/Helper");
class GamepadController {
    //Listener functions
    static on(event, listener) {
        if (this.EVENTS.indexOf(event) === -1) {
            return false;
        }
        this._listener[event] = Helper_1.Helper.nonNull(this._listener[event], {});
        let id = Object.keys(this._listener[event]).length;
        this._listener[event][id] = listener;
        return id;
    }
    static off(event, listenerId) {
        if (this.EVENTS.indexOf(event) === -1 && Helper_1.Helper.isNotNull(this._listener[event][listenerId])) {
            return false;
        }
        delete this._listener[event][listenerId];
        return true;
    }
    static _trigger(event, ...args) {
        if (Helper_1.Helper.isNotNull(this._listener[event])) {
            let listeners = this._listener[event];
            Object.keys(listeners).forEach(id => {
                listeners[id](...args);
            });
        }
    }
    //Init function
    static init() {
        window.addEventListener("gamepadconnected", e => {
            // @ts-ignore
            let index = e.gamepad.index;
            // @ts-ignore
            this._gamepads[index] = e.gamepad;
            this._buttonValues[index] = {};
            // @ts-ignore
            e.gamepad.buttons.forEach((button, buttonIndex) => {
                this._buttonValues[index][buttonIndex] = button.value;
            });
            this._axesValues[index] = {};
            // @ts-ignore
            e.gamepad.axes.forEach((axisValue, axisIndex) => {
                this._axesValues[index][axisIndex] = axisValue;
            });
            // @ts-ignore
            this._trigger("connect", e.gamepad, e);
        });
        window.addEventListener("gamepaddisconnected", e => {
            // @ts-ignore
            delete this._gamepads[e.gamepad.index];
            // @ts-ignore
            delete this._buttonValues[e.gamepad.index];
            // @ts-ignore
            delete this._axesValues[e.gamepad.index];
            // @ts-ignore
            this._trigger("disconnect", e.gamepad, e);
        });
        //starting of the loop
        this._loop();
    }
    static getGamepads() {
        // @ts-ignore
        return Object.values(this._gamepads);
    }
    //Poll Functions
    static pollButtons() {
        this._gamepads.forEach(gamepad => {
            gamepad.buttons.forEach((button, index) => {
                let previousButtonValue = this._buttonValues[gamepad.index][index];
                if (button.value !== previousButtonValue) {
                    this._trigger("buttonchange", gamepad, index, button.value, previousButtonValue, button);
                    this._buttonValues[gamepad.index][index] = button.value;
                }
            });
        });
    }
    static pollAxes() {
        this._gamepads.forEach(gamepad => {
            gamepad.axes.forEach((axisValue, index) => {
                let previousAxisValue = this._axesValues[gamepad.index][index];
                if (axisValue !== previousAxisValue) {
                    this._trigger("axischange", gamepad, index, axisValue, previousAxisValue);
                    this._buttonValues[gamepad.index][index] = axisValue;
                }
            });
        });
    }
    //loopFunction
    static _loop() {
        this.pollButtons();
        this.pollAxes();
        this._animationFrame = requestAnimationFrame(this._loop);
    }
    //Specific listener functions
    static addButtonAxisListener(event, listener, gamepadIndex, buttonIndex) {
        let realListener = (gamepad, index, value, oldValue, button) => {
            if (Helper_1.Helper.isNull(gamepadIndex) || gamepad.index === gamepadIndex) {
                if (Helper_1.Helper.isNull(buttonIndex) || index === buttonIndex) {
                    listener(value, oldValue, button);
                }
            }
        };
        this.on(event, realListener);
    }
    static addButtonListener(listener, gamepadIndex, buttonIndex) {
        this.addButtonAxisListener("buttonchange", listener, gamepadIndex, buttonIndex);
    }
    static addAxisListener(listener, gamepadIndex, axisIndex) {
        this.addButtonAxisListener("axischange", listener, gamepadIndex, axisIndex);
    }
    static addButtonDownListener(listener, gamepadIndex, buttonIndex) {
        let realListener = (gamepad, index, value, oldValue, button) => {
            if (button.pressed && oldValue === 0) {
                listener(...arguments);
            }
        };
        this.addButtonAxisListener("buttonchange", realListener, gamepadIndex, buttonIndex);
    }
    static addButtonUpListener(listener, gamepadIndex, buttonIndex) {
        let realListener = (gamepad, index, value, oldValue, button) => {
            if (!button.pressed && oldValue > 0) {
                listener(...arguments);
            }
        };
        this.addButtonAxisListener("buttonchange", realListener, gamepadIndex, buttonIndex);
    }
}
exports.GamepadController = GamepadController;
GamepadController.EVENTS = ["connect", "disconnect", "buttonchange", "axischange"];
GamepadController._gamepads = {};
GamepadController._buttonValues = {};
GamepadController._axesValues = {};
GamepadController._listener = {};
//# sourceMappingURL=GamepadController.js.map