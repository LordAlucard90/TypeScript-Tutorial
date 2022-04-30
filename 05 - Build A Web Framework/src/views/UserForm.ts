import { User, UserProps } from '../models/User';
import { View } from './View';

export class UserForm extends View<User, UserProps> {
    eventsMap(): { [key: string]: () => void } {
        return {
            'click:.set-age': this.onSetAgeClick,
            'click:.set-name': this.onSetNameClick,
            'click:.save': this.onSaveClick,
        };
    }

    // !! needed an arrow function to do not loose the `this` reference
    onSetAgeClick = (): void => {
        this.model.setRandomAge();
    };

    // !! needed an arrow function to do not loose the `this` reference
    onSetNameClick = () => {
        const input = this.parent.querySelector('input');
        if (input) {
            const name = input.value;
            this.model.set({ name });
        }
    };

    // !! needed an arrow function to do not loose the `this` reference
    onSaveClick = (): void => {
        this.model.save();
    };

    template(): string {
        return `
        <div>
            <input placeholder="${this.model.get('name')}" />
            <button class="set-name">Change me</button>
            <button class="set-age">Set Random Age</button>
            <button class="save">Save</button>
        </div>
        `;
    }
}
