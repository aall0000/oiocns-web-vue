<template>
  <el-form
    ref="formRef"
    :model="formLabelAlign"
    :rules="rules"
    label-position="right"
    label-width="130px"
    class="publishComp-wrap"
    style="max-width: 500px"
  >
    <el-form-item label="市场名称" prop="marketId">
      <el-select
        v-model="formLabelAlign.marketId"
        filterable
        remote
        reserve-keyword
        placeholder="请设置市场名称"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 100%"
      >
        <el-option
          :value="item.id"
          :label="`${item.name}(${item.code})`"
          v-for="item in marketList"
          :key="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上架应用" name="name">
      <el-input readonly v-model="props.info.name" />
    </el-form-item>
    <el-form-item label="应用类型">
      <el-input readonly v-model="props.info.typeName" />
    </el-form-item>
    <el-form-item label="应用权限" prop="sellAuth">
    <el-radio-group v-model.number="formLabelAlign.sellAuth">
        <el-radio label="所属权" />
        <el-radio label="使用权" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="使用费用" prop="price">
      <el-input v-model.number="formLabelAlign.price" type="number" placeholder="请输入使用费用">
      <template #append>元</template>
    </el-input>
    </el-form-item>
    <el-form-item label="使用周期" prop="days">
      <el-input v-model.number="formLabelAlign.days" type="number" placeholder="请输入使用周期">
      <template #append>天</template>
    </el-input>
    </el-form-item>
    <el-form-item label="应用说明" prop="caption">
      <el-input :rows="3" type="textarea" v-model="formLabelAlign.caption" />
    </el-form-item>

    <el-form-item label="应用信息" prop="information">
      <el-input :rows="3" type="textarea" v-model="formLabelAlign.information" />
    </el-form-item>
  </el-form>
  <div>
    <slot name="btns" />
  </div>
</template>
<script lang="ts" setup>
  import API from '@/services'
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  type PropType = {
    info: ProductType
  }
  const props = defineProps<PropType>()
  const formRef = ref<FormInstance>()
  console.log('props', props)
  const formLabelAlign = reactive({
    caption: '',
    productid: props.info.id,
    price: undefined,
    sellAuth: props.info.authority,
    marketId: undefined,
    information: '',
    days: undefined
  })

  const marketList = ref([])

  const loading = ref(false)

  onMounted(() => {
    // 获取市场列表
    getMarketOptions()
  })
  // 获取市场列表
  const getMarketOptions = async (queryStr?: string) => {
    const { data, success } = await API.market.searchAll({
      data: { offset: 0, limit: 10000, filter: queryStr ?? '' }
    })

    if (success) {
      const { result = [] } = data
      marketList.value = [...result]
      loading.value = false
    }
  }
  // 市场关键字搜索
  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true
      getMarketOptions(query)
    } else {
      marketList.value = []
    }
  }
// 提交上架
  const onPutawaySubmit = () => {
    console.log('putawayFormRef', formRef.value)

    if (!formRef.value) return
    formRef.value.validate(async (valid, fields) => {
      if (valid) {
        console.log('上架submit!', formLabelAlign)
        const { success } = await API.product.publish({
          data: formLabelAlign
        })
        if (success) {
          // getPageList()
          ElMessage({
            type: 'success',
            message: '已提交上架申请'
          })
          resetForm()
        }
      } else {
        console.log('上架error submit!', fields)
      }
    })
  }

const emit = defineEmits(['closeDialog'])
   // 重置注册表单
  const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
    emit('closeDialog')
  }
  const rules = reactive<FormRules>({
    price: [
      { required: true, message: '请输入使用费用', trigger: 'blur' },
    ],
    marketId: [
      {
        required: true,
        message: '请选择需要发布的市场',
        trigger: 'blur'
      }
    ],
    day: [
      {
        required: true,
        message: '请输入使用周期',
        trigger: 'blur'
      }
    ]
  })
  defineExpose({
    onPutawaySubmit
  })
</script>

<style lang="scss" scoped>
  .publishComp-wrap {
  }
</style>
