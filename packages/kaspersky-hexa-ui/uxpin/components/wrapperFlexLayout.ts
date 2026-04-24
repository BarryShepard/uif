export const FILL_SHELL_ATTRIBUTE = 'data-hexa-uxpin-fill-shell'

const fillHeightShellSelector = `> .merge-component[${FILL_SHELL_ATTRIBUTE}='true']`

// UXPin inserts intermediate merge-component shells between wrapper blocks and nested code components.
// Keep those shells flex-aware so fill-height children can still shrink and own the scroll area.
export const wrapperChildrenCss = `
  > * {
    flex: 0 0 auto !important;
    min-width: 0;
    min-height: 0;
  }

  > .merge-component {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
`

export const buildFlexHeightChildSelectors = (...selectors: string[]): string => (
  Array.from(new Set([
    ...selectors.map((selector) => `> ${selector}`),
    fillHeightShellSelector
  ])).join(',\n')
)
