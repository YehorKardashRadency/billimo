export function getValueEnum(enumObj: any){
  return Object.values(enumObj).filter(x => !isNaN(Number(x)));
}
