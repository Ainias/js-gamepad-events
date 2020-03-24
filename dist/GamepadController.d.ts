export declare class GamepadController {
    static EVENTS: string[];
    static _gamepads: any;
    static _buttonValues: any;
    static _axesValues: any;
    static _listener: any;
    static _listenerMaxId: any;
    static _animationFrame: any;
    static on(event: any, listener: any): any;
    static off(event: any, listenerId: any): boolean;
    static _trigger(event: any, ...args: any[]): void;
    static _addGamepad(gamepad: any): void;
    static init(): void;
    static getGamepads(): any;
    static pollButtons(): void;
    static pollAxes(): void;
    static _loop(): void;
    static addButtonAxisListener(event: any, listener: any, gamepadIndex?: any, buttonIndex?: any): any;
    static addButtonListener(listener: any, gamepadIndex?: any, buttonIndex?: any): any;
    static addAxisListener(listener: any, gamepadIndex?: any, axisIndex?: any): any;
    static addButtonDownListener(listener: any, gamepadIndex?: any, buttonIndex?: any): any;
    static addButtonUpListener(listener: any, gamepadIndex?: any, buttonIndex?: any): any;
}
