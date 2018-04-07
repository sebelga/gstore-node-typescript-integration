import * as Datastore from '@google-cloud/datastore';

import * as GstoreNode from 'gstore-node';

const ds = new Datastore({ projectId: 'gstore-integration-tests' });

// ----------- GSTORE ---------------
// ----------------------------------

const cacheConfig: GstoreNode.CacheConfig = {
    ttl: {
        keys: 60,
        queries: 100,
        stores: {
            memorya: {
                keys: 123,
                queries: 123,
            }
        }
    },
    cachePrefix: {
        keys: 'abc',
        queries: 'def'
    },
    global: false
}
const gstore = GstoreNode();

gstore.connect(ds);
gstore;
const { Schema, createDataLoader, errors } = gstore;
const dataloader = createDataLoader();
const err = errors.codes.ERR_ENTITY_NOT_FOUND;
const testError = new errors.ValidationError();
testError.code = errors.codes.ERR_PROP_IN_RANGE;
if ({} instanceof errors.GstoreError) {
}


// ----------- SCHEMA ---------------
// ----------------------------------

type UserTypes = {
    userName: string; // mandatory
    email: string; // mandatory
    age?: number;
    tags?: string[];
    birthday?: Date;
}

function customValidation() {
    return true;
}

// 1. Strict Schema definition
const schema1 = new Schema<UserTypes>({
    userName: {
        type: 'int',
        joi: 123,
        validate: {
            rule: 'abc',
            args: [123],
        },
        default: gstore.defaultValues.NOW,
        excludeFromIndexes: true,
        unknownSetting: 123,
    },
    email: {},
    age: {},
    tags: {},
    birthday: {},
    unknownNotAllowed: {}
});

const birthday = schema1.paths.birthday;
const isDate = birthday.type instanceof Date;

schema1.path('abc', { type: 'int' });
schema1.virtual('test').get(function() {});
schema1.virtual('fullName').set(function(name: any) {
});
schema1.methods.myMethod = function(): Promise<any> {
    return Promise.resolve(true);
};
schema1.queries('list', { limit: 10 });

schema1.pre('test', function(this:GstoreNode.Entity, arg1: any, arg2: any) {
    return this.datastoreEntity();
});

schema1.post('save', function() {
    return Promise.resolve();
});

// 2. No Type check
const schema = new Schema({
    do: {},
    whatever: {},
    youWant: { butThisIsWrong: true },
});

// ----------- MODEL ---------------
// ----------------------------------
// 1. Strict Type
const Model1 = gstore.model<UserTypes>('User', schema1);

Model1.get(123, ['Parent', 'default'], 'test.com', undefined, { cache: true, ttl: 123 }).then((entity) => {
    console.log(entity.age);
    console.log(entity.wrongParam);
    return entity.plain({ readAll: true });
});
Model1.update(123, { a: 123 }, ['Parent', 'default'], 'test.com', undefined, { replace: true }).then((entity) => {
    console.log(entity.age);
    console.log(entity.wrongParam);
    return entity.plain({ readAll: true });
});
Model1.delete(123).then((data) => {
    // Check Promise resonse
    console.log(data.apiResponse);
    console.log(data.key);
    console.log(data.success);
    console.log(data.wrongParam);
});
Model1.delete(undefined, undefined, undefined, { id: 123 }).then();
Model1.clearCache([123, 'abc']).then();

const key = Model1.key(123, ['Parent', 'defult'], 'com.test');
const data = Model1.sanitize({a: 'sadf'});
data.userName;

// 2. Strict type + "any" (schemaless)
const Model2 = gstore.model<UserTypes & {[propName: string]: any}>('User', schema);
const data2 = Model1.sanitize({a: 'sadf'});

Model2.get(123).then((entity) => {
    console.log(entity.birthday);
    console.log(entity.unknownButOk);
});

// 3. No Type
const Model3 = gstore.model('User', schema);
Model3.get(123).then((entity) => {
    console.log(entity.whatever);
});

// ----------- ENTITY ---------------
// ----------------------------------

// 1. Strict type
const entity = new Model1({ userName: 'john', email: 'test@test.com' }, 123, undefined, 'test.com');

entity.save(undefined, { method: 'insert'}).then((entity) => {
    console.log(entity);
    console.log(entity.email);
    console.log(entity.entityKey);
    console.log(entity.wrongParam);
});

const checkPlain = entity.plain({ showKey: true });
console.log(checkPlain.email);
console.log(checkPlain.__key);

const age = entity.entityData.age;
const age2 = entity.age;
const wrong = entity.wrongProp;
entity.entityData.age = 123;
entity.userName = 'john';

type Image = {
    url: string;
    year: number;
}

const ImageModel = entity.model<Image>('Image');
const ImageModel2 = entity.model('Image');
ImageModel.get(123);
const image = new ImageModel({ url: 'abc', year: 2000 });
image.entityData.year = 123;
const year = image.entityData.year;
const image2 = new ImageModel2({ url: 'abc' });
const check = image2.entityData.asdfsadf;

entity.datastoreEntity().then((entity) => {
    console.log(entity.email);
    console.log(entity.entityData);
});
const a = entity.validate();
const { error } = a as GstoreNode.Validation;

gstore.save(entity).then();
gstore.save([entity, entity]).then();


// ----------- QUERIES ---------------
// ----------------------------------

const query = Model1.query();
query.filter('abc', '<', 123).runStream({ consistency: 'strong' }).on('abc', () => {});
query.run({ consistency: 'strong', readAll: true }).then(({ entities, nextPageCursor }) => {
    const entity = entities[0];
    console.log(entity.email);
    console.log(entity.entityData);
    console.log(nextPageCursor.charAt(0));
});

Model1.list().then(({  entities, nextPageCursor }) => {
    const entity = entities[0];
    entity.entityData.userName;
    console.log(entity.email);
    console.log(nextPageCursor.indexOf('abc'))
});

Model1.list({
    filters: [['test', '<', 123],['test', '<', 123]],
    limit: 123,
    namespace: 'test',
    readAll: true,
    showKey: true,
}).then();

Model1.findOne({ email: 'john@snow.com' }, undefined, 'com.test').then();

Model1.deleteAll(['test', 123], 'com.test').then((res) => {
    console.log(res.success);
    console.log(res.message);
});

Model1.findAround('test', 123, { before: 123, format: 'JSON' }).then(({ entities }) => {
    const [entity] = entities;
    console.log(entity.email);
});
