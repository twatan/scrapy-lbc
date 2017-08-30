## 0. Installation

```
cd ./scrapy
pip install -r requirements.txt
```
Installer virtualenv si nésessaire. https://virtualenvwrapper.readthedocs.io/en/latest/

## 1. Ajuster la configuration (le délai pour le téléchargement etc.)
```
./scrapy/leboncoin/settings.py
```

## 2. Ajouter des mots clés et scores.
```python
# ./scrapy/leboncoin/spiders/leboncoin_spider.py
class LeBonCoinSpider(scrapy.Spider):
    name = 'leboncoin'

    start_urls = []
    keywords = {'terrasse': 1, 'autoroutes': -1, 'simiane': -2}
```

Ou avec yaml
```yml
terrasse: 1
autoroutes: -1
simiane -2
```

## 3. Lancer le spider.
```
cd ./scrapy
# backup
mv ../web/data/leboncoin.json ../web/data/leboncoin_`date +"%m-%d-%y"`.json
scrapy crawl leboncoin -a url='https://www.leboncoin.fr/ventes_immobilieres/offres/...' -a keywords=keywords.yml -o ../web/data/leboncoin.json
```

## 4. Lancer le serveur
```
cd ./web
python -m SimpleHTTPServer
```