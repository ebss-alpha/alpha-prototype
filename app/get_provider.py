from gazpacho import get, Soup
import time
providers = [ "Affect Energy", "Atlantic", "Boost", "British Gas", "British Gas Evolve", "Bulb Energy", "Co-op Energy", "E (Gas and Electricity)", "Ecotricity", "E.ON", "E.ON Next", "EDF", "GEUK (Green Energy UK)", "Good Energy", "London Power", "M&S Energy", "Nabuh Energy", "Octopus Energy", "Outfox the Market", "OVO", "Rebel Energy", "Sainsbury's Energy", "Scottish Gas", "Scottish Hydro", "ScottishPower", "Shell Energy Retail", "So Energy", "Southern Electric", "SSE", "Swalec", "Utilita", "Utility Warehouse" ]
for provider in providers:
    provider_enc = provider.replace(' ', '%20')
    url = f"http://www.google.com/search?q={provider_enc}%20energy%20bill%20support%20scheme&btnI"
    html = get(url)
    soup = Soup(html)
    print(provider)
    print(soup.find('a')[0].attrs.get('href').encode('utf-8').strip())
    print('----')
    time.sleep(1)
