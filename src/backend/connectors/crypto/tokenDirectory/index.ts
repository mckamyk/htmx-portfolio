import fs from 'fs';
import path from 'path';
import { tokenList } from '../types';
import {serverLog} from '../../../../logger'

const chains = fs.readdirSync(import.meta.dir).filter(t => t !== 'index.ts')

export const tokenLists = chains.map(chain => {
  const content = fs.readFileSync(path.join(import.meta.dir, chain, 'erc20.json')).toString()
  const data = JSON.parse(content);
  const tl = tokenList.parse(data)

  return tl
})

let sum = 0;

tokenLists.forEach(l => sum += l.tokens.length);
serverLog.info(`Found ${sum} tokens.`)

