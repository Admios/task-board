import { createYoga, createSchema } from 'graphql-yoga'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

const schema = createSchema({
  typeDefs,
  resolvers,
})

export default createYoga({
  schema,
})
