

//instantiates json object to be used as price dict
var database = {};
//instantiates object to be used as tax rate dict
var taxRates = {};
//instantiates object to be used as delivery rate dict
var deliveryRates = {};
//instantiates object to be used as resale permit dict
var resalePermits = {};
//Defualt Tax Rate
var defaultTaxRate = .101

let hasResale = false;

var test;
//adds listener to query /json route through the fetchDb function
document.addEventListener('DOMContentLoaded', fetchDbs());
//adds listeners to the text boxes with the "item" class, ideally to fill when necessary
//will also add listeners to price and ext
document.addEventListener('DOMContentLoaded', addListeners) 


function fetchDbs() {
	fetch('/json')
	.then(response => response.json())
	.then(data =>{ database = data; console.log(database)});
	fetch('/tax')
	.then(response => response.json())
	.then(data =>{ taxRates = data;});
	fetch('/delivery')
	.then(response => response.json())
	.then(data =>{ deliveryRates = data;});
	fetch('/resale')
	.then(response => response.json())
	.then(data =>{ resalePermits = data;});
} 


function populateFields() {

	//arr = document.getElementsByClassName("itemfield");
	arr = this;

	//loops through each row using the 'item' textbox, then finds each sibling to process.
	//for (var i = 0; i < arr.length; i++)
	//{
		var itemVal = arr.value.toLowerCase();//arr[i].value;
		var element = arr;//arr[i];
		var siblings = getSibs(element);
		if (itemVal in database)
		{
			//defines and assigns variables for the elements corresponding to qty, price, and ext
			var qtyElem,
				priceElem,
				extElem,
				itemElem;
			for (var k = 0; k < siblings.length; k++)
			{
				switch (siblings[k].className)
				{
					case "itemfield qty":
						qtyElem = siblings[k];
						break;
					case "itemfield price":
						priceElem = siblings[k];
						break;
					case "itemfield ext":
						extElem = siblings[k];
						break;
					case "itemfield item":
						itemElem = siblings[k];
					default:
						break;		
				}
			}
		}
		if (siblings[3].value !== undefined)
		{

			for (var k = 0; k < siblings.length; k++)
			{
				switch (siblings[k].className)
				{
					case "itemfield qty":
						qtyElem = siblings[k];
						break;
					case "itemfield price":
						priceElem = siblings[k];
						break;
					case "itemfield ext":
						extElem = siblings[k];
						break;
					case "itemfield item":
						itemElem = siblings[k];
					default:
						break;		
				}
			}
		}

				
		calcPrice(qtyElem, priceElem, extElem, itemElem);
		calcTotals();
			/*	
			//unit = database.(itemElem.value);
			price = database[itemVal];
			qty = qtyElem.value;
			if(price.includes("/"))
			{
				price = price.split("/");
				// once resale functionality is added, make sure it works here
				if (qty >= 1000)
					{
						price = price[1].trim();
						priceElem.value = price;
						extElem.value = (qty / 2000) * price;
					}
				else
				{
					price = price[0].trim();
					priceElem.value = price;
					extElem.value = qty * price;
				}
			}
			else
			{
				priceElem.value = price;
				extElem.value = qty * price;
			}
			*/
		
	//}
}

function populateAllFields() {

	arr = document.getElementsByClassName("itemfield");
	

	//loops through each row using the 'item' textbox, then finds each sibling to process.
	for (var i = 0; i < arr.length; i++)
	{
		var itemVal = arr[i].value;
		var element = arr[i];
		var siblings = getSibs(element);
		if (itemVal in database)
		{
			//defines and assigns variables for the elements corresponding to qty, price, and ext
			var qtyElem,
				priceElem,
				extElem,
				itemElem;
			for (var k = 0; k < siblings.length; k++)
			{
				switch (siblings[k].className)
				{
					case "itemfield qty":
						qtyElem = siblings[k];
						break;
					case "itemfield price":
						priceElem = siblings[k];
						break;
					case "itemfield ext":
						extElem = siblings[k];
						break;
					case "itemfield item":
						itemElem = siblings[k];
					default:
						break;		
				}
			}
		}
		if (siblings[3].value !== undefined)
		{

			for (var k = 0; k < siblings.length; k++)
			{
				switch (siblings[k].className)
				{
					case "itemfield qty":
						qtyElem = siblings[k];
						break;
					case "itemfield price":
						priceElem = siblings[k];
						break;
					case "itemfield ext":
						extElem = siblings[k];
						break;
					case "itemfield item":
						itemElem = siblings[k];
					default:
						break;		
				}
			}
		}

				
		calcPrice(qtyElem, priceElem, extElem, itemElem);
		calcTotals();
			/*	
			//unit = database.(itemElem.value);
			price = database[itemVal];
			qty = qtyElem.value;
			if(price.includes("/"))
			{
				price = price.split("/");
				// once resale functionality is added, make sure it works here
				if (qty >= 1000)
					{
						price = price[1].trim();
						priceElem.value = price;
						extElem.value = (qty / 2000) * price;
					}
				else
				{
					price = price[0].trim();
					priceElem.value = price;
					extElem.value = qty * price;
				}
			}
			else
			{
				priceElem.value = price;
				extElem.value = qty * price;
			}
			*/
		
	}
}



