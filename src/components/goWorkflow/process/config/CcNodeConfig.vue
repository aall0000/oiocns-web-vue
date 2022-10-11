<template>
  <div>
    <el-button size="small" icon="el-icon-plus" type="primary" @click="friendDialogmode = 1" round>选择抄送人</el-button>
    <!-- <div class="option">
      <el-checkbox label="允许发起人添加抄送人" v-model="config.shouldAdd"></el-checkbox>
    </div> -->
    <org-items v-model="select"/>
    <!-- <org-picker multiple ref="orgPicker" :selected="select" @ok="selected"/> -->
    <el-dialog  v-model="friendDialogmode"  custom-class="share-dialog" :title="friendDialogmode==1?'选择人员':'选择岗位'" width="1000px" draggable :close-on-click-modal="false">
        <chooseOperator  v-if="friendDialogmode==1" @closeDialog="friendDialogmode = 0"  @submit="checksSearch" :radio="'4'"  :way="[ 
        {
          id: '4',
          label: '按人员'
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
  // import OrgPicker from "@/components/common/OrgPicker";
  // import OrgItems from "../OrgItems";
  import chooseOperator from '@/views/Market/components/chooseOperator.vue'
  export default defineComponent({
    name: 'CcNodeConfig',
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
      // const orgPicker = ref();
      //
      const state = reactive({});
      //
      const select = computed({
        get() {
          return props.config.assignedUser || []
        },
        set(val) {
          props.config.assignedUser = val
        }
      });
      //
      const selectOrg = () => {
        // orgPicker.value.show()
      };
      const selected = (select: any) => {
        console.log(select)
        select = Object.assign([], select)
      };
      const removeOrgItem = (index: number) => {
        select.splice(index, 1)
      }
      const friendDialogmode = ref(0)
      const checksSearch = ()=>{
        // proxy.$pinia.state.value.appwfConfig.selectedNode.props
        // switch(friendDialogmode.value){
        //   case 1:
        //   case 2:
        //     if(!proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogassigned || proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogassigned.length==0){
        //       proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogassigned = []
        //     }
        //     for(let item of JSON.parse(JSON.stringify(val))){
        //       proxy.$pinia.state.value.appwfConfig.selectedNode.props.friendDialogassigned.push(item) 
        //     }
        //     break;
        // }
        closeDialog();
      };
      const closeDialog = ()=>{
        friendDialogmode.value = 0;
      }
      // 页面加载时
      onMounted(() => {
      });
      return {
        proxy,
        ...toRefs(state),
        //
        // orgPicker,
        //
        select,
        friendDialogmode,
        checksSearch,
        selectOrg,
        selected,
        removeOrgItem,
      };
    },
  });
</script>

<!-- <script>
import OrgPicker from "@/components/common/OrgPicker";
import OrgItems from "../OrgItems";

export default {
  name: "CcNodeConfig.vue",
  components: {OrgPicker, OrgItems},
  props:{
    config:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  computed:{
    select: {
      get(){
        return this.config.assignedUser || []
      },
      set(val){
        this.config.assignedUser = val
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    selectOrg() {
      this.$refs.orgPicker.show()
    },
    selected(select) {
      console.log(select)
      this.select = Object.assign([], select)
    },
    removeOrgItem(index){
      this.select.splice(index, 1)
    }
  }
}
</script> -->

<style lang="scss" scoped>
.option{
  color: #606266;
  margin-top: 20px;
  font-size: small;
}

.desc{
  font-size: small;
  color: #8c8c8c;
}
.org-item{
  margin: 5px;
}
</style>
