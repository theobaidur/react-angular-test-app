export function shallowIndexOf(arr: any[], value: any){
    if(!arr || !arr.length || !value) return -1;
    for(var k=0;k<arr.length;k++){ 
        if( (!arr[k][0] && arr[k] === value) || ( arr[k][0] && value[0] && arr[k][0] === value[0] ) ) return k;
    }
    return -1;
}