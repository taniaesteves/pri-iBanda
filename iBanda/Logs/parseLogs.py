import json
# Open the file with read only permit
f = open('Logs/access.log')
# use readline() to read the first line 
line = f.readline()
# use the read line to read further.
# If the file is not empty keep reading one line
# at a time, till the file is empty
months = {    
    "Jan": 0, 
    "Fev": 1, 
    "Mar": 2, 
    "Apr": 3, 
    "May": 4, 
    "Jun": 5, 
    "Jul": 6, 
    "Aug": 7, 
    "Sep": 8, 
    "Oct": 9, 
    "Nov": 10,
    "Dec": 11 
}

all_data = []
data_by_url = {}
data_by_token = {}
total_requests = { "GET": {}, "POST": {} }

while line:
    # in python 2+
    # print line
    # in python 3 print is a builtin function, so
    token, time, method, url, status, response_time = line.split(';')
    url = url.replace("/api/", "/")
    token = token.split()[-1]
    
    dayWeek, dayMonth, month, year, hour, loc = time.split()    
    print("Token: " + token)
    print("Time: " + time)
    print("Method: " + method)
    print("URL: " + url)
    print("Status: " + status)
    print("Response Time: " + response_time)
    # use realine() to read next line
    if not url in data_by_url:
        data_by_url['%s' %(url)] = {'GET' : {}, 'POST': {}}

    per_month = {
        "total_req": [0,0,0,0,0,0,0,0,0,0,0,0],
        "req_ids": [[],[],[],[],[],[],[],[],[],[],[],[]]
    }
    
    if (not year in data_by_url['%s' %(url)]['%s' %(method)]):
        data_by_url['%s' %(url)]['%s' %(method)]['%s' %(year)] = per_month        
        
    data_by_url['%s' %(url)]['%s' %(method)]['%s' %(year)]["total_req"][months[month]] += 1
    data_by_url['%s' %(url)]['%s' %(method)]['%s' %(year)]["req_ids"][months[month]].append(token)
    
    if not token in data_by_token:
        data_by_token['%s' %(token)] = {'GET' : [], 'POST': []}
    data_by_token['%s' %(token)]['%s' %(method)].append({"url": url, "time": time})
    
    if (not year in total_requests['%s' %(method)]):
        total_requests['%s' %(method)]['%s' %(year)] = [0,0,0,0,0,0,0,0,0,0,0,0]

    total_requests['%s' %(method)]['%s' %(year)][months[month]] += 1
    
    line = f.readline()
    # print(data_by_url)
    # print(data_by_token)
    # import sys
    # c = sys.stdin.read(1)
f.close()

with open('Logs/stats_by_url.json', 'w') as outfile:
    json.dump(data_by_url, outfile, indent=4)

with open('Logs/stats_total_requests.json', 'w') as outfile:
    json.dump(total_requests, outfile, indent=4)
