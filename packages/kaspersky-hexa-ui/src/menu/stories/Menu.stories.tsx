import { ThemedPalette, ThemedPaletteProps } from '@design-system/palette'
import { badges } from '@sb/badges'
import { withDesignControls } from '@sb/components/designControls'
import { MetaDocsBlocks, withMeta } from '@sb/components/Meta'
import { Button } from '@src/button'
import { MenuPreviewShell, cloneNavItems, withPreviewUserAvailabilityItems } from '@src/menu/preview/MenuPreview'
import { Notification } from '@src/notification'
import { Space } from '@src/space'
import { Meta, StoryObj } from '@storybook/react'
import { Layout as AntLayout } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { componentColors } from '@kaspersky/hexa-ui-core/colors/js'
import { AppUpdate, BookmarkOutline, BookmarkSolid } from '@kaspersky/hexa-ui-icons/16'

import MetaData from '../__meta__/meta.json'
import { Menu as MenuComponent } from '../Menu'
import { clickHandler } from '../stories/CustomItem'
import { beforeItems, favItems, navItems, navUserItems } from '../stories/menu-items'
import { MenuProps, NavItemData, UserStatus } from '../types'

export type MenuStoryProps = {
  /** Shows the application logo/header block in the preview shell */
  showLogo?: boolean
}

const MenuDocsPage = (): JSX.Element => (
  <MetaDocsBlocks apiOf={MenuComponent} />
)

const storySettings: Meta<MenuProps & MenuStoryProps> = {
  args: {
    width: 280,
    collapsedWidth: 64,
    testId: 'menu-test-id',
    showLogo: true,
    onItemsChanged: () => {},
    navUserItems
  },
  argTypes: {
    collapsible: { control: false },
    submenuMarginActive: { control: false },
    showLogo: {
      description: 'Показывает логотип и заголовок приложения в preview header'
    },
    minimizerBottom: {
      description: 'Показывает кнопку сворачивания в нижней части меню'
    }
  },
  parameters: {
    actions: { argTypesRegex: '^(on.*)' },
    badges: [badges.stable, badges.reviewedByDesign],
    docs: {
      page: withMeta(MetaData, MenuDocsPage)
    }
  }
}

const meta: Meta<MenuProps & MenuStoryProps> = {
  component: MenuComponent,
  title: 'Hexa UI Components/Menu',
  ...withDesignControls<MenuProps & MenuStoryProps>({
    componentName: 'menu',
    meta: storySettings
  })
}
export default meta

const RootLayout = styled(AntLayout)`
  height: 100vh;
  background: transparent;
  padding: 0;
  margin: -24px;
`

const Section = styled(Space)`
  padding: 16px;
`

