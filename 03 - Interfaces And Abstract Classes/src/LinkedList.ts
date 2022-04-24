import { AbstractSorter, Sortable } from './Sorter';

class Node {
    next: Node | null = null;

    constructor(public data: number) {}
}

// export class LinkedList implements Sortable {
export class LinkedList extends AbstractSorter {
    head: Node | null = null;

    add(data: number): void {
        const node = new Node(data);

        if (!this.head) {
            this.head = node;
            return;
        }

        let tail = this.head;
        while (tail.next) {
            tail = tail.next;
        }
        tail.next = node;
    }

    get length(): number {
        if (!this.head) {
            return 0;
        }

        let length = 1;
        let cur = this.head;
        while (cur.next) {
            cur = cur.next;
            length++;
        }
        return length;
    }

    at(index: number): Node {
        if (!this.head) {
            throw new Error('Index out of bound.');
        }

        let cur: Node | null = this.head;
        for (let i = 0; i < index; i++) {
            cur = cur.next;
            if (!cur) {
                throw new Error('Index out of bound.');
            }
        }

        return cur;
    }

    compare(leftIndex: number, rightIndex: number): boolean {
        if (!this.head) {
            throw new Error('List is empty');
        }
        return this.at(leftIndex).data > this.at(rightIndex).data;
    }

    swap(leftIndex: number, rightIndex: number): void {
        const leftNode = this.at(leftIndex);
        const rightNode = this.at(rightIndex);

        const leftHandData = leftNode.data;
        leftNode.data = rightNode.data;
        rightNode.data = leftHandData;
    }

    print(): void {
        if (!this.head) {
            return;
        }
        const values: number[] = [];
        let cur: Node | null = this.head;
        while (cur) {
            values.push(cur.data);
            cur = cur.next;
        }
        console.log(values);
    }
}
