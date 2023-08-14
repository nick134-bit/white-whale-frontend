import { Box, Button } from '@chakra-ui/react'

import { useClosePosition } from './hooks/useClosePosition'
import { useWithdrawPosition } from './hooks/useWithdrawPosition'
import { PositionState } from 'components/Pages/Liquidity/hooks/useLockedPositions'

export const Action = ({ item, poolId }) => {
  const close = useClosePosition({ poolId })
  const withdraw = useWithdrawPosition({ poolId })

  if (item?.state === PositionState.active) {
    return (
      <Button
        width="full"
        variant="outline"
        size="sm"
        isLoading={close?.isLoading}
        onClick={() =>
          close?.submit({ unbonding_duration: item?.unbonding_duration })
        }
      >
        Close
      </Button>
    )
  } else if (item?.state === PositionState.unbonding) {
    return (
      <Button width="full" variant="outline" size="sm" isDisabled={true}>
        Unbonding
      </Button>
    )
  } else if (item?.state === PositionState.unbonded) {
    return (
      <Button
        width="full"
        variant="outline"
        size="sm"
        isLoading={withdraw?.isLoading}
        onClick={() => withdraw?.submit()}
      >
        Unbound
      </Button>
    )
  } else {
    return <Box w="full" />
  }
}
