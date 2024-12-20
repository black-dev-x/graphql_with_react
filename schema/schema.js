const graphql = require('graphql')
const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
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
    companies: {
      type: new GraphQLList(CompanyType),
      async resolve(_, args) {
        return await axios.get(`http://localhost:3000/companies/`).then(res => res.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(_, args) {
        return await axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data)
      }
    },
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
