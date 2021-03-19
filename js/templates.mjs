export { noteTemplate, headerTemplate }

const headerTemplate = `
        <div style="display:flex;flex-direction:column;">
    			<div><input type="number" class="inputBudget" /></div>
    			<div class="budgetDiffSumAll" style="text-align:right;">2</div>
    			<div class="budgetDiffSumTmp" style="text-align:right;">1</div>
    		</div>
    		<div style="display:flex;flex-direction:column;">
    			<div style="display:flex;flex-direction:row;"><div>rs:</div><div style="flex:1 1 auto;text-align:right;" class="budgetDiffSumAllSumTmp"></div></div>
    			<div style="display:flex;flex-direction:row;"><div>sw:</div><div style="flex:1 1 auto;text-align:right;" class="budgetSumAll"></div></div>
    			<div style="display:flex;flex-direction:row;"><div>sz:</div><div style="flex:1 1 auto;text-align:right;" class="budgetSumTmp"></div></div>
    		</div>
`

const noteTemplate = `
      <div class="noteContainer">
				<div class="noteHeader">
				  <div class="noteHeaderIndex"></div>
				  <div class="noteHeaderSumQuantity"></div>
				  <div class="noteHeaderUnitPrice"></div>
				  <div class="noteHeaderSumPrice"></div>
				</div>
				<div class="noteText">
				  <input class="noteInput" type="text" placeholder="Treść notatki" form="testForm"/>
				  
				</div>
				<div class="notePriceInput">
				  <input class="priceInput" type="number" form="testForm"/>
				</div>
				<div class="noteQuantityInput">
				  <input class="quantityInput" type="number"  form="testForm"/>
				</div>
			</div>
`
