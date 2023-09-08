import { createYoga, createSchema } from 'graphql-yoga'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

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
