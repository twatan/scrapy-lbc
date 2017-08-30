 #!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import scrapy
import yaml


class LeBonCoinSpider(scrapy.Spider):
    name = 'leboncoin'

    start_urls = []
    keywords = {}

    def __init__(self, url=None, keywords=None, *args, **kwargs):
        super(LeBonCoinSpider, self).__init__(*args, **kwargs)
        if url:
            self.start_urls.append(url)
        if keywords:
            with open(keywords, 'r') as f:
                self.keywords = yaml.load(f)

    def parse(self, response):
        # follow pager links to offer pages
        for href in response.xpath('//li[@itemtype="http://schema.org/Offer"]/a/@href'):
            yield response.follow(href, self.parse_offer)

        # follow pagination links
        for href in response.xpath('//a[@id="next"]'):
            yield response.follow(href, self.parse)

    def parse_offer(self, response):
        def extract_with_xpath(query):
            return response.xpath(query).extract_first().strip()

        surface = ''
        nb_room = ''
        for line in response.xpath('//div[contains(@class, "line")]'):
            prop = line.xpath('.//span[@class="property"]/text()').extract_first()
            value = line.xpath('.//span[@class="value"]/text()').extract_first()
            if None in (prop, value):
                continue
            prop = prop.strip()
            value = value.strip()
            if (prop == 'Surface'):
                surface = value.replace(' m', '')
            elif (prop == 'Pièces'):
                nb_room = value

        description = response.xpath('//div[contains(@class, "properties_description")]').xpath('.//p[@class="value"]').extract_first()
        if not description:
            description = ''

        result = self.score(description)

        yield {
                'url': response.url,
                #price
                'y': extract_with_xpath('//h2[contains(@class,"item_price")]/@content'),
                'address': extract_with_xpath('//div[contains(@class,"line_city")]//span[contains(@class, "value")]/text()'),
                'title': extract_with_xpath('//h1/text()'),
                'description': description,
                #surface
                'x': surface,
                'nb_rooms': nb_room,
                'score': result['score'],
                'negative': result['negative_words'],
                'positive': result['positive_words']
                }

    def score(self, description):
        description = description.lower()
        negative = 0
        positive = 0
        result = {'negative_words': [], 'positive_words': [], 'score': 0}

        for word in self.keywords:
            if word in description:
                value = self.keywords[word]
                result['score'] += value
                if (value < 0):
                    result['negative_words'].append(word)
                else:
                    result['positive_words'].append(word)
        return result

