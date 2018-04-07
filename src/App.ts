import * as Datastore from '@google-cloud/datastore';

// import Gstore = require('gstore-node');
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
function customValidation() {
    return true;
}

const schema = new Schema({
    userName: {
        type: 'int',
        joi: 123,
        validate: {
            rule: 'abc',
            args: [123],
        },
        default: gstore.defaultValues.NOW,
        excludeFromIndexes: true,
    },
}, { joi: { extra: 123, options: 123 } });

schema.path('abc', { type: 'int' });
schema.virtual('test').get(function() {});
schema.virtual('fullName').set(function(name) {
});
schema.methods.myMethod = function(): Promise<any> {
    return Promise.resolve(true);
};
schema.queries('list', { limit: 10 });

schema.pre('test', function(this:GstoreNode.Entity, arg1, arg2) {
    return this.datastoreEntity();
});

schema.post('save', function() {
    return Promise.resolve();
})

// ----------- MODEL ---------------
// ----------------------------------
const Model = gstore.model('User', schema);
const test = Model.schema



Model.get(123, ['Parent', 'default'], 'test.com', undefined, { cache: true, ttl: 123 }).then();

Model.update(123, { a: 123 }, ['Parent', 'default'], 'test.com', undefined, { replace: true }).then();

Model.delete(123).then((data) => {
    console.log(data.apiResponse);
    console.log(data.key);
    console.log(data.success);
});
Model.delete(undefined, undefined, undefined, undefined)

const key = Model.key(123, ['Parent', 'defult'], 'com.test');

const data = Model.sanitize({a: 'sadf'});

Model.clearCache([123, 'abc']).then();

// ----------- ENTITY ---------------
// ----------------------------------

const entity = new Model({ a: 123 }, 123, undefined, 'test.com');

entity.save(undefined, { method: 'insert'});

entity.plain({ showKey: true })
const ImageModel = entity.model('Image');
ImageModel.get(123);

entity.datastoreEntity().then();
const a = entity.validate();
const { error } = a as GstoreNode.Validation;

gstore.save(entity).then();
gstore.save([entity, entity]).then();

// ----------- QUERIES ---------------
// ----------------------------------

const query = Model.query();
query.filter('abc', '<', 123).runStream({ consistency: 'strong' }).on('abc', () => {});
query.run({ consistency: 'strong', readAll: true });

Model.list({
    filters: [['test', '<', 123],['test', '<', 123]],
    limit: 123,
    namespace: 'test',
    readAll: true,
    showKey: true,
}).then();

Model.findOne({ email: 'john@snow.com' }, undefined, 'com.test').then();

Model.deleteAll(['test', 123], 'com.test').then((res) => {
    console.log(res.success);
    console.log(res.message);
});

Model.findAround('test', 123, { before: 123, format: 'JSON' }).then();
