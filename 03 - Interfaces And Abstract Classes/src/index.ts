import { Sorter } from './Sorter';
import { NumbersCollection } from './NumbersCollection';
import { CharactersCollection } from './CharactersCollection';
import { LinkedList } from './LinkedList';

/*
 * With Sorter class
 */
const numbersCollection = new NumbersCollection([10, 3, -5, 0]);
const numberSorter = new Sorter(numbersCollection);
console.log('Numbers Collection:\n', numberSorter.collection);
numberSorter.sort();
console.log('Numbers Collection sorted:\n', numberSorter.collection);

const charactersCollection = new CharactersCollection('AsDfGh');
const characterSorter = new Sorter(charactersCollection);
console.log('Characters Collection:\n', characterSorter.collection);
characterSorter.sort();
console.log('Characters Collection sorted:\n', characterSorter.collection);

const linkedList = new LinkedList();
linkedList.add(10);
linkedList.add(3);
linkedList.add(-5);
linkedList.add(0);
const linkedSorter = new Sorter(linkedList);
console.log('Linked List:');
linkedList.print();
linkedSorter.sort();
console.log('Linked List sorted:');
linkedList.print();


/*
 * With AbstractSorter abstract class
 */
const numbersCollectionSorter = new NumbersCollection([10, 3, -5, 0]);
console.log('Numbers Collection Sorter\n:', numbersCollectionSorter);
numbersCollectionSorter.sort();
console.log('Numbers Collection Sorter Sorted\n:', numbersCollectionSorter);

const charactersCollectionSorter = new CharactersCollection('AsDfGh');
console.log('Characters Collection Sorter:\n', charactersCollectionSorter);
charactersCollectionSorter.sort();
console.log('Characters Collection Sorter sorted:\n', charactersCollectionSorter);

const linkedListSorter = new LinkedList();
linkedListSorter.add(10);
linkedListSorter.add(3);
linkedListSorter.add(-5);
linkedListSorter.add(0);
console.log('Linked List Sorter:');
linkedListSorter.print();
linkedListSorter.sort();
console.log('Linked List Sorter sorted:');
linkedListSorter.print();

