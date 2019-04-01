import urllib.request
import logging
logging.basicConfig(level=logging.INFO)
logging.info('Started')
url = urllib.request.urlopen('https://www.amfiindia.com/spages/NAVAll.txt')
mfDict = {}
logging.info('Fetching NAV Data')
for line in url:
    line = line.decode('utf-8')
    if ';' in line:
        row = line.split(';')
        try:
            code = int(row[0])
            mf = {}
            mf['code'] = code
            mf['name'] = row[3]
            mf['nav']  = row[4]
            mf['date'] = row[5].replace('\r\n','')
            mfDict[code] = mf
        except:
            pass
import json
logging.info('Writing to JSON file')
with open('nav.json','w') as fp:
    json.dump([mfDict],fp)
logging.info('Done')