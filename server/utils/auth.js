const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  AuthenticationError: new GraphQLError("Could not authenticate user", {
    statusCode: 401,
    expiration: {
      code: "UNAUTHENTICATED",
    },
  }),

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
