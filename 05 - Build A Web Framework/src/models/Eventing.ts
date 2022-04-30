import { Events, Callback } from './Model';

export class Eventing implements Events {
    events: { [key: string]: Callback[] } = {};

    on = (eventName: string, callback: Callback): void => {
        // dynamic array creation
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    };

    trigger = (eventName: string): void => {
        const handlers = this.events[eventName];

        if (!handlers || handlers.length === 0) {
            return;
        }

        handlers.forEach(callback => {
            callback();
        });
    };
}
