import { useMemo } from 'react'
import { useMutation } from 'react-query'

import useTxStatus from 'hooks/useTxStatus'
import { usePoolFromListQueryById } from 'queries/usePoolsListQuery'
import { useRecoilValue } from 'recoil'
import { chainState } from 'state/chainState'
import { createExecuteMessage, validateTransactionSuccess } from 'util/messages'
import { useChain } from '@cosmos-kit/react-lite'
import { useClients } from 'hooks/useClients'

type OpenPosition = {
  poolId: string
}

export const useClosePosition = ({ poolId }: OpenPosition) => {
  const { chainName } = useRecoilValue(chainState)
  const { address } = useChain(chainName)
  const { signingClient } = useClients(chainName)
  const [pool] = usePoolFromListQueryById({ poolId })
  const { onError, onSuccess, ...tx } = useTxStatus({
    transactionType: 'Close Position',
    signingClient,
  })

  const createClosPositionMessage = (unbonding_duration: number) => {
    const msg = createExecuteMessage({
      message: {
        close_position: {
          unbonding_duration,
        },
      },
      senderAddress: address,
      contractAddress: pool?.staking_address,
      funds: [],
    })

    return [msg]
  }

  const { mutate: submit, ...state } = useMutation({
    mutationFn: async ({
      unbonding_duration,
    }: {
      unbonding_duration: number
    }) => {
      const msgs = createClosPositionMessage(unbonding_duration)

      return validateTransactionSuccess(
        await signingClient.signAndBroadcast(address, msgs, 'auto', null)
      )
    },
    onError,
    onSuccess,
  })

  return useMemo(
    () => ({
      submit,
      ...state,
      ...tx,
    }),
    [tx, state, submit]
  )
}
