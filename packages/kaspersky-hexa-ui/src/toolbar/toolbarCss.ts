import { Button } from '@src/button'
import buttonStyles from '@src/button/Button.module.scss'
import { Divider } from '@src/divider'
import { Indicator } from '@src/indicator'
import { Textbox } from '@src/input'
import { Search } from '@src/search'
import { searchCss } from '@src/search/searchCss'
import { Space } from '@src/space'
import styled, { css } from 'styled-components'

import { ToolbarBlockSide } from './types'

export const ToolbarButton = styled(Button)``

export const ToolbarSearch = styled(Search)``

export const StyledToolbarDivider = styled(Divider)`
  && {
    height: 24px;
    margin: 0 4px;
    flex-shrink: 0;
    align-self: center;
  }
`

export const ButtonIndicator = styled(Indicator)`
  position: absolute;
  top: -2px;
  right: -2px;
`

export const ButtonIconWrapper = styled.span`
  && {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

type StyledToolbarProps = {
  $sticky?: number,
  $autoDropdown?: boolean
}

export const toolbarCss = css<StyledToolbarProps>`
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  z-index: 1;
  padding: 4px;
  gap: ${props => props.$autoDropdown ? 24 : 64}px;
  background: var(--toolbar--bg);
  border-radius: 8px;
  width: 100%;
  min-width: ${props => props.$autoDropdown ? 0 : 'max-content'};

  .kl-components-button-text {
    display: flex;
  }

  .ant-btn > span[role=img] + span,
  .ant-btn > span + span[role=img] {
    margin-left: 0px;
  }

  &.sticky {
    position: sticky;
    top: ${props => props.$sticky ? props.$sticky : 0}px;
    z-index: 2;
  }

  &&& ${ToolbarSearch}, &&& .ant-input-affix-wrapper {
    width: 300px;
    color: var(--toolbar_search--text--placeholder_enabled);
    background-color: var(--toolbar_search--bg--enabled);
    border-color: transparent;
  }

  &&& ${ToolbarButton}, .ant-btn {
    border-radius: 8px;
    &, &:focus {
      &:hover {
        background-color: var(--toolbar_button--bg--hover);
      }
      &:active,
      &.${buttonStyles.buttonPressed} {
        background-color: var(--toolbar_button--bg--active);
      }
    }
    
    &[disabled] {
      &, &:hover, &:active, &:focus {
        background: none;
      }
    }
  }
`

type StyledBlockProps = {
  $side?: ToolbarBlockSide,
  $oneElement?: boolean,
  $oneElementSelector?: string,
  $autoDropdown?: boolean
}

export const StyledBlock = styled(Space)<StyledBlockProps>`
  position: ${({ $autoDropdown }) => $autoDropdown ? 'relative' : 'absolute'};
  ${({ $side, $autoDropdown }) => $autoDropdown ? '' : `${$side}: 4px;`}
  ${({ $side, $autoDropdown }) => $side === 'left' && $autoDropdown && 'min-width: 0;'}
  ${({ $side, $autoDropdown }) => $autoDropdown && `
  flex-grow: ${$side === 'left' ? 1 : 'initial'};
  flex-shrink: ${$side === 'right' ? 0 : 'initial'};
  `}

  ${({ $oneElement, $oneElementSelector }) => $oneElement && `
    &, ${$oneElementSelector} {
      width: 100%;
    }
    & > * {
      justify-content: end;
    }
    position: unset;
    right: unset;
    left: unset;
  `}
`

type ToolbarItemWrapProps = { $isHidden?: boolean }

export const ToolbarItemWrap = styled.div<ToolbarItemWrapProps>`
  min-height: 100%;
  display: flex;
  align-items: center;
  opacity: ${({ $isHidden }) => $isHidden ? 0 : 1};
  pointer-events: ${({ $isHidden }) => $isHidden ? 'none' : 'auto'};
  transition: opacity .2s;
`

export const ToolbarMeasureLayer = styled.div`
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: visible;
  visibility: hidden;
  pointer-events: none;
`

export const AutoDropdownPart = styled.div<ToolbarItemWrapProps>`
  display: ${({ $isHidden }) => $isHidden ? 'none' : 'block'};
  flex-shrink: 0;
`

type StyledSearchProps = {
  $visible?: boolean
}

export const StyledSearch = styled.div<StyledSearchProps>`
  position: relative;
  padding: 6px 12px;
  background-color: var(--toolbar_search--bg--enabled);
  color: var(--toolbar_search--text--placeholder_enabled);
  border-radius: 8px;
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: var(--toolbar_search--bg--hover);
  }
  &:focus-visible {
    box-shadow: 0px 0px 0px 2px var(--focus--stroke);
    outline: none;
  }

  ${(props) => props.$visible && css`
    background-color: transparent;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
    * {
      z-index: 1;
    }
    &:focus-visible {
      box-shadow: none;
    }
  `}
`

export const StyledTextbox = styled(Textbox)<StyledSearchProps>`
  ${searchCss}

  &&&&.ant-input {
    background-color: var(--toolbar_search--bg--enabled);
    border-color: transparent;
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    padding-right: 32px;
    opacity: 0;
    transform: scaleX(0);
    transform-origin: 300px center;
    transition: all 0.3s, transform 150ms ease;
    
    ${(props) => props.$visible && css`
      transform: scaleX(1);
      opacity: 1;
     
      &:hover:not(:focus-within) {
        border-color: var(--toolbar_search--border--hover);
      }
    `}
  }
`

export const DropdownTriggerIconsWrapper = styled.div``
