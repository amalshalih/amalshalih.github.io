import requests
import urllib.parse
import os

titles = {
    "kemensos.png": "File:Logo_Kemensos_(Kementerian_Sosial_Republik_Indonesia).png",
    "baznas.png": "File:Logo_BAZNAS_RI.png",
    "dompet-dhuafa.png": "File:Logo_Dompet_Dhuafa.png",
    "rumah-zakat.png": "File:Rumah_zakat_logo.png",
    "kitabisa.png": "File:Kitabisa.png",
    "pemkab-bantul.png": "File:Lambang_Kabupaten_Bantul.png"
}

os.makedirs('public/partners', exist_ok=True)
headers = {'User-Agent': 'Antigravity/1.0 (https://amalshalih.or.id)'}

for filename, title in titles.items():
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    try:
        res = requests.get(url, headers=headers).json()
        pages = res['query']['pages']
        for page_id in pages:
            if int(page_id) < 0:
                print(f"Not found on Commons: {title}")
                # Try id.wikipedia.org
                url_id = f"https://id.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
                res_id = requests.get(url_id, headers=headers).json()
                pages_id = res_id['query']['pages']
                for p_id in pages_id:
                    if int(p_id) < 0:
                        print(f"Not found on id.wikipedia: {title}")
                        continue
                    if 'imageinfo' in pages_id[p_id]:
                        img_url = pages_id[p_id]['imageinfo'][0]['url']
                        print(f"Downloading {filename} from {img_url}")
                        os.system(f"wget -q -O public/partners/{filename} {img_url}")
                continue
            if 'imageinfo' in pages[page_id]:
                img_url = pages[page_id]['imageinfo'][0]['url']
                print(f"Downloading {filename} from {img_url}")
                os.system(f"wget -q -O public/partners/{filename} {img_url}")
    except Exception as e:
        print(f"Error for {filename}: {e}")
