import chai from 'chai'
import * as ethers from 'ethers'
import { deployContract, solidity } from 'ethereum-waffle'

import BananaFinanceFactory from '../build/BananaFinanceFactory.json'

chai.use(solidity)

describe('BananaFinanceFactory', () => {
  /*
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
  // const provider = ethers.getDefaultProvider('rinkeby')
  const privateKey = ''
  const wallet = new ethers.Wallet(privateKey, provider)
  const overrides = {
    gasLimit: 9999999,
    gasPrice: 390000000000
  }

  it('deploy', async () => {
    console.log(`start deployContract swapFactory`)
    const swapFactory = await deployContract(
      wallet,
      BananaFinanceFactory,
      ['0xf9e89b5aCA2e6061d22EA98CBCc2d826E3f9E4b1'],
      overrides
    )
    console.log(`contract swapFactory address ${swapFactory.address}`)
    console.log(`contract swapFactory deploy transaction hash ${swapFactory.deployTransaction.hash}`)
    await swapFactory.deployed()
    console.log(`finish deployContract swapFatory`)
  })*/
})
