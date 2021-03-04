class Note{
 constructor(values, properties){
    this.id = Note.Id
    this.values = values
    this.properties = properties
  }
}

function createNote(n, i){
  let returnElements = []

  let note = createElement(
    ["tr", {class:"d-flex mb-1"}, [
      ["td", {class:"p-0 col-1"}, [
        ["label", {class:"check w-100 p-0 m-0"}, [
          ["input", {type:"checkbox"}, []]
          ,["span", {class:"w-100 m-0 p-0"}, [`${i}`]]
        ]]
      ]]
      ,["td", {class:"p-0 col-7 text-monospace"}, [
        `${n.values.text}`
      ]]
      ,["td", {class:"col-2 p-0 align-middle"}, [
        $(createElement(["input", {class:"form-control rounded-0 p-0 w-100 h-100 border-right-0",type:"number",step:"any"}, []])).val(n.values.price)
      ]]
      ,["td", {class:"col-2 p-0 align-middle"}, [
        $(createElement(["input", {class:"form-control rounded-0 p-0 w-100 h-100 border",type:"number",step:"any"}, []])).val(n.values.quantity)[0]
      ]]
    ]]
  )
  let note2 = createElement(
    ["tr", {class:"d-flex mb-1 p-0"}, [
      ["td", {class:"p-0 col-12"}, [
        ["table", {class:"table m-0 table-borderless table-sm"}, [
          ["tr", {class:"d-flex mb-0 m-0 p-0 flex-row-reverse",style:"height:5px;font-size:0.7em;color:gray"}, [
             ["td", {class:"pt-0 m-0 col-2 text-center small"}, [["div",{class:"p-0 m-0",style:"position:relative;"}, [""]]]]
            ,["td", {class:"p-0 m-0 col-2 text-bottom text-center"}, [["div",{class:"p-0 m-0 text-center small",style:"position:relative;z-index:100;top:0.5em"}, [`= ${parseFloat(n.values.price*n.values.quantity).toFixed(2)} Zł`]]]]
          ]]
          ,["tr", {class:"d-flex mb-0 m-0 p-0"}, [
            ["td", {class:"p-0 m-0 col-1"}, [
              ["label", {class:"check w-100 p-0 m-0"}, [
                ["input", {type:"checkbox"}, []]
                ,["span", {class:"w-100 m-0 p-0"}, [`${i}`]]
              ]]
            ]]
            ,["td", {class:"p-0 col-7 text-monospace"}, [
              `${n.values.text}`
            ]]
            ,["td", {class:"col-2 p-0 align-middle overflow-hidden h-100", style:"height:2em!important"}, [
              $(createElement(["input", {class:"text-center form-control rounded-0 p-0 w-100 h-100 border-right-0", style:"padding-top:15px!important;height:100%;", type:"number",step:"any"}, []])).val(n.values.price)
            ]]
            ,["td", {class:"col-2 p-0 align-middle"}, [
              $(createElement(["input", {class:"text-center form-control rounded-0 p-0 w-100 h-100 border",type:"number",step:"any"}, []])).val(n.values.quantity)[0]
            ]]
          ]]
        ]]
      ]]
    ]]
  )
  
  let sum = createElement(
    ["tr",{},[
      ["td",{},[
        "Hejka"
      ]]
    ]]
  )
  
  returnElements.push(sum)
  returnElements.push(note)  
  
  return note2
}

class Notes{
  static list = []
  static add = (note) => { Notes.list.push(note) }
  static remove = (noteId) => { Notes.splice(Notes.findIndex(e=>e.id===noteId),1) }
}
  
function renderNotes(){
/*  let headerTable
        = createElement(
            ["table", {class:"table table-borderless table-sm"}, [
              ["tr", {class:"d-flex mb-1"}, [
                ["td", {class:"p-0 col-6"}, []]
                ,["td", {class:"p-0 col-4"}, [
                  ["input", {class:"form-control rounded-0 p-0 w-100 h-100 border",type:"number"}, []]
                ]]
                ,["td", {class:"p-0 col-2"}, []]
              ]]
            ]]
          )

  $("#sumRow").append(headerTable)
  
  let table
      = createElement(
          ["table", {class:"table table-borderless table-sm"}, []]
        )
  let i = 1
  for(let n of Notes.list){
    $(table).append(createNote(n, i++))
  }
  $("#notesRow").append(table)

    table = createElement(
          ["table", {class:"table table-borderless table-sm"}, []]
        )
    $(table).append(createElement(
      ["tr", {class:"d-flex"}, [
        ["td", {class:"p-0 col-8"}, [
          ["input",{class:"form-control",placeholder:"Treść notatki"},[]]
        ]]
        ,["td", {class:"p-0 col-2"}, [
          ["input",{class:"form-control", placeholder:"Cena"},[]]
        ]]
        ,["td", {class:"p-0 col-2"}, [
          ["input",{class:"form-control", placeholder:"Ilość"},[]]
        ]]
      ]])).append(createElement(
      ["tr", {}, [
        ["td", {class:"p-0 col-12"}, [
          ["button",{class:"btn btn-success w-100"},["Dodaj"]]
        ]]
      ]]
    ))*/
    let inputRow = `<table class="table table-borderless m-0">
				<tr class="d-flex" style="height:2.4em">
				 <td class="p-0 col-7" style="">
				  <input 
				   class="form-control rounded-0 border-0 ps-0 h-100"
				   type="text"
				   style="padding-top:1.1em!important;"
				   aria-describedby="button-addon2"
				   id="treśćNotatki"
				   placeholder="Treść notatki"/>
				 </td>
				 <td class="p-0 col-3">
				  <input
				   class="form-control h-100 rounded-0 border-0 w-100 ps-0"
				   type="number" step="any"
				   style="padding-top:1.1em!important;"
				   placeholder="Cena"
				   id="cenaTest"
				   />
				 </td>
			     <td class="p-0 col-2">
				  <input
				  	class="form-control h-100 rounded-0 border-0 ps-0 w-100"
				  	type="number" step="any"
				  	style="padding-top:1.1em!important;"
				  	placeholder="Ilość" 
				  	id="inputQuantity"
				  	/>
				 </td>
				</tr>
				<tr class="d-flex">
				 <td class="p-0 flex-fill">
				  <button class="btn btn-success w-100 rounded-0">Dodaj</button>
				 </td>
				</tr>
				</table>`
  $("#inputRow").append(inputRow)
} 
let placeholderUp = (e)=>{
  if(     e.target.validity.valid 
      &&  e.target.value.length === 0
  ){  $(e.target).prev().remove()
  }else if($(e.target).prev().length === 0){
      $(e.target).before(`
      <span class="position-absolute small upperLabel"
            style="margin-top:-0.3em;font-size:0.8em!important;color:gray"
			>${e.target.placeholder}</span>
      `)
  }
}

Notes.add(new Note({text:"Woda",price:1.65,quantity:10},{}))
Notes.add(new Note({text:"Cebula",price:1,quantity:15},{}))
Notes.add(new Note({text:"Kapusta kiszona",price:8.99,quantity:3},{}))
Notes.add(new Note({text:"Rapki",price:3.2,quantity:15},{}))
Notes.add(new Note({text:"Masło",price:2.99,quantity:9},{}))
Notes.add(new Note({text:"Mleko",price:2,quantity:25},{}))
Notes.add(new Note({text:"Orzechy brazylijskie",price:39.99,quantity:1},{}))

renderNotes()

$("#inputQuantity").on("input",placeholderUp).trigger("input")
$("#cenaTest").on("input",placeholderUp).trigger("input")
$("#treśćNotatki").on("input",placeholderUp).trigger("input")