const MockMenuStory = (args: MenuProps & MenuStoryProps) => {
  const [menuNavState, setMenuNavState] = useState<NavItemData[]>(() => cloneNavItems(navItems))
  const [userMenuState, setUserMenuState] = useState<NavItemData[] | undefined>(() => (
    withPreviewUserAvailabilityItems(args.navUserItems ?? navUserItems, {
      onAvailable: () => changeUserStatus('available'),
      onUnavailable: () => changeUserStatus('unavailable')
    })
  ))
  const [isAdded, setIsAdded] = useState(false)

  const addMenuItem = () => {
    setMenuNavState((currentItems) => ([{
      state: 'new',
      weight: 100,
      key: 'New item',
      icon: AppUpdate,
      klId: 'navigation.main.newItem',
      items: [],
      isRoot: true,
      onClick: () => clickHandler('New item')
    }, ...currentItems.filter(item => item.state !== 'new')]))
    setIsAdded(true)
  }

  const removeMenuItem = () => {
    setMenuNavState((currentItems) => currentItems.filter(item => item.state !== 'new'))
    setIsAdded(false)
  }

  const hydratePreviewUserItems = (items: NavItemData[] | undefined): NavItemData[] | undefined => {
    if (!items) {
      return items
    }

    return withPreviewUserAvailabilityItems(items, {
      onAvailable: () => changeUserStatus('available'),
      onUnavailable: () => changeUserStatus('unavailable')
    })
  }

  const toggleUser = () => {
    setUserMenuState((currentItems) => hydratePreviewUserItems(currentItems?.map((item) => {
      if (item.state !== 'user') {
        return item
      }

      if (item.userProps?.role !== 'Administrator') {
        return {
          ...item,
          userProps: {
            role: 'Administrator',
            name: 'Leonardo'
          }
        }
      }

      return {
        ...item,
        userProps: {
          role: 'Operator',
          name: 'Raphael'
        }
      }
    })))
    setIsAdded(false)
  }

  const changeUserStatus = (status?: UserStatus) => {
    setUserMenuState((currentItems) => hydratePreviewUserItems(currentItems?.map((item) => {
      if (item.state !== 'user' || !item.userProps) {
        return item
      }

      const nextStatus = status ?? (() => {
        switch (item.userProps?.status) {
          case 'available':
            return 'unavailable'
          case 'unavailable':
            return undefined
          default:
            return 'available'
        }
      })()

      return {
        ...item,
        userProps: {
          ...item.userProps,
          status: nextStatus
        }
      }
    })))
  }

  useEffect(() => {
    setUserMenuState(hydratePreviewUserItems(args.navUserItems ?? navUserItems))
  }, [args.navUserItems])

  useEffect(() => {
    setMenuNavState(cloneNavItems(args.navItems ?? navItems))
  }, [args.navItems])

  return (
    <RootLayout>
      <MenuPreviewShell
        {...args}
        beforeItems={beforeItems}
        favItems={favItems}
        navItems={menuNavState}
        navUserItems={userMenuState}
        showHeader={args.showLogo}
        showServicesNav={!args.minimizerBottom}
        onHelpClick={() => clickHandler('open online help')}
        onNotificationClick={() => clickHandler('Notifications')}
        onThemeClick={() => clickHandler('change theme')}
        pinIcon={<BookmarkOutline />}
        unpinIcon={<BookmarkSolid />}
      />
      <Section gap={10} align="auto" direction="vertical">
        <Notification />
        <Space gap={10} justify="space-between">
          <Button onClick={addMenuItem} disabled={isAdded}>Add new menu item</Button>
          <Button onClick={removeMenuItem} disabled={!isAdded}>Remove new menu item</Button>
        </Space>
        <Space gap={10} justify="space-between">
          <Button onClick={toggleUser}>Toggle user</Button>
          <Button onClick={() => changeUserStatus()}>
            Change user status: {userMenuState && userMenuState.find((item) => item.state === 'user')?.userProps?.status || 'unset'}
          </Button>
        </Space>
      </Section>
    </RootLayout>
  )
}

export const Menu: StoryObj<MenuProps> = {
  render: MockMenuStory.bind({}),
  args: {
    applyAppTheme: true
  }
}

export const WithoutLogo: StoryObj<MenuProps & MenuStoryProps> = {
  render: MockMenuStory.bind({}),
  args: {
    applyAppTheme: true,
    showLogo: false
  }
}

export { WithPanel } from './WithPanel'

export const MinimizerBottom: StoryObj<MenuProps & MenuStoryProps> = {
  render: MockMenuStory.bind({}),
  args: {
    applyAppTheme: true,
    showLogo: false,
    minimizerBottom: true,
    navUserItems: []
  }
}

export const Dark: StoryObj<MenuProps> = {
  render: MockMenuStory.bind({}),
  args: {
    applyAppTheme: false
  }
}

type PaletteStory = StoryObj<ThemedPaletteProps>
export const ColorTokens: PaletteStory = {
  args: { source: { menu: componentColors.menu, menu_item: componentColors.menu_item } },
  render: args => <ThemedPalette {...args} />
}
