<template>
  <div>
    <el-form label-position="top" label-width="90px">
      <el-form-item label="⚙ 选择审批对象" prop="text" class="user-type">
        <el-radio-group v-model="nodeProps.assignedType" @change="assignedTypeChange">
          <el-radio v-for="t in approvalTypes" :label="t.type" :key="t.type">{{ t.name }}</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.assignedType === 'USER'">
          <el-button size="small" icon="el-icon-plus" type="primary" @click="selectUser(1)" round>选择人员</el-button>
          <org-items v-model="nodeProps.assignedUser"/>
        </div>
  
        <div v-else-if="nodeProps.assignedType === 'SELF_SELECT'">
          <el-radio-group size="default" v-model="nodeProps.selfSelect.multiple">
            <el-radio-button :label="false">自选一个人</el-radio-button>
            <el-radio-button :label="true">自选多个人</el-radio-button>
          </el-radio-group>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER_TOP'">
          <el-divider/>
          <el-form-item label="审批终点" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leaderTop.endCondition">
              <el-radio label="TOP">直到最上层主管</el-radio>
              <el-radio label="LEAVE">不超过发起人的</el-radio>
            </el-radio-group>
            <div class="approve-end-leave" v-if="nodeProps.leaderTop.endCondition === 'LEAVE'">
              <span>第 </span>
              <el-input-number :min="1" :max="20" :step="1" size="default" v-model="nodeProps.leaderTop.level"/>
              <span> 级主管</span>
            </div>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER'">
          <el-divider/>
          <el-form-item label="指定主管" prop="text">
            <span>发起人的第 </span>
            <el-input-number :min="1" :max="20" :step="1" size="default"
                             v-model="nodeProps.leader.level"></el-input-number>
            <span> 级主管</span>
            <div style="color: #409EFF; font-size: small;">👉 直接主管为 第 1 级主管</div>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'JOB'">
          <el-button size="small" icon="el-icon-plus" type="primary" @click="selectJob(2)" round>选择岗位</el-button>
          <org-items v-model="nodeProps.role"/>
        </div>
        <div v-else-if="nodeProps.assignedType === 'FORM_USER'">
          <el-form-item label="选择表单联系人项" prop="text" class="approve-end">
            <el-select style="width: 80%;" size="small" v-model="nodeProps.formUser" placeholder="请选择包含联系人的表单项">
              <el-option v-for="op in forms" :label="op.title" :value="op.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <span class="item-desc">发起人自己作为审批人进行审批</span>
        </div>
        <div v-if="nodeProps.assignedUser && nodeProps.assignedUser.length>0">已选择：<span v-for="(item, index) in nodeProps.assignedUser" :key="index"><el-tag closable @close="handleClose(index)">{{item.name}}</el-tag></span></div> 
      </el-form-item>

      <!-- <el-divider></el-divider>
      <el-form-item label="👤 审批人为空时" prop="text" class="line-mode">
        <el-radio-group v-model="nodeProps.nobody.handler">
          <el-radio label="TO_PASS">自动通过</el-radio> 
          <el-radio label="TO_REFUSE">自动驳回</el-radio>
          <el-radio label="TO_ADMIN">转交审批管理员</el-radio>
          <el-radio label="TO_USER">转交到指定人员</el-radio>
        </el-radio-group>
        <div style="margin-top: 10px" v-if="nodeProps.nobody.handler === 'TO_USER'">
          <div v-if="nodeProps.friendDialogdefaultUser">已选择：{{nodeProps.friendDialogdefaultUser.name}}</div> 
          <el-button size="small" icon="el-icon-plus" type="primary" @click="selectUser(2)" round>选择人员</el-button>
          <org-items v-model="nodeProps.assignedUser"/>
        </div>
      </el-form-item> -->

      <div>
        <el-divider/>
        <el-form-item label="👩‍👦‍👦 多人审批时审批方式" prop="text" class="approve-mode">
        <el-radio-group v-model="nodeProps.mode">
            <!-- <el-radio label="NEXT">会签 （按选择顺序审批，每个人必须同意）</el-radio> -->
            <el-radio label="AND">会签（可同时审批，每个人必须同意）</el-radio>
            <el-radio label="OR">或签（有一人同意即可）</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- <el-divider>高级设置</el-divider> -->
      <!-- <el-form-item label="✍ 审批同意时是否需要签字" prop="text">
        <el-switch inactive-text="不用" active-text="需要" v-model="nodeProps.sign"></el-switch>
        <el-tooltip class="item" effect="dark" content="如果全局设置了需要签字，则此处不生效" placement="top-start">
          <i class="el-icon-question" style="margin-left: 10px; font-size: default; color: #b0b0b1"></i>
        </el-tooltip>
      </el-form-item> -->
      <!-- <el-form-item label="⏱ 审批期限（为 0 则不生效）" prop="timeLimit">
        <el-input style="width: 180px;" placeholder="时长" size="small" type="number"
                  v-model="nodeProps.timeLimit.timeout.value">
          <el-select style="width: 75px;" v-model="nodeProps.timeLimit.timeout.unit" slot="append" placeholder="请选择">
            <el-option label="天" value="D"></el-option>
            <el-option label="小时" value="H"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="审批期限超时后执行" prop="level" v-if="nodeProps.timeLimit.timeout.value > 0">
        <el-radio-group v-model="nodeProps.timeLimit.handler.type">
          <el-radio label="PASS">自动通过</el-radio>
          <el-radio label="REFUSE">自动驳回</el-radio>
          <el-radio label="NOTIFY">发送提醒</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.timeLimit.handler.type === 'NOTIFY'">
          <div style="color:#409EEF; font-size: small">默认提醒当前审批人</div>
          <el-switch inactive-text="循环" active-text="一次" v-model="nodeProps.timeLimit.handler.notify.once"></el-switch>
          <span style="margin-left: 20px" v-if="!nodeProps.timeLimit.handler.notify.once">
							每隔
							<el-input-number :min="0" :max="10000" :step="1" size="default"
                               v-model="nodeProps.timeLimit.handler.notify.hour"/>
							小时提醒一次
						</span>
        </div>
      </el-form-item> -->
      <el-form-item label="🙅‍ 如果审批被驳回 👇">
        <el-radio-group v-model="nodeProps.refuse.type">
          <el-radio label="TO_END">直接结束流程</el-radio>
          <el-radio label="TO_BEFORE">驳回到上级审批节点</el-radio>
          <el-radio label="TO_NODE">驳回到指定节点</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.refuse.type === 'TO_NODE'">
          <span>指定节点:</span>
          <el-select style="margin-left: 10px; width: 150px;" placeholder="选择跳转步骤" size="small" v-model="nodeProps.refuse.target">
            <el-option v-for="(node, i) in nodeOptions" :key="i" :label="node.name" :value="node.id"  :disabled="node.disabled"></el-option>
          </el-select>
        </div>

      </el-form-item>
    </el-form>
    <!-- <searchFriend  v-if="nodeProps.friendDialogmode"  :selectLimit='0' @closeDialog="closeDialog"  @checksSearch='checksSearch'/> -->
    <!-- <searchIdentity  v-if="identityDialog"  :selectLimit='0' @closeDialog="closeIdentityDialog" :serachType='7' @checksSearch='checksIdentitySearch'/> -->
    <!-- <org-picker :title="pickerTitle" multiple :type="orgPickerType" ref="orgPicker" :selected="orgPickerSelected"
                @ok="selected"/> -->
      <el-dialog  v-model="nodeProps.friendDialogmode"  custom-class="share-dialog" :title="nodeProps.friendDialogmode==1?'选择人员':'选择岗位'" width="1000px" draggable :close-on-click-modal="false">
        <chooseOperator  v-if="nodeProps.friendDialogmode==1" @closeDialog="nodeProps.friendDialogmode = 0"  @submit="checksSearch" :radio="'4'"  :way="[ 
        {
          id: '4',
          label: '按人员'
        }]"></chooseOperator>
        <chooseOperator  v-if="nodeProps.friendDialogmode==2" @closeDialog="nodeProps.friendDialogmode = 0"  @submit="checksSearch" :radio="'3'"  :way="[ 
        {
          id: '3',
          label: '按岗位'
        }]"></chooseOperator>
      </el-dialog>
  </div>
