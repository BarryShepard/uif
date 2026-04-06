import { Theme } from '@design-system/types'
import { TestingProps, ToViewProps } from '@helpers/typesHelpers'
import { SubmenuItemProps } from '@src/submenu'
import { SiderProps as AntSiderProps } from 'antd'
import { Dispatch, ElementType, PropsWithChildren, ReactNode, SetStateAction } from 'react'

export type UserStatus = 'available' | 'unavailable'
export type NavItemRouteParams = Record<string, unknown>
export type NavItemCondition = (state: unknown) => boolean
export type NavItemIcon = ReactNode | ElementType
export type NavItemComponent = ElementType

export type NavItemNotifications = {
  critical?: number,
  warning?: number,
  info?: number,
  multi?: number,
}

export type NavItemData = {
  /** Navigation state key used for activation and expansion handling */
  state?: string,
  routeParams?: NavItemRouteParams,
  parentState?: string,
  parentPluginId?: string,
  weight?: number,
  /** Visible item label */
  key?: string,
  id?: string,
  iconClass?: string,
  itemClass?: string | null,
  component?: NavItemComponent,
  icon?: NavItemIcon,
  klId?: string,
  items?: NavItemData[],
  onClick?: () => void,
  condition?: NavItemCondition,
  path?: string[],
  additionalElements?: ReactNode,
  groupsTree?: boolean,
  isRoot?: boolean,
  isNew?: boolean,
  description?: string,
  elementAfter?: ReactNode,
  /** not ready to use in production */
  submenuItems?: SubmenuItemProps[],
  isCaption?: boolean,
  expanded?: boolean,
  active?: boolean,
  disabled?: boolean,
  mode?: 'user',
  userProps?: UserProps,
  itemDivider?: ItemDivider.Before | ItemDivider.After,
  notifications?: NavItemNotifications | (() => NavItemNotifications),
  canBeAddedAsFav?: boolean,
  skipActivation?: boolean,
  /** Number of lines after which the content will be clamped */
  lineClamp?: number
}

export type UserProps = {
  /** User role shown in the footer area */
  role?: string,
  /** User name shown in the footer area */
  name?: string,
  /** Optional availability status used by the preview and user menu item */
  status?: UserStatus
}

export type MenuNavigationState = {
  updateNavState: (actions: StateActions) => void,
  collapseAll: VoidFunction,
  minimized?: boolean,
  childPop?: boolean,
  favsEnabled?: boolean,
  navFavItems: NavItemData[],
  setNavFavItems: (favs: NavItemData[]) => void,
  updateFavState: VoidFunction
}

type NavPresentationProps = {
  className?: string,
  data: NavItemData,
  userProps?: UserProps,
  favsEnabled?: boolean,
  component?: NavItemComponent,
  elementAfter?: ReactNode,
  isCaption?: boolean,
  disabled?: boolean,
  _isChild?: boolean,
  onFavChanged?: OnFavChangedCallback,
  pinIcon?: ReactNode,
  unpinIcon?: ReactNode,
  skipActivation?: boolean
} & TestingProps & MenuApplyTheme & MenuThemeProps

export type NavItemProps = NavPresentationProps & {
  menuState: MenuNavigationState
}

export type NavCaptionItemProps = NavPresentationProps

export type NavProps = {
  beforeItems?: NavItemData[],
  navItems?: NavItemData[],
  className?: string,
  minimized?: boolean,
  childPop?: boolean,
  inert?: boolean,
  favsEnabled?: boolean,
  favsExpanded?: boolean,
  favItems?: NavItemData[],
  onItemsChanged?: OnItemsChangedCallback,
  onFavChanged?: OnFavChangedCallback,
  onFavToggle?: OnFavToggleCallback,
  pinIcon?: ReactNode,
  unpinIcon?: ReactNode,
  favIcon?: ReactNode
} & MenuApplyTheme

export type StateActions = {
  toggleExpandItem?: string,
  toggleExpandItemOne?: string,
  activateItem?: string,
  collapseAll?: boolean
}

export type MenuToViewProps<T> = ToViewProps<T, MenuCssConfig>

export type MenuThemeProps = {
  theme?: Theme
}

export type MenuApplyTheme = {
  /** Keeps the menu synchronized with the current application theme */
  applyAppTheme?: boolean
}

export type MenuCssConfig = MenuColorConfig

export type MenuColorConfig = {
  background?: string,
  borderColor?: string,
  popBg?: string,
  popShadow?: string,
  roleColor?: string,
  captionColor?: string,
  dividerColor?: string,
  unselected?: NavItemCssState,
  selected?: NavItemCssState
}

type NavItemCssState = {
  enabled?: NavItemColors,
  hover?: NavItemColors,
  active?: NavItemColors
}

type NavItemColors = {
  color?: string,
  background?: string
}

export enum ItemDivider {
  'Before' = 'before',
  'After' = 'after'
}

export type HamburgerProps = {
  className?: string,
  role?: string,
  name?: string,
  onClick: () => void,
  collapsed?: boolean
}

export type MenuProps = PropsWithChildren<MenuThemeProps> &
TestingProps &
AntSiderProps &
MenuApplyTheme & {
  /** Items rendered before the main navigation tree */
  beforeItems?: NavItemData[],
  /** Items pinned to the favorites section */
  favItems?: NavItemData[],
  /** Controls initial expand state of the favorites section */
  favsExpanded?: boolean,
  /** Main application navigation items */
  navItems?: NavItemData[],
  /** User section items rendered at the bottom of the menu */
  navUserItems?: NavItemData[],
  /** Internal submenu spacing toggle used together with SubmenuWrapper */
  submenuMarginActive?: boolean,
  /** not ready to use in production */
  submenuItems?: SubmenuItemProps[],
  /** Called after navigation state updates such as expand/collapse */
  onItemsChanged?: OnItemsChangedCallback,
  /** Called when the set of favorite item ids changes */
  onFavChanged?: OnFavChangedCallback,
  /** Called when the favorites section is expanded or collapsed */
  onFavToggle?: OnFavToggleCallback,
  /** Icon shown when an item can be pinned */
  pinIcon?: ReactNode,
  /** Icon shown when an item is already pinned */
  unpinIcon?: ReactNode
  /** Icon used for the favorites root item */
  favIcon?: ReactNode,
  /** Shows the collapse control in the bottom area of the menu */
  minimizerBottom?: boolean
}

export type MenuViewProps = MenuToViewProps<MenuProps>

export type MenuSubmenuProps = {
  active: boolean,
  items: SubmenuItemProps[]
}

export type MenuContextProps = {
  setSubmenuItems?: Dispatch<SetStateAction<SubmenuItemProps[]>>,
  setSubmenuMarginActive?: Dispatch<SetStateAction<boolean>>,
  setSubmenuActive?: Dispatch<SetStateAction<boolean>>,
  applyAppTheme?: boolean,
  menuActiveItem: string,
  setMenuActiveItem: Dispatch<SetStateAction<string>>,
  menuActivePopupItem: string,
  setMenuActivePopupItem: Dispatch<SetStateAction<string>>
}

export type OnItemsChangedCallbackType = 'toggleItem' | 'toggleSubmenu'
export type OnItemsChangedCallback = VoidFunction

export type OnFavChangedCallback = (
  itemKeys: Array<string>
) => void

export type OnFavToggleCallback = (value: boolean) => void
