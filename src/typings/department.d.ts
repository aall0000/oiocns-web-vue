interface paramsDataType{
    typeName?:string,
    id?:string,
    name?:string,
    data?:{
        typeName:string
    }
}
interface pageStoreType {
    offset: number
    limit: number
    filter?: string
}