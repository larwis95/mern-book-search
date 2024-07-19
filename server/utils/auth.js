const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // Error for when a user is not authenticated
  AuthenticationError: new GraphQLError("Could not authenticate user", {
    statusCode: 401,
    expiration: {
      code: "UNAUTHENTICATED",
    },
  }),
  // function for auth middleware that will be used in the resolvers
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // if its sent in a header we need to split it and trim it to get the actual token
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    // if no token, return request object as is
    if (!token) {
      return req;
    }
    // try to verify and decode token, if there is an error log it as invalid token, if no error modify the request object with the decoded token data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }
    // return request object
    return req;
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
