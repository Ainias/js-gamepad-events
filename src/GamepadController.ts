import {Helper} from "js-helper/dist/shared/Helper";

export class GamepadController {

    static EVENTS = ["connect", "disconnect", "buttonchange", "axischange"];

    static _gamepads: any = {};
    static _buttonValues: any = {};
    static _axesValues: any = {};

    static _listener: any = {};
    static _listenerMaxId: any = {};

    static _animationFrame;

    //Listener functions
    static on(event, listener) {
        if (this.EVENTS.indexOf(event) === -1) {
            return false;
        }

        this._listener[event] = Helper.nonNull(this._listener[event], {});
        this._listenerMaxId[event] = Helper.nonNull(this._listenerMaxId[event], 0);
        this._listenerMaxId[event]++;
        let id = this._listenerMaxId[event];
        this._listener[event][id] = listener;
        return id;
    }

    static off(event, listenerId) {
        if (this.EVENTS.indexOf(event) === -1 && Helper.isNotNull(this._listener[event][listenerId])) {
            return false;
        }
        delete this._listener[event][listenerId];
        return true;
    }

    static _trigger(event, ...args) {
        if (Helper.isNotNull(this._listener[event])) {
            let listeners = this._listener[event];
            Object.keys(listeners).forEach(id => {
                listeners[id](...args);
            });
        }
    }

    static _addGamepad(gamepad){
        if (Helper.isNull(gamepad)){
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
            delete this._buttonValues[e.gamepad.index];
            // @ts-ignore
            delete this._axesValues[e.gamepad.index];
            // @ts-ignore
            this._trigger("disconnect", e.gamepad, e);
        });

        let gamepads = navigator.getGamepads();
        for(let i = 0; i < gamepads.length; i++){
            this._addGamepad(gamepads[i]);
        }

        //starting of the loop
        this._loop();
    }

    static getGamepads(): any {
        // @ts-ignore
        return Object.values(this._gamepads);
    }

    //Poll Functions
    static pollButtons() {
        this.getGamepads().forEach(gamepad => {
            gamepad.buttons.forEach((button, index) => {
                let previousButtonValue = this._buttonValues[gamepad.index][index];
                if (button.value !== previousButtonValue) {
                    this._trigger("buttonchange", gamepad, index, button.value, previousButtonValue, button);
                    this._buttonValues[gamepad.index][index] = button.value;
                }
            })
        })
    }

    static pollAxes() {
        this.getGamepads().forEach(gamepad => {
            gamepad.axes.forEach((axisValue, index) => {
                let previousAxisValue = this._axesValues[gamepad.index][index];
                if (axisValue !== previousAxisValue) {
                    this._trigger("axischange", gamepad, index, axisValue, previousAxisValue);
                    this._buttonValues[gamepad.index][index] = axisValue;
                }
            })
        })
    }

    //loopFunction
    static _loop(){
        this.pollButtons();
        this.pollAxes();

        this._animationFrame = requestAnimationFrame(() => this._loop);
    }

    //Specific listener functions
    static addButtonAxisListener(event, listener, gamepadIndex?, buttonIndex?){
        let realListener = (gamepad, index, value, oldValue, button) => {
            if (Helper.isNull(gamepadIndex) || gamepad.index === gamepadIndex){
                if (Helper.isNull(buttonIndex) || index === buttonIndex){
                    listener(value, oldValue, button);
                }
            }
        };
        return this.on(event, realListener);
    }

    static addButtonListener(listener, gamepadIndex?, buttonIndex?){
        return this.addButtonAxisListener("buttonchange", listener, gamepadIndex, buttonIndex);
    }
    static addAxisListener(listener, gamepadIndex?, axisIndex?){
        return this.addButtonAxisListener("axischange", listener, gamepadIndex, axisIndex);
    }

    static addButtonDownListener(listener, gamepadIndex?, buttonIndex?){
        let realListener = (gamepad, index, value, oldValue, button) => {
            if (button.pressed && oldValue === 0){
                listener(...arguments);
            }
        };

        return this.addButtonAxisListener("buttonchange", realListener, gamepadIndex, buttonIndex);
    }

    static addButtonUpListener(listener, gamepadIndex?, buttonIndex?){
        let realListener = (gamepad, index, value, oldValue, button) => {
            if (!button.pressed && oldValue > 0){
                listener(...arguments);
            }
        };

        return this.addButtonAxisListener("buttonchange", realListener, gamepadIndex, buttonIndex);
    }

}