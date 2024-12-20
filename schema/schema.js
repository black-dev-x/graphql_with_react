const graphql = require('graphql')
const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    companyId: { type: GraphQLString },
    company: { 
      type: CompanyType,
      resolve({companyId}) {
        return axios.get(`http://localhost:3000/companies/${companyId}`).then(res => res.data)
      }
    },
  },
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(_, args) {
        return await axios.get(`http://localhost:3000/users/${args.id}`).then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
