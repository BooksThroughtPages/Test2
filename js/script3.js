'use strict';

const generateId = 
(
  function*() {
    let id = 0
    while(true){ yield id++ }
  }
)()

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

class Note
{
  constructor (  properties
                ,selfRemoveCallbackFn
              )
  {
    const  noteDefaultPrice             = 0
          ,noteDefaultQuantity          = 1
          ,noteDefaultQuantityOfUnitItem
                                        = 1
          ,noteDefaultUnitQuantityType  = "szt"
          ,noteDefaultText              = ""
          ,inputDefaultFontSize         = "calc(1.1rem + 3vw)"
  
    this.removeNote       = selfRemoveCallbackFn
    this.values           = {}
    this.properties       = {}
    this.values.text      = properties?.values?.text ?? noteDefaultText
    this.properties.isSelected 
                          = false
    this.values.unitQuantityType 
                          = properties?.values?.unitQuantityType ?? noteDefaultUnitQuantityType
    this.values.price     = tryCatchNew (  Decimal
                                          ,[properties?.values?.price ?? noteDefaultPrice]
                                          ,[noteDefaultPrice]
                                        )
    this.values.quantity  = tryCatchNew (  Decimal
                                          ,[properties?.values?.quantity ?? noteDefaultQuantity]
                                          ,[noteDefaultQuantity]
                                        )
    this.values.quantity  = tryCatchNew (  Decimal
                                          ,[properties?.values?.quantity ?? noteDefaultQuantity]
                                          ,[noteDefaultQuantity] 
                                        )
                                      
    this.values.quantityOfUnitItem  
                          = tryCatchNew (  Decimal
                                          ,[properties?.values?.quantityOfUnitItem ?? noteDefaultQuantityOfUnitItem]
                                          ,[noteDefaultQuantityOfUnitItem]
                                        )
    
    
    
    this.properties.id = generateId.next().value
    let template       = `
				<div class="row noteHeader">
				  <div class="col-2"></div>
					<div class="col-5" style="text-align:right;">
					 <span class="unitPriceValue"></span> Zł za <span class="unitType"></span>
					</div>
					<div class="col-5" style="text-align:right;">
					 <span class="priceOfAllItemsContainer priceUnitNode"><span class="priceTotal priceOfAllItems"></span> Zł</span>
					</div>
				</div>
				<div class="row noteFooter">
					<div class="col-6 noteFont noteContainer" contentEditable="true">Mleko</div>
					<div class="col p-0" style="background-color:gray;display:flex;flex-direction:column;justify-content:center;"><input style="" class="priceInput form-control p-0" type="number" value="${this.values.price.toFixed(2)}"/></div>
					<div class="col p-0" style="display:flex;flex-direction:column;justify-content:center;"><input class="quantityInput form-control p-0" type="number" value="${this.quantityOfItemFormated}"/></div>
				</div>
        `
    this.noteNode = $(template)
     console.log(this.noteNode)
    this.recalculate()
    let  tmp
        ,makePlaceholder = 
          (e)=>{
            tmp = e.currentTarget.value
            e.currentTarget.value = ""
            e.currentTarget.setAttribute("placeholder", tmp)
            //fitValueInsideInput(e.currentTarget, true)
          }
    $(this.noteNode)
      .find (  ".priceInput" )
      .on   (  "focus"
              ,( e )=>{
                makePlaceholder ( e )
              }
            )
    
    function fitValueInsideInput(inputElement, restoreDefaultFontSize){
      if(restoreDefaultFontSize){
        $(inputElement).css("font-size", inputDefaultFontSize )
        return
      }
      let fontSizeValue = parseFloat($(inputElement).css("font-size").match(/[\d\.]*/)[0])
      while(inputElement.scrollWidth > inputElement.clientWidth){
        $(inputElement).css("font-size", (--fontSizeValue)+"px" )
      }
    }
    
    $(this.noteNode).find(".priceInput").on("blur",(e)=>{
      if(e.currentTarget.value === ""){
        this.priceOfItem = tmp
      }
      e.currentTarget.value = this.values.price.toFixed(2)
      fitValueInsideInput(e.currentTarget)
    })
    $(this.noteNode).find(".priceInput").on("input",(e)=>{
      this.priceOfItem = e.currentTarget.value
      fitValueInsideInput(e.currentTarget, true)
      fitValueInsideInput(e.currentTarget)
    })
    $(this.noteNode).find(".noteDeleteButton").on("click", (e)=>{
      $("#notesRow").find(this.noteNode).remove()
      this.removeNote(this.properties.id)
    })
    $(this.noteNode).find(".quantityInput").on("input",(e)=>{
      this.quantityOfItem = e.target.value
      fitValueInsideInput(e.currentTarget, true)
      fitValueInsideInput(e.currentTarget)
    })
    $(this.noteNode).find(".quantityInput").on("focus",(e)=>{
      tmp = e.target.value
      e.target.value = ""
      e.target.setAttribute("placeholder", tmp)
    })
    $(this.noteNode).find(".quantityInput").on("blur",(e)=>{
      if(e.target.value === ""){
        this.quantityOfItem = tmp
      }
      e.target.value = this.quantityOfItemFormated
      fitValueInsideInput(e.currentTarget)
    })
    $(this.noteNode).find(".unitQuantity").on("input",(e)=>{
      this.quantityOfUnitItem = e.target.value
    })
    $(this.noteNode).find(".unitQuantity").on("focus",(e)=>{
      tmp = e.target.value
      e.target.value = ""
      e.target.setAttribute("placeholder", this.quantityOfUnitItemFormated)
    })
    $(this.noteNode).find(".unitQuantity").on("blur",(e)=>{
      if(e.target.value === ""){
        this.quantityOfUnitItem = tmp
      }
      e.target.value = this.quantityOfUnitItemFormated
    })
    $(this.noteNode).find(".unitQuantityType").on("input",(e)=>{
      this.typeOfUnit = e.target.value
      $(this.noteNode).find(".unitQuantity").trigger("click").trigger("focus")
      
    })
  }
  
