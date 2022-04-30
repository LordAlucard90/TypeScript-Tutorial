import { AxiosPromise, AxiosResponse } from 'axios';

/*
 * Attributes
 */
export interface ModelAttributes<T> {
    get<K extends keyof T>(key: K): T[K];
    getAll(): T;
    set(update: T): void;
}

/*
 * Storage
 */
export interface HasId {
    id?: number;
}

export interface Sync<T extends HasId> {
    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise;
}

/*
 * Events
 */
export type Callback = () => void;

export interface Events {
    on(eventName: string, callback: Callback): void;
    trigger(eventName: string): void;
}

/*
 * Model
 */
export interface HasId {
    id?: number;
}

export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>,
    ) {}

    /*
     * Events
     */

    // !! this works only if event is initialized as property in the constructor
    on = this.events.on; // equivalent to: get on() { return this.events.on; }

    // !! this works only if event is initialized as property in the constructor
    trigger = this.events.trigger; // equivalent to: get trigger() { return this.events.trigger; }

    /*
     * Data
     */

    // !! this works only if attributes is initialized as property in the constructor
    get = this.attributes.get; // equivalent to: get get() { return this.attributes.get; }

    set(data: T): void {
        this.attributes.set(data);
        this.events.trigger('change');
    }

    /*
     * Storage
     */

    fetch(): void {
        const id = this.get('id');

        if (typeof id !== 'number') {
            throw new Error('Cannot fetch without an id.');
        }
        this.sync.fetch(id).then((response: AxiosResponse): void => {
            this.set(response.data);
        });
    }

    save(): void {
        this.sync
            .save(this.attributes.getAll())
            .then((response: AxiosResponse): void => {
                this.set(response.data); // added to automatically update the id
                this.trigger('save');
            })
            .catch(() => {
                this.trigger('error');
            });
    }
}
