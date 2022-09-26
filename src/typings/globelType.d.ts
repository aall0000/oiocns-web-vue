type MenuItemType = {
  id?: string
  name: string
  icon: string
  path: string
  type?: string
  fixed?: boolean
  key?: string | unknown
  bottom?: boolean | unknown
}

type CommonParamsType = {
  offset: number
  limit: number
  filter?: string
}

