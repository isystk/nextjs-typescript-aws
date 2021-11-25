import React, { useEffect, useState, FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails
} from "amazon-cognito-identity-js"
import { getUserPool } from '../../utilities/aws'
import { URL } from '@/common/constants/url'
import Layout from '@/components/Layout'
import Head from '@/components/pages/Head'
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
} from '@material-ui/core'
import { Input, Textarea } from '@/components/elements/Input'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const Login: FC = () => {
  const router = useRouter()

  useEffect(() => {
    const user = getUserPool().getCurrentUser()
    if (user) {
      user && router.push('/')
    }
  }, [])

  const errorMessage = (message) => <p className="error">{message}</p>
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(
      errorMessage('メールアドレスを入力してください。')
    ),
    password: Yup.string().required(
      errorMessage('パスワードを入力してください。')
    ),
  })
  const onSubmit = async (values) => {
    const { email, password } = values
    const authenticationDetails = new AuthenticationDetails({
      Username : email,
      Password : password
    })
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: getUserPool()
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ' + result)
        const accessToken = result.getAccessToken().getJwtToken()
        console.log('AccessToken: ' + accessToken)
        router.push(URL.HOME)
      },
      onFailure: (err) => {
        console.error(err)
        alert(err.message)
      }
    })
  }

  const initialValues = {
    email: '',
    password: '',
  }

  return (
    <Layout>
      <Head title="ログイン" />
      <section>
        <div className="entry-header">
          <h1 className="entry-title">ログイン</h1>
        </div>
        <div className="entry-content">
          <Grid container justifyContent="center" spacing={1}>
            <Grid item md={12}>
              <Card>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    setFieldValue,
                    dirty,
                    isValid,
                    values,
                    handleChange,
                    handleBlur,
                  }) => {
                    return (
                      <Form>
                        <CardContent>
                          <Grid
                            item
                            container
                            spacing={1}
                            justifyContent="center"
                          >
                            <Grid item xs={12} sm={6} md={12}>
                              <Input
                                label="メールアドレス"
                                name="email"
                                type="text"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                              <Input
                                label="パスワード"
                                name="password"
                                type="password"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Grid item xs={12} sm={6} md={6}>
                            <Button
                              disabled={!dirty || !isValid}
                              variant="contained"
                              color="primary"
                              type="Submit"
                            >
                              ログインする
                            </Button>
                          </Grid>
                        </CardActions>
                      </Form>
                    )
                  }}
                </Formik>
                <CardContent>
                  <Grid item container spacing={1} justifyContent="center">
                    <Grid item xs={12} sm={6} md={12}>
                      <Link href={URL.SIGNUP}>
                        <a>会員登録はこちら</a>
                      </Link>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </section>
    </Layout>
  )
}

export default Login
