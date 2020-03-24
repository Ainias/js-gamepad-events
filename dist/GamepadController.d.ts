export declare class GamepadController {
    static EVENTS: string[];
    static _gamepads: any;
    static _buttonValues: any;
    static _axesValues: any;
    static _listener: any;
    static _animationFrame: any;
    static on(event: any, listener: any): number | false;
    static off(event: any, listenerId: any): boolean;
    static _trigger(event: any, ...args: any[]): void;
    static init(): void;
    static getGamepads(): unknown[];
    static pollButtons(): void;
    static pollAxes(): void;
    static _loop(): void;
    static addButtonAxisListener(event: any, listener: any, gamepadIndex?: any, buttonIndex?: any): void;
    static addButtonListener(listener: any, gamepadIndex?: any, buttonIndex?: any): void;
    static addAxisListener(listener: any, gamepadIndex?: any, axisIndex?: any): void;
    static addButtonDownListener(listener: any, gamepadIndex?: any, buttonIndex?: any): void;
    static addButtonUpListener(listener: any, gamepadIndex?: any, buttonIndex?: any): void;
}
