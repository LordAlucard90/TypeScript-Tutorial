import 'reflect-metadata';

const example = {
    field: 'example',
};

// metaExample will be not visible in the actual console log
Reflect.defineMetadata('metaExample', 'example meta', example); 

console.log(example)

const metaExample = Reflect.getMetadata('metaExample', example)

// now the metaExample can be logged
console.log(metaExample)

// field metadata
Reflect.defineMetadata('fieldMetaExample', 'example field meta', example, 'field'); 
const fieldMetaExample = Reflect.getMetadata('fieldMetaExample', example, 'field')
console.log(fieldMetaExample)

