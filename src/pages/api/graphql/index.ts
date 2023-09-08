import { createYoga, createSchema } from 'graphql-yoga'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

import initializeCassandra from '../database/cassandra'

const models = initializeCassandra();

var MyModel = models.loadSchema('Person', {
  fields:{
      name    : "text",
      surname : "text",
      age     : "int",
      created : "timestamp"
  },
  key:["name"]
});

// MyModel or models.instance.Person can now be used as the model instance
console.log(models.instance.Person === MyModel);


MyModel.syncDB(function(err: any, result: any) {
  if (err) throw err;
});


var john = new models.instance.Person({
  name: "John",
  surname: "Doe",
  age: 32,
  created: Date.now()
});
john.save(function(err: any){
  if(err) {
      console.log(err);
      return;
  }
  console.log('Yuppiie!');
});

models.instance.Person.findOne({name: 'John'}, function(err: any, john: { name: string; age: string; }){
  if(err) {
      console.log(err);
      return;
  }
  //Note that returned variable john here is an instance of your model,
  //so you can also do john.delete(), john.save() type operations on the instance.
  console.log('Found ' + john.name + ' to be ' + john.age + ' years old!');
});


const schema = createSchema({
  typeDefs,
  resolvers,
})

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
}

export default createYoga({
  schema,
})
