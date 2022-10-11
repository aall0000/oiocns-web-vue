<template>
	<div class="container">
		<el-dialog fullscreen v-model="isShowDialog" append-to-body :close-on-click-modal="false" width="1080px"
			:show-close="false">
			<template #title>
				<LayoutHeader v-model="activeSelect" @activeChange="activeChange" @exit="exit" @preview="preview"
					@publish="publish"></LayoutHeader>
			</template>
			<div class="layout-body">
				<!-- <FormBaseSetting ref="baseSetting" v-show="activeSelect === 'baseSetting'" /> -->
      			<!-- <FormDesign ref="formSetting" v-show="activeSelect === 'formSetting'"/> -->
				<FormProcessDesign ref="processDesign" v-show="activeSelect === 'processDesign'" />
      			<!-- <FormProSetting ref="proSetting" v-show="activeSelect === 'proSetting'"/> -->
			</div>
			<!-- <w-dialog :showFooter="false" v-model="validVisible" title="设置项检查">
				<el-steps align-center :active="validStep" finish-status="success">
					<el-step v-for="(step, i) in validOptions" :title="step.title" :key="i"
							:icon="step.icon" :status="step.status" :description="step.description"/>
				</el-steps>
				<el-result :icon="validIcon" :title="errTitle" :subTitle="validResult.desc">
					<i slot="icon" style="font-size: 30px" v-if="!validResult.finished" class="el-icon-loading"></i>
					<div slot="subTitle" class="err-info" v-if="validResult.errs.length > 0">
					<ellipsis hover-tip v-for="(err, i) in validResult.errs" :key="i + '_err'" :content="err">
						<i slot="pre" class="el-icon-warning-outline"></i>
					</ellipsis>
					</div>
					<template slot="extra">
					<el-button type="primary" v-if="validResult.finished" size="default" @click="doAfter">
						{{ validResult.action }}
					</el-button>
					</template>
				</el-result>
			</w-dialog> -->
		</el-dialog>
		<LayoutPreview ref="LayoutPreviewRef" />
	</div>
</template>

