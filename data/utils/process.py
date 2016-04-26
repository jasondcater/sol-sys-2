# Open the text file from NASA HORIZONS Web Interface
with open("./pluto_test_file", "r") as read_file:
  read_lines = read_file.readlines()

# Open a file to write to. ! WILL OVERWRITE PREVIOUS DATA
write_file = open("./clean.csv", "w")

# Loop over the lines in the read_file
# This loop uses the "$$SOE" and "$$EOE" markers to know where to start and 
# stop reading from. If you only want to read a subsection of data, just move
# the markers in the file.
output = False
for read_line in read_lines:
  
  read_line = read_line.replace("\n", "")

  if read_line == "$$EOE":
    output = False

  if output:
    elements = read_line.split(",") 

    date = elements[1]

    date = date.replace(" A.D. ", "");
    date = date.replace(" 00:00:00.0000", "");

    x_pos = "{:.25f}".format(float(elements[2]))
    y_pos = "{:.25f}".format(float(elements[3]))
    z_pos = "{:.25f}".format(float(elements[4]))

    write_file.write("[\""+ date +"\", "+ x_pos +", "+ y_pos + ", "+ z_pos +"],\n") 
  
  if read_line == "$$SOE":
    output = True   

read_file.close()  
write_file.close()