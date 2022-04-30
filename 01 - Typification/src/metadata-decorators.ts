import 'reflect-metadata';

@printMetadata
class Example {
    property: string = 'example property';

    @metaDecorator('example meta')
    method(): void {
        console.log('example method');
    }
}

function metaDecorator(meta: string) {
    return function (target: Example, key: string) {
        Reflect.defineMetadata('meta', meta, target, key);
    };
}

function printMetadata(target: typeof Example) {
    for (let key in target.prototype) { // working with es5 but not with es2016
        const meta = Reflect.getMetadata('meta', target.prototype, key);
        console.log(`${key}: ${meta}`);
    }
}

// const meta = Reflect.getMetadata('meta', Example.prototype, 'method');
// console.log(meta);
