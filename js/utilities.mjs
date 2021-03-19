export { newId, tryCatchNew, qSameSet, thousandsSeparator }

const generateId = 
(
  function*() {
    let id = 0
    while(true){ yield id++ }
  }
)()

function newId(){
  return generateId.next().value
}

function tryCatchNew  
(  
   constructor
  ,properties
  ,errorProperties
  ,errorCondition
  ,defaultReturnValue
)
{
  try{
    return Reflect.construct(constructor, properties)
  }catch{
    if(errorCondition && errorCondition(errorProperties))
    {
      return Reflect.construct(constructor, errorProperties)
    }else{
      return Reflect.construct(constructor, errorProperties)
    }
  }
  return defaultReturnValue
}

function tryCatch
(
   fn
  ,fnError
)
{
  try{
          return fn()
  }catch{
          return fnError()
  }
}

function clamp(value, lowerLimit, upperLimit){
  let returnValue = value
  let overflow = 0
  if(lowerLimit !== undefined && value<lowerLimit){
    returnValue = lowerLimit
    overflow = lowerLimit - value
  }
  else if(upperLimit !== undefined && value>upperLimit){
    returnValue = upperLimit
    overflow = value - upperLimit
  }
  
  return {value:returnValue,overflow:overflow}
}

function locateSet(value, setOfSets){
  for(let s of setOfSets){
    if(s.has(value)) return s
  }
}

function qSameSet(values, setOfSets){
  if(values === undefined || values.length === 0) return false
  let lastSet = locateSet(values[0], setOfSets)
  for(let v of values){
    if(lastSet === undefined || lastSet !== locateSet(v, setOfSets)) return false
  }
  return true
}

function thousandsSeparator(x){
  if(x === undefined){return}
  let xLen = x.length
  let dotAndIndex = x.lastIndexOf(".")
  let formattedNumber = ""
  if(dotAndIndex > -1){
    formattedNumber += x.slice(dotAndIndex)
  }else{
    dotAndIndex = x.length
  }
  while(true){
    let tmp = clamp(dotAndIndex-3,0)
    dotAndIndex = tmp.value
    if(dotAndIndex === 0){
      formattedNumber = x.slice(dotAndIndex, 3-tmp.overflow) + formattedNumber
      break;
    }else{
      formattedNumber = " "+x.slice(dotAndIndex, dotAndIndex+3) + formattedNumber
    }
  }
  return formattedNumber
}