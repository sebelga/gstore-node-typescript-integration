import { Gstore } from 'gstore-node';

const gstore = new Gstore();
const { Schema } = gstore;

interface User {
    name: string;
    email: string;
    age: number;
}

const userSchema = new Schema<User>({
    email: { type: String },
    name: { type: String },
    age: { type: Number }
});

const User = gstore.model('User', userSchema);

const user = new User({ name: 'seb', email: 'test', age: 'should be a number' });


User.get(123).then((entity) => {
    const name = entity.name;
    const email = entity.email;
    const age = entity.age;
    entity.populate()
});

User.get([123, 456]).then((entities) => {
    const [user1, user2] = entities;
    const { age, name, email } = user1;
});

const query = User.query();
query.filter('age', '<', 111);
query.filter('age', '<', 'should be a number');
query.filter('this prop does not exist', 'whatever');
query.run().then(result => {
    result.entities[0].age;
});
query.run({ format: 'ENTITY' }).populate().then(result => {
    result.entities[0];
});

// Query specifying the format
const query2 = User.query<'ENTITY'>();
query2.run().then(result => {
    const { entities } = result;
    const [user] = entities;
    user.populate().then(entity => {
        entity.save();
    })
})

User.list({ format: 'ENTITY' }).populate().then((result) => {
    result.entities[0].age;
    result.entities[0].populate();
});

User.findAround('email', 123, {}, 'ok').populate().then((result) => {
    result[0].age;
});

User.findAround('age', 123, { format: 'ENTITY' }, 'ok')
    .populate()
    .then((result) => {
    result[0].populate();
});

User.findOne({ age: 123 }).populate().then((user) => {
    user!.populate(['user', 'address'], 'should-not-allow-this-prop');
    user!.populate('oneprop', 'someProperty')
    user!.populate('oneprop', ['array', 'of', 'prop']).then((entity) => {
        
    })
});

User.delete(123).then((res) => {
    res.success;
});

User.deleteAll().then((result) => {
});

User.get(123).populate('hello', 'test').then((entity) => {
    entity.age;
});
User.get(123, ['abc', 123], 'namespace', undefined, { cache: false }).populate('hello', 'test').then((entity) => {
    entity.age;
});

