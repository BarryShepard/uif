import { css } from 'styled-components'

export const menuCss = css`
  background-color: var(--menu--bg--surface--enabled);
  border-right: 1px solid var(--menu--border--enabled);
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    padding: 16px 0;
    gap: 8px;
  }

  .uif-nav.nav-scrollable {
    flex: 1 1 0;
    min-height: 0;
    max-height: 100%;
  }

  &.menu-submenu-margin {
    margin-right: 280px;
  }
`

export const bottomWrapperCss = css`
  padding: 0 var(--spacing--padding_l);

  button {
    margin: var(--spacing--gap_related) var(--spacing--gap_related) 0;
  }
`
