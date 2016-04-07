"use strict";

import {
	GraphQLSchema, GraphQLObjectType, GraphQLString,
	GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLInterfaceType
} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

// Import our data set from above
let users = require('./users.json');
let widgets = require('./widgets.json');
let nextUserId = users.length + 1;
let nextWidgetId = widgets.length + 1;

let widgetInterfaceType = new GraphQLInterfaceType({
	name: "WidgetInterface",
	fields: () => ({
		color: { type: GraphQLString },
		size: { type: GraphQLString },
		quantity: { type: GraphQLInt }
	}),
	resolveType: () => widgetType
});

let widgetType = new GraphQLObjectType({
	name: "Widget",
	fields: () => ({
		id: { type: GraphQLInt },
		ownerId: { type: GraphQLInt },
		owner: {
			type: userType,
			resolve: ({ownerId}) => users.find(u => ownerId === u.id)
		},
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		color: { type: GraphQLString },
		size: { type: GraphQLString },
		quantity: { type: GraphQLInt }
	}),
	interfaces: [widgetInterfaceType]
});

let widgetType2 = new GraphQLObjectType({
	name: "Widget2",
	fields: () => ({
		id: { type: GraphQLInt },
		ownerId: { type: GraphQLInt },
		owner: {
			type: userType,
			resolve: ({ownerId}) => users.find(u => ownerId === u.id)
		},
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		color: { type: GraphQLString },
		size: { type: GraphQLString },
		quantity: { type: GraphQLInt }
	}),
	interfaces: [widgetInterfaceType]
});

// Define our user type, with two string fields; `id` and `name`
var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
		widgets: {
			type: new GraphQLList(widgetType),
			args: {
				count: { type: GraphQLInt }
			},
			resolve: ({id}, {count}) => widgets
				.filter(w => w.ownerId === id)
				.slice(0, count ? count : undefined)
		}
  })
});

let query = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		users: {
			type: new GraphQLList(userType),
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (_, {id}) => id ? [].concat(users.find(u => u.id === id)) : users
		},
		widgets: {
			type: new GraphQLList(widgetType),
			resolve: () => widgets
		},
		allWidgets: {
			type: new GraphQLList(widgetInterfaceType),
			resolve: () => widgets
		}
	})
});

let userTypeInput = new GraphQLInputObjectType({
	name: "UserInput",
	description: "Type for user input",
	fields: () => ({
    name: { type: GraphQLString }
	})
});

let mutation = new GraphQLObjectType({
	name: "Mutation",
	description: "Mutates user and widget objects",
	fields: () => ({
		insertUser: {
			type: userType,
			args: {
				user: {
					type: userTypeInput
				}
			},
			resolve: (_, {user}) => {
				user.id = nextUserId++;
				users.push(user);
				return user;
			}
		}
	})
});

var schema = new GraphQLSchema({ query, mutation });

express()
  .use('/graphql', graphqlHTTP({
		schema: schema,
		pretty: true,
	 	graphiql: true
	}))
	.use(express.static("dist/www"))
  .listen(3000, function() {
		console.log('Server online!');
	});
