from __future__ import annotations

import json
import os
import re
import time
from pathlib import Path
from typing import Iterable

import requests
from bs4 import BeautifulSoup, NavigableString

ROOT = Path(__file__).resolve().parents[1]
ENGLISH = ROOT / "en"
LANGUAGES = {
    "es": "es",
    "pt-br": "pt-BR",
    "fr": "fr",
    "de": "de",
    "it": "it",
    "ja": "ja",
    "ko": "ko",
    "zh": "zh-CN",
}
SEPARATOR = "\n<<<ARTICLE_SEGMENT>>>\n"
SKIP_TAGS = {"script", "style", "code", "pre", "noscript"}

session = requests.Session()
session.headers.update({"User-Agent": "3dprintmaxxing-article-localizer/1.0"})
cache: dict[tuple[str, str], str] = {}


def translate_batch(values: list[str], target: str) -> list[str]:
    if not values:
        return []
    key = (target, SEPARATOR.join(values))
    if key in cache:
        return cache[key]
    joined = SEPARATOR.join(values)
    if len(joined) > 3600 and len(values) > 1:
        midpoint = max(1, len(values) // 2)
        return translate_batch(values[:midpoint], target) + translate_batch(values[midpoint:], target)
    for attempt in range(5):
        try:
            response = session.get(
                "https://translate.googleapis.com/translate_a/single",
                params={"client": "gtx", "sl": "en", "tl": target, "dt": "t", "q": joined},
                timeout=60,
            )
            response.raise_for_status()
            payload = response.json()
            translated = "".join(part[0] for part in payload[0] if part and part[0])
            result = translated.split(SEPARATOR)
            if len(result) == len(values):
                cache[key] = result
                return result
        except Exception:
            pass
        time.sleep(2 + attempt * 2)
    if len(values) == 1:
        return values
    midpoint = max(1, len(values) // 2)
    return translate_batch(values[:midpoint], target) + translate_batch(values[midpoint:], target)


def text_nodes(soup: BeautifulSoup) -> list[NavigableString]:
    nodes: list[NavigableString] = []
    for node in soup.find_all(string=True):
        parent = node.parent
        if parent is None or parent.name in SKIP_TAGS:
            continue
        if not node.strip():
            continue
        if re.fullmatch(r"[\\W\\d_]+", node.strip(), flags=re.UNICODE):
            continue
        nodes.append(node)
    return nodes


def localize(path: Path, target: str) -> None:
    soup = BeautifulSoup((ENGLISH / path.name).read_text(encoding="utf-8"), "html.parser")
    if soup.html:
        soup.html["lang"] = target
    nodes = text_nodes(soup)
    records: list[tuple[NavigableString, str, str, str]] = []
    for node in nodes:
        raw = str(node)
        lead = raw[: len(raw) - len(raw.lstrip())]
        trail = raw[len(raw.rstrip()) :]
        records.append((node, raw.strip(), lead, trail))
    for start in range(0, len(records), 24):
        batch = records[start : start + 24]
        values = [item[1] for item in batch]
        for (node, _, lead, trail), translated in zip(batch, translate_batch(values, target)):
            node.replace_with(f"{lead}{translated}{trail}")
        time.sleep(0.15)
    for meta in soup.find_all("meta"):
        if meta.get("name") in {"description", "og:description"} and meta.get("content"):
            meta["content"] = translate_batch([meta["content"]], target)[0]
    destination = ROOT / path.parent.name / path.name
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(str(soup), encoding="utf-8")
    print(destination)


if __name__ == "__main__":
    articles = sorted(ENGLISH.glob("article-*.html"))
    for folder, target in LANGUAGES.items():
        for article in articles:
            localize(article, target)
