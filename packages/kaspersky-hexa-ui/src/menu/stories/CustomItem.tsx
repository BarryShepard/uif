import { navItemCss } from '@src/menu/navCss'
import { NavDivider } from '@src/menu/NavItem'
import { openNotification } from '@src/notification'
import cn from 'classnames'
import React from 'react'
import styled from 'styled-components'

type CustomComponentProps = {
  className?: string
}

const CustomComponent = ({ className }: CustomComponentProps) => {
  return (
    <>
      <div className={cn(className, 'uif-nav-item')}>
        <div className="uif-nav-item-entry">
          <div className="uif-nav-item-entry-icon">
          </div>
          <div className="uif-nav-item-entry-title">
            <span className="title-ellipsis">Server</span>
          </div>
          <div className="uif-nav-item-entry-props">
          </div>
        </div>
      </div>
      <NavDivider/>
    </>
  )
}

export const CustomItem = styled(CustomComponent)`
  ${navItemCss}
`

export const clickHandler = (text?: string) => {
  text && openNotification.success({ description: text, duration: 1 })
}
