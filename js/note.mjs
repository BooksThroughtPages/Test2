import Unit from './unit.mjs'
import * as Parser from './parser.mjs'
import * as U from './utilities.mjs'
import * as Templates from './templates.mjs'

export {newNote}

const header = $(Templates.headerTemplate)
$(".uiHeader").append(header)
const notes = []

class Note{
  constructor(data){
    const defaultValues = {
      values:{text:"",price:new Decimal(0),quantity:new Decimal(1),unit:new Unit(1,"szt")}
      ,properties:{isSelected:false}
    }
    this.values = {}
    this.values.text = data?.values?.text ?? defaultValues.values.text
    this.values.price = data?.values?.price ?? defaultValues.values.price
    this.values.quantity = data?.values?.quantity ?? defaultValues.values.quantity
    this.values.unit = data?.values?.unit ?? defaultValues.values.unit
    this.properties = {}
    this.properties.id = U.newId()
    this.properties.isSelected = data?.properties?.isSelected ?? defaultValues.properties.isSelected
    this.node = $(Templates.noteTemplate)
    let fin = v=>$(this.node).find(v)
        ,tmp
    
    $(this.node).find(".priceInput")
      .val(this.values.price.toFixed(2))
      
    $(this.node).find(".quantityInput")
      .val(this.values.quantity.toDecimalPlaces(2))
      
    this.recalculate()
    
    let makePlaceholder = 
        e=>{
          tmp = e.currentTarget.value
          e.currentTarget.value = ""
          e.currentTarget.setAttribute("placeholder", tmp)
        }
        ,restorePlaceholder = (e,nameOfValue,formatting)=>{
          this[nameOfValue] = e.currentTarget.value || tmp
          e.currentTarget.value = this.values[nameOfValue][formatting??"toFixed"](2)
          this.recalculate()
        }
      
    $(this.node).find(".priceInput")
      .on("input", e=>{
        this.price = e.currentTarget.value
        this.recalculate()
    }).on("focus",e=>{
        makePlaceholder (e)
    }).on("blur", e=>{
        restorePlaceholder(e,"price")
    })
     
     $(this.node).find(".quantityInput")
     .on("input", e=>{
       this.quantity = e.currentTarget.value
       this.recalculate()
      }).on("focus",e=>{
       makePlaceholder ( e )
       
     }).on("blur", e=>{
       restorePlaceholder(e, "quantity", "toDecimalPlaces")
     })
     
     
     /*(".noteInputCol")
      .on("input", e=>{
        fin(".noteCol").text(e.currentTarget.value)
      })
     */
     $(this.node).find(".noteInput")
      .on("input", e=>{
        
        let tmp = Parser.parseUnit(e.currentTarget.value)
        //console.log(tmp)
        if(tmp.found){
          this.values.unit = tmp.value
        }else{
          this.values.unit = new Unit(1,"szt")
        }
        this.recalculate(tmp)
        
      })
      .on("focus", e=>{
        //tmp = this.values.unit
      })
      .on("blur", e=>{
        
      })
      
      //let h = new Hammer($(this.node).find(".noteRow").prevObject.get(0))
      /*
      let h = new Hammer.Manager($(this.node).find(".noteContainer").prevObject.get(0),
      {
        recognizers:[
          [Hammer.Pan,{threshold:100}]
        ]
        
      })
      h.on("panstart", e=>{
        tmp = $(this.node).find(".noteRow").prevObject.css("background-color")
      })
      h.on("panleft", e=>{
       
        $(this.node).find(".noteRow").prevObject.css("background-color", "red")
      })
      h.on("panright", e=>{
        $(this.node).find(".noteRow").prevObject.css("background-color", tmp)
      })
      h.on("panend", e=>{
        if($(this.node).find(".noteRow").prevObject.css("background-color") === "rgb(255, 0, 0)"){
          //deleteNote.bind(this)()
        }
        $(this.node).find(".noteRow").prevObject.css("background-color", tmp)
      })
      h.on("swipeleft", e=>{
        console.log("swipeleft")
        $(this.node).find(".noteRow").prevObject.css("background-color", "gray")
      })
      */
   }
   
   
  
  
  set price(x){
    try{
      this.values.price = new Decimal(x)
    }catch{
      if(x === ""){
        this.values.price = new Decimal(0)
      }
    }
    this.recalculate()
  }
  set quantity(x){
    try{
      this.values.quantity = new Decimal(x)
    }catch{
      if(x === ""){
        this.values.quantity = new Decimal(0)
      }
    }
    this.recalculate()
  }
  
