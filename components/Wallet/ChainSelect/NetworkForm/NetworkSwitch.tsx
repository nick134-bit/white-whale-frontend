import React from 'react'
import { useQueryClient } from 'react-query'
import { Switch } from '@chakra-ui/react'
import { MAINNET_TESTNET_MAP, NETWORK_MAP } from 'constants/index'
import { useRecoilState } from 'recoil'
import { NetworkType, chainState } from 'state/chainState'
import { useChain } from '@cosmos-kit/react-lite'

function NetworkSwitch() {
  const queryClient = useQueryClient()
  const [currentWalletState, setWalletState] = useRecoilState(chainState)
  const { disconnect } = useChain(currentWalletState.chainName)

  const changeNetwork = async () => {
    queryClient.clear()

    const updatedChainId =
      MAINNET_TESTNET_MAP?.[currentWalletState.chainId] ??
      currentWalletState.chainId
    const updatedNetwork =
      updatedChainId !== currentWalletState.chainId
        ? NETWORK_MAP[currentWalletState.network]
        : currentWalletState.network

    setWalletState({
      ...currentWalletState,
      network: NetworkType[updatedNetwork],
      chainId: updatedChainId,
    })
    await disconnect()
  }

  return (
    <>
      <Switch
        id="network"
        isChecked={currentWalletState.network === NetworkType.testnet}
        onChange={changeNetwork}
      />
    </>
  )
}

export default NetworkSwitch