//this function finds the row that youre working with, accepts an html element
//as a paramenter. 
//goofy code here. this for loop is designed to take every row that has an item slot
//it loops through and for each one it selects the adjacent rows through some silliness.
//basically. each box has a specific class. this loops through and finds the parent tr 
//element of the current row. then it selects the children and adds them to the array siblings.
//
function getSibs(e)
{
	let parent = e.parentNode.parentNode;
	let looper = e.parentNode.parentNode.firstChild;
	let siblings = [];
	//For some reason if I don't include this, the first result for firstElementChild is undefined
	//Am I stupid or is this a JS moment?
	if(looper.firstElementChild === undefined)
	{
		looper = looper.nextElementSibling;
	}
		while (siblings.length < parent.childElementCount) 
		{
			siblings.push(looper.firstElementChild);
			//console.log("child " + looper.firstElementChild);
			//console.log("parent " + parent);
			//console.log("looper " + looper.firstElementChild);
			looper = looper.nextElementSibling;
	
		}
	return siblings;
}

//calculates and displays price in the appropriate price/unit and Ext boxes.
//accepts quantity element, price element, extension element, and item elements as params.
//elements are html text boxes.
function calcPrice(q, p, e, i)
{
			
			var unit,
				qty,
				price,
				item,
				extension;
				
			item = i.value.toLowerCase().trim();
			

			qty = parseFloat(q.value);
			if (qty == NaN)
				qty = "";

			if(item in database)
			{
				price = database[item];
				if(price.includes("/"))
				{
					price = price.split("/");
					// once resale functionality is added, make sure it works here EDIT: DONE
					if (qty >= 1000 || hasResale === true)
						{
							price = price[1].trim();
							price =parseFloat(price).toFixed(2);
							p.value = "$ " + price + " / ton";
							extension = (qty / 2000) * price;
							e.value = "$ " + extension.toFixed(2);
							if (!("lbs" in q.value.toString))
							{
								q.value = qty + " lbs"
							}
						}
					else
					{
						price = parseFloat(price[0].trim());
						price = price.toFixed(2);
						p.value = "$ " + price + " / lb";
						extension = qty * price;
						e.value = "$ " + extension.toFixed(2);
						if (!("lbs" in q.value.toString))
						{
							q.value = qty + " lbs"
						}
					}
				}
				else if(item.includes("paver"))
				{
					
					let dim = item.split('x');
					extension = ((parseFloat(dim[0]) * parseFloat(dim[1]) * qty) / 144 )* price
					console.log("dim " + dim);
					price = parseFloat(price).toFixed(2);
					e.value = "$ " + extension.toFixed(2);
					p.value = "$ " + price + " / sqft";
					
				}
				else
				{
					price = parseFloat(price).toFixed(2);
					p.value = "$ " + price + " / ea";
					extension = qty * price;
					e.value = "$ " + extension.toFixed(2);
					
				}
		}

		if (!(item in database))
		{

			price = parseFloat(p.value).toFixed(2);
			if (isNaN(price))
			{
				price = parseFloat(p.value.substring(1));
			}
			extension = qty * price;
			e.value = "$ " + extension.toFixed(2);
			
			
			
		}
		if (e.value === "$ NaN")
		{
			e.value = "";
		}
	
	
	
}