  get priceOfAllItems(){
    return this.values.price.mul(this.values.quantity)
  }
  
  recalculate(parseResult){
    
    let budgetSumAll = new Decimal(0)
        ,budgetSumTmp = new Decimal(0)
        ,diff
        ,tmp
        ,quantityAdditional = ""
    console.log(parseResult?.parserResult)
    if(parseResult?.found){
      if(parseResult.parserResult.value[4]
          &&parseResult.parserResult.value[5]
          &&parseResult.parserResult.value[6]
          &&parseResult.parserResult.value[7]){
          let portions = this.values.unit.div(new Unit(parseResult.parserResult.value[6],parseResult.parserResult.value[7]))
          let uUnit = new Unit(parseResult.parserResult.value[4],parseResult.parserResult.value[5])
          let uUnit2 = new Unit(this.values.quantity.mul(portions).mul(uUnit.quantity), uUnit.symbol)
          quantityAdditional += uUnit2.toString()
          quantityAdditional += ` (${this.values.quantity.mul(portions).toFixed(2)}) ${this.values.quantity.toFixed(1)}x${portions.toFixed(1)}x${uUnit.toString()}`
      }
    }
    for(let n of notes){
      budgetSumAll = budgetSumAll.add(n.priceOfAllItems)
    }
    $(header)
      .find(".budgetSumAll")
      .text(U.thousandsSeparator(budgetSumAll?.toFixed(2)??"") + " Zł")
    for(let n of notes){
      if(notes?.properties?.isSelected){
        budgetSumTmp = budgetSumTmp.add(n.priceOfAllItems)
      }
    }
    $(header)
      .find(".budgetSumTmp")
      .text(U.thousandsSeparator(budgetSumTmp?.toFixed(2)??"") + " Zł")
    diff = budgetSumAll?.sub(budgetSumTmp)
    $(header).find(".budgetDiffSumAllSumTmp").css("color", diff.isZero()?"black":diff.isPositive()?"green":"red")
    $(header)
      .find(".budgetDiffSumAllSumTmp")
      .text(U.thousandsSeparator(budgetSumAll?.sub(budgetSumTmp)?.toFixed(2)??"") + " Zł")  
    $(this.node)
      .find(".noteHeaderSumPrice")
      .text(U.thousandsSeparator(this.priceOfAllItems.toFixed(2)) +" Zł")
    $(this.node)
      .find(".noteHeaderUnitPrice")
      .text(U.thousandsSeparator(this.values.price.div(this.values.unit.quantity).toFixed(2).toString()) +`Zł/${this.values.unit.symbol}`)
    $(this.node)
      .find(".noteHeaderSumQuantity")
      .text(U.thousandsSeparator(this.values.quantity.mul(this.values.unit.quantity).toDecimalPlaces(2).toString()) + `${this.values.unit.symbol}`
      + "<br/>"+`${quantityAdditional}`)
  }
  
}


//const header = $(Templates.headerTemplate)
//$("#uiHeader").append(header)

function newNote(){
  notes.push(new Note)
  //notes.unshift(new Note)
  //$("#uiNotesContainer").append($(notes).get(-1).node)
  $(".uiNotesContainer").prepend($(notes).get(-1).node)
  $(notes).get(-1).node.find(".noteInput").trigger("click").trigger("focus")
  updateNoteIndexes()
}

function deleteNote(){
  let x = notes.findIndex(x=>x.properties.id === this.properties.id)
  if(x === -1) return
  
  $("#uiNotesContainer").find(this.node).remove()
  notes.splice(x,1)
  updateNoteIndexes()
}

function updateNoteIndexes(){
  for(const [i,n] of notes.entries()){
    console.log("aa")
    $(n.node).find(".noteHeaderIndex").text(i+1)
  }
}