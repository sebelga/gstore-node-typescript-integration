
import { Gstore, Entity } from "gstore-node";

const gstore = new Gstore();
const { Schema } = gstore;

interface User {
    firstName: string;
    lastName: string;
  }
  
  interface UserVirtuals {
    fullName: string;
  }
  
  const schema = new Schema<User, UserVirtuals>({
    firstName: { type: String },
    lastName: { type: String },
  });
  
  const User = gstore.model('User', schema);
  
  const user = new User({ firstName: 'John', lastName: 'Snow' });
  
  console.log(user.fullName.toLowerCase());
  