function calcTotals()
{
	let exts = document.getElementsByClassName("ext");
	let materialtotal = 0.0;

	
	for(let i = 0; i < exts.length; i++)
	{
		let temp = exts[i].value;
		temp = temp.substring(temp.indexOf("$") + 1 );
		temp = parseFloat(temp);
		if(!(isNaN(temp)))
		{
			materialtotal += temp;
		}	
		

		
		
	}
	materialtotal = materialtotal.toFixed(2);
	let material = document.getElementById("materialtot");
	material.value = "$ " + materialtotal;
	calcFinalTotals();
	
}


function calcFinalTotals()
{
	let totalBox = document.getElementById("total");
	let materialBox = document.getElementById("materialtot");
	let subtotalBox = document.getElementById("subtotal");
	let taxBox = document.getElementById("taxes");
	let taxCodeBox = document.getElementById("taxcode");
	let deliveryBox = document.getElementById("delivery");
	let depositBox = document.getElementById("deposit");
	
	
	if (!(deliveryBox.value === undefined || deliveryBox.value === ""))
	{

		subtotalBox.value = "$ " + (stripDollar(materialBox.value) + stripDollar(deliveryBox.value)).toFixed(2);
	}
	else 
	{
		subtotalBox.value = materialBox.value
	}
	
	
	let subtotalAmnt = stripDollar(subtotalBox.value);
	
	if (!(hasResale))
	{
		taxCodeBox.value = (defaultTaxRate * 100).toFixed(1) + " %";
	}
	else
	{
		taxCodeBox.value = 0.00 + " %";
		
	}
	
	let taxAmnt;
	
	if(!(hasResale))
	{
		taxAmnt = (stripDollar(subtotalBox.value) * defaultTaxRate).toFixed(2);
		taxBox.value = "$ " + taxAmnt;
	}
	else
	{
		taxAmnt = 0.00
		taxBox.value = "$ " + taxAmnt;
	}
	

	if (depositBox.value !== "")
	{
		let depositvalue = Number(stripDollar(depositBox.value).toFixed(2))
		totalBox.value = "$ " + ( Number(subtotalAmnt) + Number(taxAmnt) - depositvalue ).toFixed(2);


	}
	else
	{

		totalBox.value = "$ " + ( Number(Number(subtotalAmnt) + Number(taxAmnt)).toFixed(2) );
	}
	
}

function stripDollar(v)
{
	v = String(v);
	if (!(isNaN(parseFloat(v.substring(v.indexOf("$") + 1)))))
	{
		return parseFloat(v.substring(v.indexOf("$") + 1));
	}
	else
		console.log("stripdollar failed to parse a float");
		return 0.00;
}

function addRow()
{
	console.log("daf");
	let t = document.getElementById("price-table-body");
	let tr = document.createElement("tr");
	
	
	let classes = ["qty","item","price","ext"];
	t.appendChild(tr);
	for (let z = 0; z < classes.length; z++)
	{
		let td = document.createElement("td");
		let textarea = document.createElement("textarea");
		tr.appendChild(td);
		td.appendChild(textarea);
		textarea.className = ("itemfield " + classes[z]);
	}
	addListeners();
	
	return false;
}


function checkResale()
{
	let name = document.getElementById("name");
	let value = name.value.toLowerCase().trim();
	let resale = document.getElementById("resale");
	if (value in resalePermits)
	{
		
		resale.value = resalePermits[value];
		hasResale = true;
		
		
	}
	else
	{
		hasResale = false;
		resale.value = "";
	}
	
	calcFinalTotals();
	populateAllFields();
}
	
