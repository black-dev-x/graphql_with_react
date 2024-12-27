const graphql = require('graphql')
const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve({id}) {
        return axios.get(`http://localhost:3000/users?companyId=${id}`).then(res => res.data)
      }
    }
  })
})


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
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
  }),
})


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(_, args) {
        return axios.get(`http://localhost:3000/companies/`).then(res => res.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(_, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data)
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(_, { name, age, companyId }) {
        return axios.post(`http://localhost:3000/users`, { name, age, companyId }).then(res => res.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data)
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(_, args) {
        console.log(args)
        return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
