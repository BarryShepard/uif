import React from 'react'

import { TenantFilter as HexaTenantFilter } from '@src/tenantFilter'
import { TenantFilterProps } from '@src/tenantFilter/types'

import {
  previewTenantFilterAllKeys,
  previewTenantFilterData,
  previewTenantFilterSelectedKeys
} from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinTenantFilterDataItem = {
  title: string,
  key: string,
  disabled?: boolean,
  children?: UXPinTenantFilterDataItem[]
}

export type UXPinTenantFilterProps = {
  allTenantsKeys?: string[],
  buttonText?: string,
  counterText?: string,
  defaultSelectedKeys?: string[],
  titleText?: string,
  withButton?: boolean,
  withSearch?: boolean,
  withIcon?: boolean,
  className?: string,
  data?: UXPinTenantFilterDataItem[],
  codeComponentProps?: Partial<UXPinTenantFilterProps>,
  overriddenCodeProps?: Partial<UXPinTenantFilterProps>
}

const TenantFilter = ({
  allTenantsKeys,
  buttonText,
  counterText,
  data,
  defaultSelectedKeys,
  titleText,
  ...props
}: UXPinTenantFilterProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({
    allTenantsKeys,
    buttonText,
    counterText,
    data,
    defaultSelectedKeys,
    titleText,
    ...props
  }) as UXPinTenantFilterProps
  const {
    allTenantsKeys: resolvedAllTenantsKeys,
    buttonText: resolvedButtonText,
    codeComponentProps: _codeComponentProps,
    counterText: resolvedCounterText,
    data: resolvedData,
    defaultSelectedKeys: resolvedDefaultSelectedKeys,
    overriddenCodeProps: _overriddenCodeProps,
    titleText: resolvedTitleText,
    ...resolvedProps
  } = resolved

  return (
    <HexaTenantFilter
      allTenantsKeys={resolvedAllTenantsKeys ?? previewTenantFilterAllKeys}
      buttonText={resolvedButtonText ?? 'Apply'}
      counterText={resolvedCounterText ?? 'Selected'}
      data={(resolvedData ?? previewTenantFilterData) as TenantFilterProps['data']}
      defaultSelectedKeys={resolvedDefaultSelectedKeys ?? previewTenantFilterSelectedKeys}
      titleText={resolvedTitleText ?? 'Tenant filter'}
      {...resolvedProps}
    />
  )
}

export default TenantFilter
