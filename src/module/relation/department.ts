import API from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus';

// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

class DepartmentServices {
  /**
   * @description: 页码
   */  
  public pageStore = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  }

  /**
   * @description: 更新单位or部门or工作组
   * @return {*}
   */
  // 

  public upDateDempartment = async (params: paramsDataType) => {
    let url = null;
    if (params.typeName == '单位') {
      url = 'update'
    } else if (params.typeName == '部门') {
      url = 'updateDepartment'
    } else if (params.typeName == '工作组') {
      url = 'updateJob'
    }
    const { data, success } = await API.company[url]({
      data: params
    })
    if (success) {
      return data;
    }
  }

  /**
   * @description: 获取人员列表
   * @param {paramsDataType} params
   * @return {*}
   */  

  public getUser = async (params: paramsDataType) => {
    let url = '';
    if (params.typeName == '单位') {
      url = 'getPersons'
    } else if (params.typeName == '部门') {
      url = 'getDepartmentPersons'
    } else if (params.typeName == '工作组') {
      url = 'getJobPersons'
    }
    const {data,success} = await API.company[url]({
      data: {
        id: params.id,
        offset: (this.pageStore.currentPage - 1) * this.pageStore.pageSize,
        limit: this.pageStore.pageSize
      } 
    })
    if (success) {
      let backData = {
        result:data.result,
        total: data.total,
      }
      return backData
    }
  }

  /**
   * @description: 拉人进单位
   * @param {paramsDataType} id
   * @param {Array} Arr
   * @return {*}
   */  

  public pullPerson = async (id:paramsDataType,Arr:Array<paramsDataType>) =>{
    const {data,success} = await API.company.pullPerson({
      data: {
        id: id,
        targetIds: Arr
      }
    })
    if (success) {
      return data
    }
  }
  /**
   * @description: 移除人员
   * @param {paramsDataType} row
   * @param {string} id
   * @return {*}
   */  
  public removePerson =async (row:paramsDataType,id:string) => {
    let url: string;
    let title: string;
    if (row.typeName == '单位') {
      url = 'removeFromCompany'
      title = `操作离职，将删除 ${row.name} 在单位的信息，确定操作吗？`
    } else if (row.typeName == '部门') {
      url = 'removeFromDepartment'
      title = `确定把 ${row.name} 从当前部门移除吗？`
    } else if (row.typeName == '工作组') {
      url = 'removeFromJob'
      title = `确定把 ${row.name} 从当前部门移除吗？`
    }
    const data =  await ElMessageBox.confirm(
      title,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ) .catch((action:any) => {
      console.log(action)
    })
    if(data =='confirm'){
      const msg =await API.company[url]({
        data: {
          id: id,
          targetIds: [row.id]
        }
      })
      if(data){
        return msg
      }
    }
  }
  /**
   * @description: 分配部门
   * @param {paramsDataType} id
   * @param {Array} Arr
   * @return {*}
   */  
   public assignDepartment = async(id:string,targetIds:string[]) =>{
    const {data,success} = await API.company.assignDepartment({
      data: {
        id: id,
        targetIds: targetIds
      }
    })
    if (success) {
      return data
    }
  }
  /**
   * @description: 分配工作组
   * @param {paramsDataType} id
   * @param {Array} Arr
   * @return {*}
   */  
   public assignJob = async(id:string,targetIds:string[]) =>{
    const {data,success} = await API.company.assignJob({
      data: {
        id: id,
        targetIds: targetIds
      }
    })
    if (success) {
      return data
    }
  }
}
export default DepartmentServices
