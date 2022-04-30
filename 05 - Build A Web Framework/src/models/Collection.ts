import axios, { AxiosResponse } from 'axios';
import { Eventing } from './Eventing';

export class Collection<T, K> {
    models: T[] = [];
    events: Eventing = new Eventing();

    constructor(
        public rootUrl: string,
        public deserealize: (json: K) => T
    ) {}

    get on() {
        // shorter syntax not working in this case: on = this.events.on; // equivalent to:
        return this.events.on;
    }

    get trigger() {
        // shorter syntax not working in this case: trigger = this.events.trigger; // equivalent to:
        return this.events.trigger;
    }

    fetch(): void {
        axios.get(this.rootUrl).then((response: AxiosResponse) => {
            response.data.forEach((data: K) => {
                this.models.push(this.deserealize(data));
            });

            this.trigger('change');
        });
    }
}
