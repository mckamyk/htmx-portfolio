import Elysia, {t} from 'elysia';
import {generateNonce} from 'siwe'
import { App } from '../..';

export const registerNonceRoute = (app: App) => {
  app.get('/nonce', getNonce)
  app.post('/verify', verify, {body: t.Object({
    message: t.String(),
    signature: t.String(),
  })})
}

const getNonce = () => {
  const nonce = generateNonce();
  return new Response(nonce, {headers: {'content-type': 'text/plain'}})
}

interface VerifyBody {
  message: string
  signature: string
}

const verify = ({body}: {body: VerifyBody}) => {
  const {signature, message} = body;
}
