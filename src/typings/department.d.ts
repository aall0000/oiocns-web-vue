interface paramsDataType{
    typeName?:string,
    id?:string,
    name?:string,
}
interface pageStoreType {
    offset: number
    limit: number
    filter?: string
}