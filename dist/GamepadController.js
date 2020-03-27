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
        this._listenerMaxId[event] = Helper_1.Helper.nonNull(this._listenerMaxId[event], 0);
        this._listenerMaxId[event]++;
        let id = this._listenerMaxId[event];
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
    static _addGamepad(gamepad) {
        if (Helper_1.Helper.isNull(gamepad)) {
            return;
        }
        let index = gamepad.index;
        this._gamepads[index] = gamepad;
        this._buttonValues[index] = {};
        gamepad.buttons.forEach((button, buttonIndex) => {
            this._buttonValues[index][buttonIndex] = button.value;
        });
        this._axesValues[index] = {};
        gamepad.axes.forEach((axisValue, axisIndex) => {
            this._axesValues[index][axisIndex] = axisValue;
        });
    }
    //Init function
    static init() {
        window.addEventListener("gamepadconnected", e => {
            // @ts-ignore
            this._addGamepad(e.gamepad);
            // @ts-ignore
            this._trigger("connect", e.gamepad, e);
        });
        window.addEventListener("gamepaddisconnected", e => {
            // @ts-ignore
            delete this._gamepads[e.gamepad.index];
            // @ts-ignore
            // delete this._buttonValues[e.gamepad.index];
            // @ts-ignore
            // delete this._axesValues[e.gamepad.index];
            // @ts-ignore
            this._trigger("disconnect", e.gamepad, e);
        });
        let gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            this._addGamepad(gamepads[i]);
        }
        //starting of the loop
        this._loop();
    }
    static getGamepads() {
        let gamepadArray = [];
        let gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepadArray.push(gamepads[i]);
            }
        }
        return gamepadArray;
    }
    //Poll Functions
    static pollButtons() {
        this.getGamepads().forEach(gamepad => {
            gamepad.buttons.forEach((button, index) => {
                this._buttonValues[gamepad.index] = Helper_1.Helper.nonNull(this._buttonValues[gamepad.index], {});
                let previousButtonValue = this._buttonValues[gamepad.index][index];
                if (button.value !== previousButtonValue) {
                    this._trigger("buttonchange", gamepad, index, button.value, previousButtonValue, button);
                    this._buttonValues[gamepad.index][index] = button.value;
                }
            });
        });
    }
    static pollAxes() {
        this.getGamepads().forEach(gamepad => {
            gamepad.axes.forEach((axisValue, index) => {
                this._axesValues[gamepad.index] = Helper_1.Helper.nonNull(this._axesValues[gamepad.index], {});
                let previousAxisValue = this._axesValues[gamepad.index][index];
                if (axisValue !== previousAxisValue) {
                    this._trigger("axischange", gamepad, index, axisValue, previousAxisValue);
                    this._axesValues[gamepad.index][index] = axisValue;
                }
            });
        });
    }
    //loopFunction
    static _loop() {
        this.pollButtons();
        this.pollAxes();
        this._animationFrame = requestAnimationFrame(() => this._loop());
    }
    //Specific listener functions
    static addButtonAxisListener(event, listener, gamepadIndex, buttonIndex) {
        let realListener = function (gamepad, index, value, oldValue, button) {
            if (Helper_1.Helper.isNull(gamepadIndex) || gamepad.index === gamepadIndex) {
                if (Helper_1.Helper.isNull(buttonIndex) || index === buttonIndex) {
                    listener(...arguments);
                }
            }
        };
        return this.on(event, realListener);
    }
    static addButtonListener(listener, gamepadIndex, buttonIndex) {
        return this.addButtonAxisListener("buttonchange", listener, gamepadIndex, buttonIndex);
    }
    static addAxisListener(listener, gamepadIndex, axisIndex) {
        return this.addButtonAxisListener("axischange", listener, gamepadIndex, axisIndex);
    }
    static addButtonDownListener(listener, gamepadIndex, buttonIndex) {
        let realListener = function (gamepad, index, value, oldValue, button) {
            if (button.pressed && oldValue === 0) {
                listener(...arguments);
            }
        };
        return this.addButtonListener(realListener, gamepadIndex, buttonIndex);
    }
    static addButtonUpListener(listener, gamepadIndex, buttonIndex) {
        let realListener = function (gamepad, index, value, oldValue, button) {
            if (!button.pressed && oldValue > 0) {
                listener(...arguments);
            }
        };
        return this.addButtonListener(realListener, gamepadIndex, buttonIndex);
    }
}
exports.GamepadController = GamepadController;
GamepadController.EVENTS = ["connect", "disconnect", "buttonchange", "axischange"];
GamepadController._gamepads = {};
GamepadController._buttonValues = {};
GamepadController._axesValues = {};
GamepadController._listener = {};
GamepadController._listenerMaxId = {};
//# sourceMappingURL=GamepadController.js.map