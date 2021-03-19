import * as U from './utilities.mjs'



const unitSymbols    = new Set([new Set(["szt"]),new Set(["mg","g","kg"]),new Set(["ml","l"])])
const unitMagnitudes = new Map([["mg",new Decimal("0.001")],["g",new Decimal(1)],["kg",new Decimal(1000)],["ml",new Decimal("0.001")],["l",new Decimal(1)]])



class Unit{
  constructor(quantity, symbol){
    this.symbol = symbol
    this.quantity = new Decimal(quantity)
  }
  set unitQuantity(x){
    try{
      this.quantity = new Decimal(x)
    }catch{
      this.quantity = new Decimal(0)
    }
  }
  forming(unitSymbol){
    if(U.qSameSet([this.symbol, unitSymbol], unitSymbols)){
      return {quantity:this.quantity.mul(unitMagnitudes.get(this.symbol).div(unitMagnitudes.get(unitSymbol))), symbol:unitSymbol}
    }
  }
  returnInFormOf(unitSymbol){
    let tmp = this.forming(unitSymbol)
    if(tmp === undefined) return
    return new Unit(tmp.quantity, tmp.symbol)
  }
  formSelfInto(unitSymbol){
    let tmp = this.forming(unitSymbol)
    if(tmp !== undefined){
      this.quantity = tmp.quantity
      this.symbol = tmp.symbol
    }//else{return false}
    return this
  }
  div(a){
    if(a.formSelfInto(this.symbol)){
      return this.quantity.div(a.quantity)
    }
    //return false
  }
  toString(){
    return `${this.quantity.toFixed(2).toString()}${this.symbol}`
  }
}

export default Unit