let notesState = {
  notes: []
  ,noteId: 0
  ,pricesSum:0
}

class Note{
  constructor(properties){
    this.values = properties?.values??{text:"",quantity:0,price:0}
    this.properties = properties?.properties??{computeFieldsVisible:true,id:notesState.noteId++}
    notesState.pricesSum += (parseFloat(this.values.price)||0)*(parseFloat(this.values.quantity)||0)
  }
  get id() { return this.properties.id }
  get text(){ return this.values.text }
  get price(){ return this.values.price }
  get quantity(){ return this.values.quantity }
  get sum() { 
    return (parseFloat(this.values.price)||0)*(parseFloat(this.values.quantity)||0)
  }
  set price(priceValue){
    let tmp = this.sum
    this.values.price = priceValue
    this.updatePricesSum(tmp)
    
  }
  set quantity(quantityValue){
    let tmp = this.sum
    this.values.quantity = quantityValue
    this.updatePricesSum(tmp)
    
  }
  updatePricesSum(oldPriceOfItem){
    notesState.pricesSum -= oldPriceOfItem
    notesState.pricesSum += this.sum
    renderHeader()
  }
  
  render(){
    let template = `
    <table class="table table-borderless m-0 id=${this.id}">
      <tr class="d-flex mt-2">
        <td class="col-1 p-0 bg-warning">
          <button class="btn btn-success w-100 h-100 p-0">1</button>
        </td>
        <td class="col-5 p-0">
          <div class="w-100">${this.text}</div>
        </td>
        <td class="col-3 p-0 price">
          <input class="form-control w-100" type="number" value="${this.price}"/>
        </td>
        <td class="col-2 p-0 quantity">
          <input class="form-control w-100" placeholder type="number" value="${this.quantity}"/>
        </td>
        <td class="col-1 p-0">
          <button class="btn btn-danger w-100 removeNote">U</button>
        </td>
      </tr>
    </table>
    `
    let node = $(template)
    node.find(".price").on("input", (e,id=this.id)=>{
      notesState.notes.find(e=>e.id===id).price = parseFloat(e.target.value)||0
    })
    node.find(".quantity").on("input", (e,id=this.id)=>{
      notesState.notes.find(e=>e.id===id).quantity = parseFloat(e.target.value)||0
    })
    node.find(".removeNote").on("click", (e,id=this.id)=>{
      let index = undefined
          ,tmp = notesState.notes.find(
            (e,i)=>{if(e.id===id){index = i;
            notesState.pricesSum -= e.sum
            console.log("removing ", i)
            return true}})
  
      notesState.notes.splice(index, 1)
      renderHeader()
      renderNotes()
    })
    
    return $(node)
  }
  
}

function renderHeader(){
  let template = `
    <table class="table table-borderless m-0">
      <tr class="d-fle">
        <td class="p-0 col-7 bg-danger">
          
        </td>
        <td class="p-0 col-3 bg-success">
          <input class="form-control w-100" type="text" disabled value="${notesState.pricesSum.toFixed(3)}"/>
        </td>
        <td class="col-2 bg-light">
        </td>
      </tr>
    </table>
  `
  $("#headerRow").empty()
  $("#headerRow").append(template)
}

function renderNotes(){
  $("#notesRow").empty()
  notesState.pricesSum = 0
  for(let n of notesState.notes) {
    notesState.pricesSum += n.sum
    $("#notesRow").append(n.render())
  }
}

function renderFooter(){
  let template = `
    <form id="formDodaj">
    <table class="table table-borderless m-0">
      <tr class="d-flex">
        <td class="col-7 p-0">
          <input id="inputTekst" style="height:2.5rem;padding-left:0.35rem" class="form-control" placeholder/>
        </td>
        <td class="col-3 p-0">
          <input id="inputCena" type="number" step="any" style="height:2.5rem;padding-left:0.35rem;" class="form-control" placeholder/>
        </td>
        <td class="col-2 p-0">
          <input id="inputQuantity" type="number" step="any" style="height:2.5rem;padding-left:0.35rem;" class="form-control" placeholder/>
        </td>
      </tr>
      <tr class="d-flex">
        <td class="col-12 p-0">
           <button id="btnDodaj" type="submit" class="btn btn-success w-100">Dodaj</button>
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
    notesState.notes.push(new Note({values:{
                                      text: inputFields.text.val()
                                      ,price: inputFields.price.val()
                                      ,quantity: inputFields.quantity.val()
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

notesState.notes.push(new Note({values:{text:"Orzechy brazylijskie",price:39.99,quantity:1}}))



renderHeader()
renderNotes()
renderFooter()
