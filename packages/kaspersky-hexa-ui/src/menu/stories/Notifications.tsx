import { MenuPreviewNotificationButton } from '@src/menu/preview/MenuPreview'
import { clickHandler } from '@src/menu/stories/CustomItem'
import React from 'react'

export function getNotificationsIcon (hasNotifications: boolean): React.ReactNode {
  return (
    <MenuPreviewNotificationButton
      hasNotifications={hasNotifications}
      onClick={() => clickHandler('Notifications')}
    />
  )
}
