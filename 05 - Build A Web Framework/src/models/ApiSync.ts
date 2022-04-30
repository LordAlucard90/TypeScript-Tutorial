import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { HasId, Sync } from './Model';

export class ApiSync<T extends HasId> implements Sync<T> {
    constructor(public rootUrl: string) {}

    fetch(id: number): AxiosPromise {
        return axios.get(`${this.rootUrl}/${id}`);
    }

    save(data: T): AxiosPromise {
        const { id } = data;

        if (id) {
            return axios.put(`${this.rootUrl}/${id}`, data);
        } else {
            return axios.post(this.rootUrl, data);
        }
    }
}
