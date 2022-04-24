import { AbstractSorter, Sortable } from './Sorter';

// export class CharactersCollection implements Sortable {
export class CharactersCollection extends AbstractSorter {
    constructor(public data: string) {
        super();
    }

    compare(leftIndex: number, rightIndex: number): boolean {
        return this.data[leftIndex].toLowerCase() > this.data[rightIndex].toLowerCase();
    }

    swap(leftIndex: number, rightIndex: number): void {
        const characters = this.data.split('');
        const leftHand = characters[leftIndex];
        characters[leftIndex] = characters[rightIndex];
        characters[rightIndex] = leftHand;
        this.data = characters.join('');
    }

    get length(): number {
        return this.data.length;
    }
}
