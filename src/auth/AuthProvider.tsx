import React, { FC, createContext, useEffect, useState, ReactNode } from 'react'
import {
  CognitoUser,
  CognitoUserAttribute
} from "amazon-cognito-identity-js"
import { getUserPool } from '../utilities/aws'

type AuthContextProps = {
  currentUser: CognitoUser | null | undefined
}

const AuthContext = createContext<AuthContextProps>({ currentUser: undefined })

type Props = {
  children?: ReactNode
}

const AuthProvider: FC = ({ children }: Props) => {
  const [nowLoading, setNowLoading] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<CognitoUser | null | undefined>(
    undefined
  )

  useEffect(() => {
    const user = getUserPool().getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setNowLoading(false)
    }
  }, [])

  return nowLoading ? (
    <div>Loading...</div>
  ) : (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
