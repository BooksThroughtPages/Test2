let htmlElements = new Set(["a","abbr","acronym","address"
                            ,"applet","area","article","aside","audio","b"
                            ,"base","basefont","bdo","big","blockquote","body"
                            ,"br","button","canvas","caption","center","cite"
                            ,"code","col","colgroup","datalist","dd","del","dfn"
                            ,"div","dl","dt","em","embed","fieldset","figcaption"
                            ,"figure","font","footer","form","frame","frameset"
                            ,"head","header","h1","h2","h3","h4","h5","h6","hr"
                            ,"html","i","iframe","img","input","ins","kbd"
                            ,"label","legend","li","link","main","map","mark"
                            ,"meta","meter","nav","noscript","object","ol"
                            ,"optgroup","option","p","param","pre","progress"
                            ,"q","s","samp","script","section","select","small"
                            ,"source","span","strike","strong","style","sub"
                            ,"sup","table","tbody","td","textarea","tfoot","th"
                            ,"thead","time","title","tr","u","ul","var","video"
                            ,"wbr"
                            ])
                            
let htmlElementsSingletons = new Set(["br","hr","input"])

function createElement(arr){
  if(           arr === undefined 
      || typeof arr === "string" 
  ){  return document.createTextNode(arr??"") 
  }
  
  if( typeof arr === "object"
  ){  if("nodeType" in arr)         { return arr }
      if("jquery" in arr.__proto__) { return arr[0] }
  }
  
  if( arr?.length < 3
  ){  return document.createTextNode("")
  }
  
  let  element    = arr[0]
      ,parameters = arr[1]
      ,value      = arr[2]
  
  if( htmlElements.has(element) === false
  ){  return document.createTextNode(
        element === "text" 
          ? typeof value === "string"
              ? value
              : value?.reduce?.((a,b)=>a+b,"") ?? "" 
          : ""
      )
  }
 
  let returnElement = document.createElement(element)
  for(  let a in parameters
  ){    returnElement.setAttribute(a, parameters[a])
  }
  
  if( htmlElementsSingletons.has(element)
  ){  return returnElement
  }
  
  for(  let a of value
  ){    const tmp = createElement(a)
        if(     tmp.nodeType === 3
            &&  tmp.length === 0
        ){  continue
        }
        returnElement.appendChild(tmp)
  }
 
  return returnElement 
}

