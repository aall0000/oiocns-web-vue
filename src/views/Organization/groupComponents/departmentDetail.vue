<template>
  <div class="department-info">
    <div class="deptment-info">
      <p class="deptment-info-name">
        <!-- <span>{{ treeObj.name }}</span> -->
        <!-- <span class="info-num">20人</span> -->
        <!-- <el-button size="small" style="margin-left: 15px">编辑</el-button> -->
      </p>

      <div class="deptment-info-btns">
        <div class="left-name">
          <el-icon :size="20">
            <Connection />
            <img
              class="group-icon"
              style="width: 20px"
              src="@/assets/img/group-next.png"
              alt=""
            /> </el-icon
          >下级部门
        </div>
        <div class="edit">
          <!-- <el-button type="primary">创建工作组</el-button> -->
          <el-button type="primary" @click="dialogVisible = true">创建子部门</el-button>
          <!-- <el-button>调整排序</el-button> -->
        </div>
      </div>
    </div>
    <div class="tab-list" v-if="DepartmentsList.list.length>0">
      <ul class="next-dept">
        <!-- 头部 -->
        <el-row class="next-dept-con header">
          <el-col :span="4">
            <div class="con">部门名称</div>
          </el-col>
          <!-- <el-col :span="4">
            <div class="con">成员人数</div>
          </el-col> -->
        </el-row>
        <!-- 内容 -->
        <el-row class="next-dept-con body" v-for="(item,index) in DepartmentsList.list" :key="index">
          <el-col :span="4">
            <div class="con">{{item.name}}</div>
          </el-col>
          <!-- <el-col :span="4">
            <div class="con">20</div>
          </el-col> -->
        </el-row>
      </ul>
    </div>

    <el-dialog v-model="dialogVisible" title="请输入部门名称" width="30%">
      <el-form-item label="部门名称">
        <el-input v-model="departmentName" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="departmentTeamCode" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="部门简介">
        <el-input v-model="departmentTeamRemark" placeholder="Please input" clearable />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFriends">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted, watch } from 'vue'
  type selectItem = {
    name: string
    id: string
  }
  const props = defineProps<{
    selectItem: selectItem
  }>()
  let dialogVisible = ref<boolean>(false)
  let selectId = ref<string>()
  let departmentName = ref<string>('')
  let departmentTeamCode = ref<string>('')
  let departmentTeamRemark = ref<string>('')
  const submitFriends = () => {
    $services.company
      .createDepartment({
        data: {
          id: selectId.value,
          name: departmentName.value,
          parentId: props.selectItem.id,
          code: departmentTeamCode.value,
          teamRemark: departmentTeamRemark.value
        }
      })
      .then((res: ResultType) => {
        dialogVisible.value = false
        
      })
  }
  watch(
    () => props.selectItem,
    (newValue: selectItem) => {
      if (newValue.id !== '') {
        getDepartmentsList(newValue.id)
      }
    },
  )
  type listItem  = {
    id: string
    name: string
  }
  type DlistType = {
    list:Array<listItem>
  }
  let DepartmentsList = reactive<DlistType>({list:[]})
  const getDepartmentsList = (id: string) => {
    let arr: any = []
    $services.company
      .getDepartments({
        data: { id: id, offset: 0, limit: 100 }
      })
      .then((res: ResultType) => {
        if (res.data.result) {
          let resData = res.data.result

          resData.forEach((element: any) => {
            var obj = {
              id: element.id,
              name: element.name
            }
            arr.push(obj)
          })
        }
        DepartmentsList.list = arr 
      })
  }
</script>

<style lang="scss" scoped>
  .deptment-info {
    background: #fff;
    padding: 20px;
    .deptment-info-name {
      font-size: 18px;
      font-weight: bold;
      .info-num {
        font-size: 14px;
        font-weight: normal;
        padding: 0 10px;
      }
    }
    .deptment-info-btns {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      .left-name {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
      }
      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .next-dept-con {
    width: 100%;
    padding: 0 40px;
    background-color: #fff;

    &.header {
      background-color: #f3f3f3;
      border-bottom: 1px solid #ccc;
      height: 40px;
      line-height: 40px;
    }

    &.body {
      border-bottom: 1px solid #ccc;
    }

    .con {
      text-align: left;
      width: 120px;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
