import chai, { expect } from 'chai'
import { Contract, constants, utils, BigNumber } from 'ethers'
import { solidity, MockProvider, deployContract } from 'ethereum-waffle'
import { ecsign } from 'ethereumjs-util'
import { hexToAscii } from 'web3-utils'

import { expandTo18Decimals, getApprovalDigest } from './shared/utilities'

import BananaFinanceBEP20 from '../build/BananaFinanceBEP20.json'

chai.use(solidity)

const TEST_AMOUNT = expandTo18Decimals(10)

describe('BananaFinanceBEP20', () => {
  const provider = new MockProvider({
    ganacheOptions: {
      hardfork: 'istanbul',
      mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
      gasLimit: 9999999,
    },
  })
  const [wallet, other] = provider.getWallets()

  let token: Contract
  beforeEach(async () => {
    token = await deployContract(wallet, BananaFinanceBEP20)
  })

  it('name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH', async () => {
    const name = await token.name()
    expect(name).to.eq('Space LPs')
    expect(await token.symbol()).to.eq('SLP')
    expect(await token.decimals()).to.eq(18)
    expect(await token.DOMAIN_SEPARATOR()).to.eq(
      utils.keccak256(
        utils.defaultAbiCoder.encode(
          ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
          [
            utils.keccak256(
              utils.toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')
            ),
            utils.keccak256(utils.toUtf8Bytes(name)),
            utils.keccak256(utils.toUtf8Bytes('1')),
            1,
            token.address,
          ]
        )
      )
    )
    expect(await token.PERMIT_TYPEHASH()).to.eq(
      utils.keccak256(
        utils.toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')
      )
    )
  })

  it('permit', async () => {
    const nonce = await token.nonces(wallet.address)
    const deadline = constants.MaxUint256
    const digest = await getApprovalDigest(
      token,
      { owner: wallet.address, spender: other.address, value: TEST_AMOUNT },
      nonce,
      deadline
    )

    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))

    await expect(
      token.permit(wallet.address, other.address, TEST_AMOUNT, deadline, v, utils.hexlify(r), utils.hexlify(s))
    )
      .to.emit(token, 'Approval')
      .withArgs(wallet.address, other.address, TEST_AMOUNT)
    expect(await token.allowance(wallet.address, other.address)).to.eq(TEST_AMOUNT)
    expect(await token.nonces(wallet.address)).to.eq(BigNumber.from(1))
  })

  it('toAscii', async () => {
    console.log(
      hexToAscii(
        '0xeaaed4420000000000000000000000002a9a937fc5540a060fc960ac7ba53916fbad1c0b00000000000000000000000000000000000000000000003635c9adc5dea0000000000000000000000000000000000000000000000000003635c9adc5dea000000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000337e3cee9c3e892f84c76b0ec2c06fd4ab06a734000000000000000000000000000000000000000000000000000000005f56ec11'
      )
    )
  })
})