  recalculate()
  {
    $(this.noteNode)
      .find(".priceOfAllItems")
      .text(this.priceOfAllItems.toFixed(2))
      
    $(this.noteNode)
      .find(".unitPriceValue")
      .text(this.pricePerUnitItem.toFixed(2))
      
    $(this.noteNode).find(".unitType").text(
          ["g","ml"].includes(this.values.unitQuantityType)
          ?this.values.unitQuantityType==="g"?"kg":"l"
          :this.values.unitQuantityType
        )
  }
  
  totalPriceValue(){
    return this.values.price.mul(this.values.quantity).toFixed(2)
  }
  get priceOfItem(){
    
  }
  get priceOfAllItems(){
    return this.values.price.mul(this.values.quantity)
  }
  get quantityOfItems(){
    
  }
  get quantityOfItemFormated(){
    return this.values.quantity.toDecimalPlaces(2).toString() 
  }
  get quantityOfUnitItemFormated(){
    if(["g","ml","szt"].includes(this.values.unitQuantityType)){
        return this.values.quantityOfUnitItem.toDecimalPlaces(2).toString() 
    }else{
        return this.values.quantityOfUnitItem.toFixed(2)
    }
  }
  
  get pricePerUnitItem(){
    return  this.values.price.div(
              this.values.quantityOfUnitItem.div(
                ["ml","g"].includes(this.values.unitQuantityType)
                ?1000
                :1
              )
            )
  }
  
  set priceOfItem(x){
    this.values.price = tryCatchNew(Decimal, [x], [0], x=>x==="", this.values.price)
    this.recalculate()
  }
  set quantityOfItem(x){
    this.values.quantity = tryCatchNew(Decimal, [x], [0], x=>x==="", this.values.quantity)
    this.recalculate()
  }
  set quantityOfUnitItem(x){
    this.values.quantityOfUnitItem = tryCatchNew(Decimal, [x], [0], x=>x==="", this.values.quantityOfUnitItem)
    this.recalculate()
  }
  set typeOfUnit(x){
    this.values.unitQuantityType = x
    this.recalculate()
  }
}

class Notes{
  constructor(){
    this.container = []
  }
  
  sumOfPrices(properties){
    let sum = new Decimal(0)
    
    for(let n of this.container){
      sum = this?.properties?.selected && !n.properties.isSelected
            ?sum
            :sum.add(n.totalPriceValue())
    }
    
    return sum
  }
  
  removeNote(noteId){
    let i = this.container.findIndex((e)=>e.properties.id===noteId)
    if(i >= 0 && i < this.container.length){
      this.container.splice(i,1)
    }
  }
  
  addNote(properties){
    this.container.push(new Note(properties, this.removeNote.bind(this)))
  }
  
  getRenderedNotes(){
    let renderedNotes = []
    for(let [i,n] of this.container.entries()){
      renderedNotes.push(n.noteNode)
    }
    return renderedNotes
  }
}

const notes = new Notes()

notes.addNote()
notes.addNote()
notes.addNote()


function renderNotes(){
  $("#notesRow").empty()
  $("#notesRow").append(notes.getRenderedNotes())
}

function updateNode(node, updatedNode){
  
}

function renderFooter(){
  let template = `
    <form>
    <table>
      <tr>
        <td>
          <input type="text" />
        </td>
        <td>
          <input class="" type="number" placeholder="0.00" />
        </td>
        <td>
          <input type="number" placeholder="1.00" />
        </td>
        <td>
          <input type="text" placeholder="1.00" />
          <select>
            <option value="szt" selected>szt</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>
          <button>Dodaj</button>
        </td>
      </tr>
    </table>
    </form>
  `
    , inputRow = $(template)
  
  $("#inputRow").empty()
  $("#inputRow").append(inputRow)
}

function renderHeader(){
  let template = `
    <form>
    <table>
      <tr>
        <td>
          Suma wszystkich
        </td>
        <td>
          <input type="number" placeholder="0.00" />
        </td>
        <td>
          Budżet
          <input type="text" placeholder="1.00" />
        </td>
        <td>
          Pozostało z budżetu
          <input type="text" placeholder="1.00" />
        </td>
        <td
      </tr>
      <tr>
        <td>
          Suma zaznaczonych
        </td>
        <td>
          <input type="number" placeholder="0.00" />
        </td>
      </tr>
    </table>
    </form>
  `
    , inputRow = $(template)
  
  
  
  $("#headerRow").append(inputRow)
}

function eventsHandler(e){
  
}

//renderHeader()
//renderFooter()
renderNotes()
//notes.container.splice(0)
//console.log(notes.container)