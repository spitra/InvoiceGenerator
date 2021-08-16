from flask import Flask, render_template, request, jsonify, redirect, url_for
import helpers



app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def routed():
	if(request.method == "GET"):
		invoiceNum = helpers.getInvoiceNo()
		print("sending " + invoiceNum)
		return	render_template("new.html", day=helpers.today(), invoiceNo = invoiceNum)
	if(request.method == "POST"):
		print(request.form)
		
		return print("done")
@app.route('/json')
def json():
	d = helpers.makeDict("prices")
	return jsonify(d)
@app.route('/tax')
def tax():
	t = helpers.makeDict("taxes")
	return jsonify(t)
	
	
@app.route('/delivery')
def delivery():
	dv = helpers.makeDict("delivery")
	return jsonify(dv)
	
@app.route('/resale')
def resale():
	r = helpers.makeDict("resale")
	return jsonify(r)
@app.route('/xml', methods=['POST'])
def xml():
	htmlData = (request.data).decode("utf-8") 
	f = open("temp.html", "w")
	f.write(htmlData)
	f.close()
	helpers.processPDF()
	helpers.updateInvoiceNo()
	return ('200')
	
	
@app.route('/invoiceNo')
def invoiceNo():
	return helpers.getInvoiceNo()
	
	
	
@app.route('/blank')
def blank():
	return redirect('/')
	
