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

enum TargetType {
  Person = "人员",
  Company = "单位",
  Group = "集团",
  SubGroup = "子集团",
  Department = "部门",
  Job = "工作组",
  Cohort = "群组"
}

enum MessageType {
  Text = "文本",
  Image = "图片",
  Video = "视频",
  Voice = "语音",
  Recall = "撤回"
}