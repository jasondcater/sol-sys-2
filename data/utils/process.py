import re
oldstring = '0040'
newstring = re.sub("^0+","",oldstring)

import csv
csvfile = open("dirty.csv", "rb")
reader = csv.reader(csvfile)

cleanfile = open("clean.txt","w")

for row in reader:

    date = row[1].replace(" A.D. ", "");
    date = date.replace(" 00:00:00.0000", "");
    date = date.replace("Jan","1");
    date = date.replace("Feb","2");
    date = date.replace("Mar","3");
    date = date.replace("Apr","4");
    date = date.replace("May","5");
    date = date.replace("Jun","6");
    date = date.replace("Jul","7");
    date = date.replace("Aug","8");
    date = date.replace("Sep","9");
    date = date.replace("Oct","10");
    date = date.replace("Nov","11");
    date = date.replace("Dec","12");

    x = "{:.25f}".format(float(row[2]))
    y = "{:.25f}".format(float(row[3]))
    z = "{:.25f}".format(float(row[4]))

    cleanfile.write("        \""+date+"\":["+x+","+y+","+z+"],\n")

csvfile.close()
cleanfile.close()