let notesState = {
  notes: []
  ,pricesSum:function(type){
    let sum = 0
    if(type==="selected"){
      for(let e of this.notes){
        if(e.properties.computeFieldsVisible === false){
          sum+=e.sum
        }
      }
    }else{
    for(let e of this.notes){
      sum += e.sum
    }
    }
    return sum
  }
  ,dpricesSum:function(type){
    let sum = new Decimal(0)
    if(type==="selected"){
      for(let e of this.notes){
        if(e.properties.computeFieldsVisible === false){
          sum=sum.add(e.dsum)
        }
      }
    }else{
    for(let e of this.notes){
      sum = sum.add(e.dsum)
    }
    }
    return sum
  }
}

let getId = (()=>{let id = 0;return ()=>{return id++}})()


class Note{
  constructor(properties){
    this.values = properties?.values??{text:"",quantity:0,dquantity:new Decimal(0),price:0,dprice:new Decimal(0)}
    this.properties = properties?.properties??{computeFieldsVisible:true,id:getId()}
  }
  get id() { return this.properties.id }
  get text(){ return this.values.text }
  get price(){ return this.values.price }
  get dprice(){ return this.values.dprice }
  get quantity(){ return this.values.quantity }
  get dquantity() { return this.values.dquantity }
  get sum() { 
    return (parseFloat(this.values.price)||0)*(parseFloat(this.values.quantity)||0)
  }
  get dsum(){
    return this.dprice.mul(this.dquantity)
  }
  set price(priceValue){
    this.values.price = priceValue
  }
  set dprice(priceValue){
    console.log("pv:", priceValue)
    try{
    this.values.dprice = new Decimal(priceValue)
    }catch(e){
      this.values.dprice = new Decimal(0)
    }
  }
  set quantity(quantityValue){
    this.values.quantity = quantityValue
  }
  set dquantity(quantityValue){
    try{
    this.values.dquantity = new Decimal(quantityValue)
    }catch(e){
      this.values.dquantity = new Decimal(1)
    }
  }
  updatePricesSum(oldPriceOfItem){
  }
  
  render(){
    let template = `
      <table class="">
      <tr class="" style="">
        <td class="">
          <button class="toogleSelected">1</button>
        </td>
        <td class="noteTextValue" style="overflow-wrap:anywhere;">
          <div contentEditable="true" class="">
            ${this.text}
          </div>
        </td>
        <td class="" style="">
          <form class="smbForm">
          <input class="price" type="number" value="${this.dprice.toFixed(2)}"
          style="${this.properties.computeFieldsVisible?'':'background-color:gray;'}"
          />
          <span>suma <span id="priceSuma">${this.dsum.toFixed(2)}</span></span>
          </form>
        </td>
        <td class=""
          style="">
          <form class="smbForm">
          <input class="quantity" type="number" value="${this.dquantity.toFixed(2)}"
          style="${this.properties.computeFieldsVisible?'':'background-color:gray;'}"/>
          </form>
        </td>
        <td class="">
          <button class="removeNote">U</button>
        </td>
      </tr>
    </table>
    `
    let node = $(template)
    
    node.find(".toogleSelected").on("click", (e,id=this.id)=>{
      let tmp = notesState.notes.find(e=>e.id===id)
      tmp.properties.computeFieldsVisible = !tmp.properties.computeFieldsVisible 
      renderHeader()
      renderNotes()
    })
    
    node.find(".price").on("input", (e,id=this.id)=>{
      notesState.notes.find(e=>e.id===id).dprice = e.target.value
      updateNotes()
      renderHeader()
    })
    let tmp
    node.find(".smbForm").on("submit", (e,id=this.id)=>{
      e.preventDefault()
      e.stopPropagation()
      
      console.log(e)
      e.target.firstElementChild.value = e.target.firstElementChild.value===""?new Decimal(tmp).toFixed(2):e.target.firstElementChild.value
      notesState.notes.find(e=>e.id===id)[$(e.target.firstElementChild).attr("class")==="price"?"dprice":"dquantity"] = e.target.firstElementChild.value
      console.log("submiting", tmp)
      
      updateNotes()
      renderHeader()
      $("#inputRow").find("#inputTekst").trigger("click").trigger("focus")
    })
    
    node.find(".price").on("focus", (e,id=this.id)=>{
      tmp = e.target.value
      e.target.value = ""
      e.target.setAttribute("placeholder", new Decimal(tmp).toFixed(2))
      
      renderHeader()
    })
    node.find(".price").on("blur", (e)=>{
      //e.target.value = e.target.value===""?tmp:e.target.value
      let numTmp
      try{
        numTmp = new Decimal(e.target.value)
      }catch(e){
        numTmp = tmp
      }
      e.target.value = e.target.value===""?new Decimal(tmp).toFixed(2):numTmp.toFixed(2)
      renderHeader()})
    node.find(".quantity").on("input", (e,id=this.id)=>{
      try{
        notesState.notes.find(e=>e.id===id).dquantity = new Decimal(e.target.value)
      }catch(e){
        notesState.notes.find(e=>e.id===id).dquantity = new Decimal(0)
      }
      updateNotes()
      renderHeader()
    })
    node.find(".quantity").on("focus", (e,id=this.id)=>{
      tmp = e.target.value
      e.target.value = ""
      e.target.setAttribute("placeholder", tmp)
      
      renderHeader()
    })
    node.find(".quantity").on("blur", (e)=>{e.target.value = e.target.value===""?new Decimal(tmp).toFixed(2):new Decimal(e.target.value).toFixed(2);renderHeader()})
    node.find(".removeNote").on("click", (e,id=this.id)=>{
      notesState.notes.splice(
        notesState.notes.findIndex(e=>e.id===id)
        ,1
      )
      
      renderHeader()
      renderNotes()
    })
    
    return $(node)
  }
  
}

