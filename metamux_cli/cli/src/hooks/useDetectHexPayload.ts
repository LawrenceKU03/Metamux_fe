

const useDetectHexPayload=(text:string)=>{
  if(text.split(" ").length == 1 && text.length > 50){
    return true;
  }

  return false;
}

export default useDetectHexPayload;