</template>



<script lang="ts">
  import {
    ref,
    toRefs,
    reactive,
    computed,
    onMounted,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance
  } from 'vue';
  // import searchFriend from '@/components/searchs/index.vue'
  import chooseOperator from '@/views/Market/components/chooseOperator.vue'
import { relative } from 'path/posix';
import { title } from 'process';
  // import OrgPicker from "@/components/common/OrgPicker";
  // import OrgItems from "../OrgItems";
  export default defineComponent({
    name: 'ApprovalNodeConfig',
    components: {chooseOperator},
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    setup(props, { emit }) {
      const { appContext  } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({
        showOrgSelect: false,
        orgPickerSelected: [],
        orgPickerType: 'user',
        approvalTypes: [
          {name: '人员', type: 'USER'},
          // {name: '发起人自选', type: 'SELF_SELECT'},
          // {name: '连续多级主管', type: 'LEADER_TOP'},
          // {name: '主管', type: 'LEADER'},
          {name: '岗位', type: 'JOB'},
          // {name: '发起人自己', type: 'SELF'},
          // {name: '表单内联系人', type: 'FORM_USER'}
        ]
      });
      //
      const nodeProps = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.selectedNode.props
      });
      const select = computed(() => {
        return props.config.assignedUser || []
      });
      const forms = computed(() => {
        return proxy.$pinia.state.value.appwfConfig.design.formItems.filter((f: any) => {
          return f.name === 'UserPicker'
        })
      });
      const pickerTitle = computed(() => {
        switch (state.orgPickerType) {
          case 'user':
            return '请选择人员';
          case 'role':
            return '请选择系统角色';
          default:
            return null;
        }
      });
      const nodeOptions = computed(() => {
        let values: any[] = []
        const excType = [ 'EMPTY', "CONDITION", "CONDITIONS", "CONCURRENT", "CONCURRENTS"]
        var disabled = false;
        proxy.$pinia.state.value.appwfConfig.nodeMap.forEach((v: any) => {
          if (excType.indexOf(v.type) === -1) {
            disabled = proxy.$pinia.state.value.appwfConfig.selectedNode.id == v.id || disabled
            values.push({id: v.id, name: v.name,disabled:disabled})
          }
        })
        return values
      });
      const showMode = computed(() => {
        switch (nodeProps.assignedType) {
          case "USER":
            return nodeProps.assignedUser.length > 0;
          case "SELF_SELECT":
            return nodeProps.selfSelect.multiple;
          case "LEADER_TOP":
            return nodeProps.formUser !== '';
          case "FORM_USER":
            return true;
          case "ROLE":
            return true;
          default:
            return false;
        }
      });
      //
      // const orgPicker = ref();
      //
      const selectUser = (value) => {
        
        state.orgPickerSelected = select
        state.orgPickerType = 'user'
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogmode = value;
        // orgPicker.value.show()
      };
      const selectJob = (value) => {
        
        state.orgPickerSelected = select
        state.orgPickerType = 'job'
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogmode = value;
        // orgPicker.value.show()
      };
      const handleClose = (index) => {
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.splice(index,1)
      };
      const selectNoSetUser = () => {
        state.orgPickerSelected = props.config.nobody.assignedUser
        state.orgPickerType = 'user'
        // orgPicker.value.show()
      };
      const selectRole = () => {
        state.orgPickerSelected = select
        state.orgPickerType = 'role'
        identityDialog.value = true;
        // orgPicker.value.show()
      };
      const selected = (select: any) => {
        console.log(select)
        state.orgPickerSelected.length = 0
        select.forEach((val: any) => orgPickerSelected.push(val))
      };
      const removeOrgItem = (index: number) => {
        select.splice(index, 1)
      };
      const assignedTypeChange = () => {
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser = []
      };
      const checksSearch = (val:any)=>{
        
        switch(proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogmode){
          case 1:
          case 2:
            if(!proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser || proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.length==0){
              proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser = []
            }
            for(let item of JSON.parse(JSON.stringify(val))){
              proxy.$pinia.state.value.appwfConfig.selectedNode.props.assignedUser.push(item) 
            }
            break;
        }
        console.log(proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogdefaultUser)
        closeDialog();
      };
      const checksIdentitySearch= (val:any)=>{
        closeIdentityDialog();
      };
      // const friendDialog = reactive({mode:0,defaultUser:null,assigned:null});

      const identityDialog = ref<boolean>(false);
      const closeDialog = ()=>{
        proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogmode = 0;
      }
      const closeIdentityDialog = ()=>{
        identityDialog.value = false;
      }
      // 页面加载时
      onMounted(() => {
      });
      return {
        proxy,
        ...toRefs(state),
        //
        nodeProps,
        select,
        forms,
        pickerTitle,
        nodeOptions,
        showMode,
        identityDialog,
        //
        // orgPicker,
        //
        handleClose,
        assignedTypeChange,
        selectUser,
        selectJob,
        selectNoSetUser,
        selectRole,
        selected,
        removeOrgItem,
        closeDialog,
        checksSearch,
        closeIdentityDialog,
        checksIdentitySearch
      };
    },
  });
