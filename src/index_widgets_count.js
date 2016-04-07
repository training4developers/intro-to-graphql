"use strict";

import {
	GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt
} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

// Import our data set from above
var data = require('./widgets.json');

// Define our user type, with two string fields; `id` and `name`

var WidgetType = new GraphQLObjectType({
  name: 'Widget',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
		description: {type: GraphQLString },
		color: { type: GraphQLString },
		size: { type: GraphQLString },
		quantity: { type: GraphQLInt }
  })
});

var UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    widgets: {
			type: new GraphQLList(WidgetType),
			resolve: () => {
				return data;
			}
		}
  })
});

// Define our schema, with one top level field, named `user`, that
// takes an `id` argument and returns the User with that ID.
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      user: {
        type: UserType,
				args: {
					id: { type: GraphQLString }
				},
        resolve: function (_, args) {
          return { id: 1 };
        }
      },
			widgets: {
				type: new GraphQLList(WidgetType),
				args: {
					count: { type: GraphQLInt }
				},
				resolve: (_, {count}) => data.slice(0, count)
			}
    })
  })
});

express()
  .use('/graphql', graphqlHTTP({
		schema: schema,
		pretty: true,
	 	graphiql: true
	}))
  .listen(3000, function() {
		console.log('Server online!');
	});
