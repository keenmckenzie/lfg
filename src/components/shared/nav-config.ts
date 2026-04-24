export interface NavItem {
  label: string
  href: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const ABOUT_ITEMS: NavItem[] = [
  { label: 'Mission', href: '/mission' },
  { label: 'Team', href: '/team' },
]

export const UPDATES_ITEMS: NavItem[] = [
  { label: 'News', href: '/news' },
  { label: 'Stories', href: '/stories' },
  { label: 'Events', href: '/events' },
]

export const NAV_GROUPS: NavGroup[] = [
  { label: 'About', items: ABOUT_ITEMS },
  { label: 'Updates', items: UPDATES_ITEMS },
]

export const NAV_LEAF_ITEMS: NavItem[] = [{ label: 'Contact', href: '/contact' }]
