import '@testing-library/jest-dom'
import 'jest-styled-components'

import { render } from '@testing-library/react'
import React from 'react'

import GroupWrapper from '../uxpin/components/GroupWrapper/GroupWrapper'
import PageWrapper from '../uxpin/components/PageWrapper/PageWrapper'
import SectionWrapper from '../uxpin/components/SectionWrapper/SectionWrapper'

const PageWrapperRuntime = PageWrapper as React.ComponentType<Record<string, unknown>>
const SectionWrapperRuntime = SectionWrapper as React.ComponentType<Record<string, unknown>>
const GroupWrapperRuntime = GroupWrapper as React.ComponentType<Record<string, unknown>>

describe('UXPin wrapper flex height runtime', () => {
  it('propagates fill-height selectors through intermediate merge-component shells', () => {
    const { container } = render(
      <PageWrapperRuntime>
        <div className="merge-component" data-testid="section-shell">
          <SectionWrapperRuntime flexHeight={true}>
            <div className="merge-component" data-testid="group-shell">
              <GroupWrapperRuntime flexHeight={true}>
                <div className="merge-component" data-testid="table-shell">
                  <div data-hexa-uxpin-table-height-mode="fill" />
                </div>
              </GroupWrapperRuntime>
            </div>
          </SectionWrapperRuntime>
        </div>
      </PageWrapperRuntime>
    )

    const pageRoot = container.querySelector('[data-hexa-uxpin-page-wrapper="true"]') as HTMLDivElement
    const sectionRoot = container.querySelector('[data-hexa-uxpin-section-wrapper="true"]') as HTMLDivElement
    const groupRoot = container.querySelector('[data-hexa-uxpin-group-wrapper="true"]') as HTMLDivElement

    // @ts-ignore
    expect(pageRoot).toHaveStyleRule('display', 'flex', { modifier: '> .merge-component' })
    // @ts-ignore
    expect(sectionRoot).toHaveStyleRule('display', 'flex', { modifier: '> .merge-component' })
    // @ts-ignore
    expect(groupRoot).toHaveStyleRule('display', 'flex', { modifier: '> .merge-component' })

    // @ts-ignore
    expect(pageRoot).toHaveStyleRule('flex', '1 1 auto !important', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(sectionRoot).toHaveStyleRule('flex', '1 1 auto !important', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(groupRoot).toHaveStyleRule('flex', '1 1 auto !important', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })

    // @ts-ignore
    expect(pageRoot).toHaveStyleRule('min-height', '0', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(sectionRoot).toHaveStyleRule('min-height', '0', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
    // @ts-ignore
    expect(groupRoot).toHaveStyleRule('min-height', '0', {
      modifier: "> .merge-component[data-hexa-uxpin-fill-shell='true']"
    })
  })
})