function checkDeliveryRate()
{
	let address = document.getElementById("address");
	let value = address.value.toLowerCase().trim();
	
	if (!(value === undefined) && !(value === ""))
	{
	for (let i = 0; i < Object.keys(deliveryRates).length; i++)
		{
			let key = Object.keys(deliveryRates)[i];
			
			if (value.includes(key))
			{
				let delivery = document.getElementById("delivery");
				let rate = deliveryRates[key];
				delivery.value = "$ " + Number(rate).toFixed(2);
				defaultTaxRate = (taxRates[key] / 100).toFixed(3);

			}
		}
	}
	else
	{
		let delivery = document.getElementById("delivery");
		delivery.value = "";
		defaultTaxRate = .101
		
	}
	
	calcFinalTotals();
	
}
	
	
//TODO
function autocomplete()
{
	let value = this.value;
	let keys = Object.keys(database);
	
	this.addEventListener('keyup' , s => {
		suggest(closestMatch, s.key, this);
		});
	
	 
	let max = 0;
	let closestMatch;
	
	for (let i = 0; i < keys.length; i++)
	{
		let matches = 0;
		let lowerKey = keys[i].toLowerCase();
		let lowerValue = keys[i].toLowerCase();
		
		 lowerKey = trim(lowerKey);
		 lowerValue = trim(lowerValue);
		
		if (lowerValue.length < lowerKey.length)
		{
			for (let j = 0; j < lowerValue.length; j++)
			{
				if (lowerValue[i] === lowerKey[i])
				{
					matches++;
					if(matches > max)
					{
						max = matches;
						closestMatch = keys[i];
					}	
				}			
			}
		}	
	}
}
//TODO
function suggest(suggestion, key, element)
{
	
}

function printPage()
{
	window.print();
	return false;
	
}


function save()
{
	let s = new XMLSerializer();
	let d = document.cloneNode(true);
	
	let textareas = d.getElementsByTagName("textarea");
	let inputs = d.getElementsByTagName("input");
	
	
	for(let i = 0; i < textareas.length; i++)
	{
		let outerHTML = textareas[i].outerHTML;

		

		if(!(outerHTML.includes("value"))) 
		{
			//textareas[i].setAttribute("placeholder", textareas[i].value)
			textareas[i].innerHTML = textareas[i].value;

			
			
		}
		
		
	}
	
	
	for(let i =0; i < inputs.length; i++ )
	{
		let outerHTML = inputs[i].outerHTML;
		
		if(!(outerHTML.includes("value")))
		{
			inputs[i].setAttribute("value", inputs[i].value);
		}
	}
	document.getElementById('invoice').setAttribute("value", document.getElementById('invoice').value);
	
	let str = s.serializeToString(d);
	let oldInvoiceNo = Number(document.getElementById("invoice").value);
	
	postXML(str);
	
	
	let newInvoiceNo = Number(document.getElementById("invoice").value);
	setTimeout(function() {
	
	
	if(oldInvoiceNo === newInvoiceNo)
	{
		document.getElementById("invoice").setAttribute("value", oldInvoiceNo + 1);
	}
	
	//reloadPage();
	
	}, 1000); 
	
	return false;
	
	
	
		
		
}


function reloadPage()
{
	
	

	console.log("CALLED " + window.location.href);
	location.assign(location.href.split('?')[0]);
	console.log("CALLED " + window.location.href);
	location.reload(true);
	
	

	
}

function updateInvoiceNo()
{
	fetch('/invoiceNo').then(function(response) {
		return response.text().then(function (text) {
			return document.getElementById("invoice").value;
		});
	}); 
		
		
		

	
}
	

	
	
function postXML(s)
{
		fetch('/xml', {
			method: 'POST',
			headers: {
				'Content-type': 'text/html'
				},
			body: s
		})
}

function addListeners() {
	//var x = document.getElementsByClassName("item");
	//var y = document.getElementsByClassName("qty");
	//var x = document.getElementsByTagName("textarea");
	let x = document.getElementsByClassName("itemfield");
	console.log("item elements " + x.length);
	//console.log(x);
	for (let i = 0; i < x.length; i++)
	{
		x[i].addEventListener('input', populateFields)
		
	};
	let l = document.getElementById("addrow");
	l.addEventListener('click', addRow);
	let exts = document.getElementsByClassName("ext");
	for(let i = 0; i < exts.length; i++) 
	{
		exts[i].addEventListener('change', calcTotals);
		
	}
	
	let nameField = document.getElementById("name");
	nameField.addEventListener("change", checkResale);
	let addressField = document.getElementById("address");
	addressField.addEventListener("input", checkDeliveryRate);
	let materialTotalField = document.getElementById("materialtot");
	document.getElementById("deposit").addEventListener('input', calcFinalTotals);
	document.getElementById("delivery").addEventListener('change', calcFinalTotals);
	document.getElementById("print").addEventListener('click', printPage);
	document.getElementById("save").addEventListener('click', save);

	
}
	

	

