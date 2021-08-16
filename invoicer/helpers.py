from pandas import *
from datetime import date
from weasyprint import HTML, CSS
import sqlite3, os, csv



invoiceNo = -1



def getInvoiceNo():
	global invoiceNo
	if(invoiceNo == -1):
		updateInvoiceNo()
		return invoiceNo
	else:
		print("GETINVOICE NO " + str(invoiceNo))
		return invoiceNo
	
def updateInvoiceNo():
	global invoiceNo
	if (invoiceNo == -1):
		try:
			with open('invoiceNo.txt', 'r') as f:
				invoiceNo = f.read()
				f.close()
		except FileNotFoundError:
			with open('invoiceNo.txt', 'w') as f:
				f.write("Error") 
				f.close()
	else:
		invoiceNo = int(invoiceNo) 
		invoiceNo += 1
		invoiceNo = str(invoiceNo)
		print("UPDATE PRE " + str(invoiceNo))
		try:
			with open('invoiceNo.txt', 'w') as f:
				f.write(invoiceNo)
				f.close()
		except FileNotFoundError:
			with open('invoiceNo.txt', 'w') as f:
				f.write("Invoice numbering error, please enter manually") 
				f.close()
		print("UPDATE POST " + str(invoiceNo))
		
		
def processPDF():
	os.system("wkhtmltopdf --enable-local-file-access temp.html output.pdf")
	today = date.today()
	month = today.strftime("%B")
	year = today.strftime("%Y")
	full = today.strftime("%m-%d-%Y")
	
	items = [year, month, full]
	
	workingPath = os.getcwd()
	workingPath = os.path.join(workingPath, "invoices")
	
	for i in items:
		workingPath = os.path.join(workingPath, i)
		if(not(os.path.exists(workingPath))):
			os.mkdir(workingPath)
	print(invoiceNo)
	filename = str(invoiceNo) + ".pdf"
	workingPath = os.path.join(workingPath, filename)
	rootPath = os.getcwd()
	os.rename(os.path.join(rootPath, 'output.pdf'), workingPath)
	
	print("Invoice no. " + str(invoiceNo) + " saved")
	#os.rename('output.pdf', workingPath)
	
	
def test():
	return("the mic sounds nice")


def makeCsv(name):
	xlsx = pandas.read_excel(name + ".xlsx")
	xlsx.to_csv(name + ".csv", index = None, header=False)

def today():
	today = date.today()
	output = today.strftime("%B-%m-%Y")

	return output

'''Makes Database from excel sheet. Invokes make CSV initially, then creates a new 
prices database. Does necessary commands to create a table called prices
with two columns product and price. Then reads csv into that table.
Deletes CSV afterwards, as thats just used to simply excel -> sql conversion. '''

def makePriceDb():
	if os.path.exists("prices.csv"):
		os.remove("prices.csv")
	if os.path.exists("prices.db"):
		os.remove("prices.db")
	makeCsv("prices")
	conn = sqlite3.connect('prices.db')
	c = conn.cursor()
	c.execute("CREATE TABLE prices(product TEXT, price TEXT)")
	with open('prices.csv') as csvfile:
		converter = csv.reader(csvfile, dialect='excel')
		for row in converter:
			product = row[0].lower()
			price = row[1]
			c.execute("INSERT INTO prices(product,price) VALUES(?,?)", (product, price))
	
	conn.commit()
	conn.close()
	os.remove("prices.csv")
	
	
	
def makeTaxDb():
	if os.path.exists("taxes.csv"):
		os.remove("taxes.csv")
	if os.path.exists("taxes.db"):
		os.remove("taxes.db")
	makeCsv("cityrates")
	conn = sqlite3.connect('taxes.db')
	c = conn.cursor()
	c.execute("CREATE TABLE taxes(city TEXT, rate TEXT)")
	with open('cityrates.csv') as csvfile:
		converter = csv.reader(csvfile, dialect='excel')
		for row in converter:
			city = row[0].lower()
			rate = row[1]
			c.execute("INSERT INTO taxes(city,rate) VALUES(?,?)", (city, rate))
	
	conn.commit()
	conn.close()

	
	
def makeDeliveryDb():
	if os.path.exists("delivery.csv"):
		os.remove("delivery.csv")
	if os.path.exists("delivery.db"):
		os.remove("delivery.db")
	makeCsv("cityrates")
	conn = sqlite3.connect('delivery.db')
	c = conn.cursor()
	c.execute("CREATE TABLE delivery(city TEXT, rate TEXT)")
	with open('cityrates.csv') as csvfile:
		converter = csv.reader(csvfile, dialect='excel')
		for row in converter:
			city = row[0].lower()
			rate = row[2]
			c.execute("INSERT INTO delivery(city,rate) VALUES(?,?)", (city, rate))
	
	conn.commit()
	conn.close()
	os.remove("cityrates.csv")
	
def makeResaleDb():
	if os.path.exists("resale.csv"):
		os.remove("resale.csv")
	if os.path.exists("resale.db"):
		os.remove("resale.db")
	makeCsv("resale")
	conn = sqlite3.connect('resale.db')
	c = conn.cursor()
	c.execute("CREATE TABLE resale(city TEXT, rate TEXT)")
	with open('resale.csv') as csvfile:
		converter = csv.reader(csvfile, dialect='excel')
		for row in converter:
			name = row[0].lower()
			permit = row[1]
			c.execute("INSERT INTO resale(city,rate) VALUES(?,?)", (name, permit))
	
	conn.commit()
	conn.close()
	os.remove("resale.csv")





	
	
	
"""
MakeDict takes your cool little database and converts it into a python dictionary,
with the first row as a key, and the second as the value. Returns said dict.
"""
def makeDict(name):
	qstring = ""
	if (name =="prices"):
		makePriceDb()
		qstring = "SELECT * FROM prices"
		
	if (name =="taxes"):
		makeTaxDb()
		qstring = "SELECT * FROM taxes"
		
	if (name =="delivery"):
		makeDeliveryDb();
		qstring = "SELECT * FROM delivery"

	if (name =="resale"):
		makeResaleDb()
		qstring = "SELECT * FROM resale"
		
	output = {}
	conn = sqlite3.connect(name +".db")
	c = conn.cursor()
	for rows in c.execute(qstring):
		output.update({rows[0] : rows[1]})
	conn.close()
	return output
	
invoiceNo = getInvoiceNo()

