import { Gstore, Entity } from "gstore-node";

const gstore = new Gstore();
const { Schema } = gstore;

interface CustomEntity {
  firstName: string;
  lastName: string;
}

interface CustomMethods {
  texts: () => Promise<null>;
}

const customSchema = new Schema<CustomEntity, CustomMethods>({
  firstName: {},
  lastName: {},
});

customSchema
  .virtual("fullname")
  .get(function fullName(this: Entity<CustomEntity>) {
    return `${this.firstname} ${this.lastname}`;
  });

customSchema.methods.texts = function getTexts() {
  const query = this.model("Text").query().hasAncestor(this.entityKey);

  return query.run();
};

const CustomModel = gstore.model("User", customSchema);

const temp = new CustomModel();
temp.texts();
