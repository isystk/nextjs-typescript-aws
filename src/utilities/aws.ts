import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js"

const config = {
  region: process.env.AWS_REGION,
  IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
  UserPoolId: process.env.AWS_USER_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
}

export const getUserPool = () => {
  return new CognitoUserPool({
    UserPoolId: config.UserPoolId,
    ClientId: config.ClientId,
  })
}