</script>

<!-- <script>
import OrgPicker from "@/components/common/OrgPicker";
import OrgItems from "../OrgItems";

export default {
  name: "ApprovalNodeConfig",
  components: {OrgPicker, OrgItems},
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showOrgSelect: false,
      orgPickerSelected: [],
      orgPickerType: 'user',
      approvalTypes: [
        {name: '指定人员', type: 'USER'},
        {name: '发起人自选', type: 'SELF_SELECT'},
        {name: '连续多级主管', type: 'LEADER_TOP'},
        {name: '主管', type: 'LEADER'},
        {name: '角色', type: 'ROLE'},
        {name: '发起人自己', type: 'SELF'},
        {name: '表单内联系人', type: 'FORM_USER'}
      ]
    }
  },
  computed: {
    nodeProps() {
      return this.$store.state.selectedNode.props
    },
    select() {
      return this.config.assignedUser || []
    },
    forms() {
      return this.$store.state.design.formItems.filter(f => {
        return f.name === 'UserPicker'
      })
    },
    pickerTitle() {
      switch (this.orgPickerType) {
        case 'user':
          return '请选择人员';
        case 'role':
          return '请选择系统角色';
        default:
          return null;
      }
    },
    nodeOptions() {
      let values = []
      const excType = ['ROOT', 'EMPTY', "CONDITION", "CONDITIONS", "CONCURRENT", "CONCURRENTS"]
      this.$store.state.nodeMap.forEach((v) => {
        if (excType.indexOf(v.type) === -1) {
          values.push({id: v.id, name: v.name})
        }
      })
      return values
    },
    showMode() {
      switch (this.nodeProps.assignedType) {
        case "USER":
          return this.nodeProps.assignedUser.length > 0;
        case "SELF_SELECT":
          return this.nodeProps.selfSelect.multiple;
        case "LEADER_TOP":
          return this.nodeProps.formUser !== '';
        case "FORM_USER":
          return true;
        case "ROLE":
          return true;
        default:
          return false;
      }
    }
  },
  methods: {
    selectUser() {
      this.orgPickerSelected = this.select
      this.orgPickerType = 'user'
      this.$refs.orgPicker.show()
    },
    selectNoSetUser() {
      this.orgPickerSelected = this.config.nobody.assignedUser
      this.orgPickerType = 'user'
      this.$refs.orgPicker.show()
    },
    selectRole() {
      this.orgPickerSelected = this.select
      this.orgPickerType = 'role'
      this.$refs.orgPicker.show()
    },
    selected(select) {
      console.log(select)
      this.orgPickerSelected.length = 0
      select.forEach(val => this.orgPickerSelected.push(val))
    },
    removeOrgItem(index) {
      this.select.splice(index, 1)
    }
  }
}
</script> -->

<style lang="scss" scoped>
.user-type {
  .el-radio {
    width: 110px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.line-mode {
  .el-radio {
    width: 150px;
    margin: 5px;
  }
}

.el-form-item__label {
  line-height: 25px;
}

.approve-mode {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 15px;
  }
}

.approve-end {
  position: relative;

  .el-radio-group {
    width: 160px;
  }

  .el-radio {
    margin-bottom: 5px;
    width: 100%;
  }

  .approve-end-leave {
    position: absolute;
    bottom: -5px;
    left: 150px;
  }
}

.el-divider--horizontal {
  margin: 10px 0;
}
</style>
