import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MOGNOURL: get('MONGODB').required().asString(),
  TOKENSECRET: get('TOKENSECRET').required().asString(),
}