<script lang="ts">
	import {
		ref,
		defineComponent,
		getCurrentInstance,
		ComponentInternalInstance,
		reactive,
		toRefs,
		computed,
	} from 'vue';

	import LayoutHeader from './layout/LayoutHeader.vue';
	// import FormBaseSetting from './layout/FormBaseSetting.vue'
	// import FormDesign from './layout/FormDesign.vue'
	import FormProcessDesign from './layout/FormProcessDesign.vue'
	// import FormProSetting from './layout/FormProcessDesign.vue'
	import LayoutPreview from './layout/LayoutPreview.vue';

	import { useAppwfConfig } from '@/store/goWorkflow';

	export default defineComponent({
		name: 'ProcessDesign',
		components: {
			LayoutHeader,
			// FormBaseSetting,
			// FormDesign,
			FormProcessDesign,
			// FormProSetting,
			LayoutPreview,
		},
		setup(props, {
			emit
		}) {
			const {
				appContext
			} = getCurrentInstance() as ComponentInternalInstance;

			const proxy = appContext.config.globalProperties;

			const stores = useAppwfConfig(proxy.$pinia);

			const LayoutPreviewRef = ref();

			//整个流程设计
			const design = computed(() => {
				return proxy.$pinia.state.value.appwfConfig.design;
			});

			// const errTitle = computed(() => {
			// 	if (state.validResult.finished && !state.validResult.success){
			// 		return state.validResult.title + ` (${state.validResult.errs.length}项错误) 😥`
			// 	}
			// 	return state.validResult.title
			// });
			// const validIcon = computed(() => {
			// 	if (!state.validResult.finished) {
			// 		return 'el-icon-loading'
			// 	} else if (state.validResult.success) {
			// 		return 'success'
			// 	} else {
			// 		return 'warning'
			// 	}
			// });

			const state = reactive({
				isShowDialog: false,
				isNew: true,
      			timer: null,
				activeSelect: 'processDesign',
      			validStep: 0,
				validVisible: false,
				validResult: {},
				validOptions: [
					{title: '基础信息', description: '', icon: '', status: ''},
					{title: '审批表单', description: '', icon: '', status: ''},
					{title: '审批流程', description: '', icon: '', status: ''},
					{title: '扩展设置', description: '', icon: '', status: ''}
				],
				validComponents: ['baseSetting', 'formSetting', 'processDesign', 'proSetting'],

				tempDesign: {}

			});

			// 打开弹窗
			const openDialog = (id: String) => {
				if (id) {
					state.isShowDialog = true;
					//调取后端接口获取disign
					state.tempDesign = {};
					stores.setDesign(state.tempDesign);
					console.log("design",proxy.$pinia.state.value.appwfConfig.design);
				} else {
					state.isShowDialog = true;
					state.tempDesign = {
						formId: null,
						formName: "新增表单",
						logo: {
							icon: "el-icon-eleme",
							background: "#1e90ff"
						},
						settings: {
							commiter: [],
							admin: [],
							sign: false,
							notify: {
								types: ["APP"],
								title: "消息通知标题"
							}
						},
						groupId: undefined,
						formItems: [],
						process: {
							id: "root",
							parentId: null,
							type: "ROOT",
							name: "发起人",
							desc: "任何人",
							props: {
								assignedUser: [],
								formPerms: []
							},
							children: {}
						},
						remark: "备注说明"
					}
					stores.setDesign(state.tempDesign);
					console.log("design",proxy.$pinia.state.value.appwfConfig.design);
				}
			};
			// 关闭弹窗
			const closeDialog = () => {
				state.isShowDialog = false;
			};
			// 取消
			const onCancel = () => {
				closeDialog();
			};
			const activeChange = (path: any) => {
				console.log("activeChange", path);
				state.activeSelect = path;
			};
			// 退出
			const exit = () => {
				closeDialog();
			};
			// 预览
			const preview = () => {
				console.log("preview",design.value);
				LayoutPreviewRef.value.openDialog(design.value);
			};
			// 发布
			const publish = () => {
				console.log("publish");
				closeDialog();
				// this.$confirm('如果您只想预览请选择预览，确认发布后流程立即生效，是否继续?', '提示', {
				// 	confirmButtonText: '发布',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	console.log(this.setup)
				// 	let template = {
				// 	formId: this.setup.formId,
				// 	formName: this.setup.formName,
				// 	logo: JSON.stringify(this.setup.logo),
				// 	settings: JSON.stringify(this.setup.settings),
				// 	groupId: this.setup.groupId,
				// 	formItems: JSON.stringify(this.setup.formItems),
				// 	process: JSON.stringify(this.setup.process),
				// 	remark: this.setup.remark
				// 	}
				// 	if (this.isNew || !this.$isNotEmpty(this.setup.formId)) {
				// 	createForm(template).then(rsp => {
				// 		this.$message.success("创建表单成功")
				// 		this.$router.push("/formsPanel")
				// 	}).catch(err => {
				// 		this.$message.error(err)
				// 	})
				// 	} else {
				// 	updateFormDetail(template).then(rsp => {
				// 		this.$message.success("更新表单成功")
				// 		this.$router.push("/formsPanel")
				// 	}).catch(err => {
				// 		this.$message.error(err)
				// 	})
				// 	}
				// })
			};

			// const validateDesign = () => {
			// 	state.validVisible = true;
			// 	state.validStep = 0;
			// 	showValiding();
			// 	stopTimer();
			// 	state.timer = setInterval(() => {
			// 		state.validResult.errs = ctx.refs[state.validComponents[state.validStep]].validate()
			// 		if (Array.isArray(state.validResult.errs) && state.validResult.errs.length === 0) {
			// 			state.validStep++;
			// 			if (state.validStep >= state.validOptions.length) {
			// 				stopTimer()
			// 				showValidFinish(true, null)
			// 			}
			// 		} else {
			// 		stopTimer()
			// 			state.validOptions[state.validStep].status = 'error'
			// 			showValidFinish(false, getDefaultValidErr())
			// 		}
			// 	}, 300)
			// };
			// const getDefaultValidErr = () => {
			// 	switch (state.validStep) {
			// 		case 0:
			// 		return '请检查基础设置项';
			// 		case 1:
			// 		return '请检查审批表单相关设置'
			// 		case 2:
			// 		return '请检查审批流程，查看对应标注节点错误信息'
			// 		case 3:
			// 		return '请检查扩展设置'
			// 		default:
			// 		return '未知错误'
			// 	}
			// };
			// const showValidFinish  = (success:any, err:any) => {
			// 	state.validResult.success = success
			// 	state.validResult.finished = true
			// 	state.validResult.title = success ? '校验完成 😀' : '校验失败 '
			// 	state.validResult.desc = success ? '设置项校验成功，是否提交？' : err
			// 	state.validResult.action = success ? '提 交' : '去修改'
			// };
			// const showValiding = () => {
			// 	state.validResult = {
			// 		errs: [],
			// 		finished: false,
			// 		success: false,
			// 		title: '检查中...',
			// 		action: '处理',
			// 		desc: '正在检查设置项'
			// 	}
			// 	state.validStep = 0
			// 	state.validOptions.forEach(op => {
			// 		op.status = ''
			// 		op.icon = ''
			// 		op.description = ''
			// 	})
			// };
			// const doAfter= () => {
			// 	if (state.validResult.success) {
			// 		publish()
			// 	} else {
			// 		state.activeSelect = state.validComponents[state.validStep]
			// 		state.validVisible = false
			// 	}
			// };
			// const stopTimer= () => {
			// 	if (state.timer) {
			// 		clearInterval(state.timer)
			// 	}
			// };
			
			return {
				LayoutPreviewRef,
				design,
				// errTitle,
				// validIcon,
				openDialog,
				closeDialog,
				onCancel,
				activeChange,
				exit,
				preview,
				publish,
				// validateDesign,
				// getDefaultValidErr,
				// showValidFinish,
				// showValiding,
				// doAfter,
				// stopTimer,
				...toRefs(state),

			};
		},
	});
</script>

<style lang="scss" scoped>

	
	.layout-body {
		background: #f5f6f6;
		padding: 0px;
		height: 800px;
	}

	.el-dialog__header {
		margin-right: 0px;
	}
</style>