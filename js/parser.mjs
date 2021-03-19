export { parseUnit }

import Unit from './unit.mjs'

function parseUnit(inputText){
  inputText = inputText.trim()
  //let regex = /(\d*[\.\,]?\d+)([^\s0-9\,\.]{1,3})/gm
  //let regex1 = /(\d*[\.\,]?\d+)([^\s0-9\,\.\:\\\/]{1,3}):?(\d*[\.\,]?\d+)?([^\s0-9\,\.\:\\\/]{1,3})?\/?(\d*[\.\,]?\d+)?([^\s0-9\,\.\:\\]{1,3})?/gm
  let regex = /(\d*[\.\,]?\d+)([^\s0-9\,\.\:\\\/]{1,3})\,?([^\s0-9\,\.\:\\\/]{1,3})?:?(\d*[\.\,]?\d+)?([^\s0-9\,\.\:\\\/]{1,3})?\/?(\d*[\.\,]?\d+)?([^\s0-9\,\.\:\\]{1,3})?/gm
  let match = inputText.matchAll(regex).next()
  let returnValue = {value:undefined,found:false,parserResult:match}
  //console.log(match)
  if(match.value !== undefined){
    returnValue.value = new Unit(match.value[1], match.value[2]).formSelfInto(match.value[3])
    returnValue.found = true
  }
  return returnValue
}