function renderHeader(){
  let template = `
    <table class="">
      <tr class="">
        <td class="">
          Koszty wszystkich
        </td>
        <td class="">
          <input class="" type="text" disabled value="${notesState.dpricesSum().toFixed(2)}"/>
        </td>
        <td class="">
        </td>
      </tr>
      <tr class="">
        <td class="">
          Koszty oznaczonych
        </td>
        <td class="">
          <input class="" type="text" disabled value="${notesState.dpricesSum('selected').toFixed(2)} a pozostałych ${notesState.dpricesSum().sub(notesState.dpricesSum('selected')).toFixed(2)}"/>
        </td>
        <td class="">
        </td>
      </tr>
    </table>
  `
  $("#headerRow").empty()
  $("#headerRow").append(template)
}

function renderNotes(){
  $("#notesRow").empty()
  for(let n of notesState.notes) {
    $("#notesRow").append(n.render())
  }
}
function updateNotes(){
  let prevNode = $("#notesRow").find("table")
  notesState.notes.forEach((n,i)=>{
    let sum = n.dsum
        ,sumEl = $(prevNode[i]).find("#priceSuma")
    if(sum !== new Decimal(sumEl.text()) ){
      sumEl.text(`${sum.toFixed(2)}`)
    }
  })
}
function renderFooter(){
  let template = `
    <form id="formDodaj">
    <table class="">
      <tr class="">
        <td class="">
          <input id="inputTekst" style="" class=""/>
        </td>
        <td class="">
          <input id="inputCena" type="number" step="any" style="" class="" placeholder="0"/>
        </td>
        <td class="">
          <input id="inputQuantity" type="number" placeholder="1" step="any" style="" class=""/>
        </td>
      </tr>
      <tr class="">
        <td class="">
           <button id="btnDodaj" type="submit" class="">Dodaj</button>
        </td>
      </tr>
    </table>
    </form>
  `
  
  $("#inputRow").append(template)
  let fnDodaj = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    
    let inputFields = {
      text: $(e.target).find("#inputTekst")
      ,price: $(e.target).find("#inputCena")
      ,quantity: $(e.target).find("#inputQuantity")
    }
    
    //let p = parseFloat(inputFields.price.val())
    //    ,q = parseFloat(inputFields.quantity.val())
    let p, q
    
    try{
      p = new Decimal(inputFields.price.val())
    }catch(e){
      p = new Decimal(0)
    }
    
    try{
      q = new Decimal(inputFields.quantity.val())
    }catch(e){
      q = new Decimal(1)
    }
    //p = isNaN(p)?0:p
    //q = isNaN(q)?1:q
    
    notesState.notes.push(new Note({values:{
                                      text: inputFields.text.val()
                                      ,price: 0
                                      ,dprice: p
                                      ,quantity: 1
                                      ,dquantity: q
                                      }
                                    })
    )
    
    inputFields.text.val("").trigger("click").trigger("focus")
    inputFields.price.val("")
    inputFields.quantity.val("")
    
    renderHeader()
    renderNotes()
  }
  $("#formDodaj").on("submit", fnDodaj)
}

function chainFunctions(){
  console.log("chaining", arguments)
  let v = arguments
  return (x = v)=>{console.log(v);for(a of v){a()}}
}
//chainFunctions(renderHeader, renderNotes).call()
renderHeader()
renderNotes()
renderFooter()
