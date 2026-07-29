import json

def extract_examples():
    with open("data/vocab.json", "r", encoding="utf-8") as f:
        vocab_data = json.load(f)

    with open("data/scenarios.json", "r", encoding="utf-8") as f:
        scenarios_data = json.load(f)

    # 1. Extract 850 Examples
    v850_items = vocab_data.get("vocab850", [])
    sentences_850 = []
    for item in v850_items:
        if item.get("exEn") and item.get("exCn"):
            sentences_850.append({
                "en": item["exEn"],
                "cn": item["exCn"],
                "ipa": item.get("ipa", ""),
                "vocab": [{"word": item["word"], "cn": item["cn"]}]
            })

    # Group into chunks of 10 sentences per topic
    topic_850 = {
        "id": "vocab_850_examples",
        "title": "📘 850核心词全量精选例句",
        "subtitle": f"汇集 850 核心词库共 {len(sentences_850)} 句经典例句听读",
        "sentences": sentences_850
    }

    # 2. Extract 2000 Examples
    v2000_items = vocab_data.get("vocab2000", [])
    sentences_2000 = []
    for item in v2000_items[:100]: # Take top 100 high-frequency examples
        if item.get("exEn") and item.get("exCn"):
            sentences_2000.append({
                "en": item["exEn"],
                "cn": item["exCn"],
                "ipa": item.get("ipa", ""),
                "vocab": [{"word": item["word"], "cn": item["cn"]}]
            })

    topic_2000 = {
        "id": "vocab_2000_examples",
        "title": "📗 2000日常词精选例句",
        "subtitle": f"精选 Oxford 2000 高频日常词库经典例句",
        "sentences": sentences_2000
    }

    # 3. Extract 3000 Examples
    v3000_items = vocab_data.get("vocab3000", [])
    sentences_3000 = []
    for item in v3000_items[:100]: # Take top 100 gold examples
        if item.get("exEn") and item.get("exCn"):
            sentences_3000.append({
                "en": item["exEn"],
                "cn": item["exCn"],
                "ipa": item.get("ipa", ""),
                "vocab": [{"word": item["word"], "cn": item["cn"]}]
            })

    topic_3000 = {
        "id": "vocab_3000_examples",
        "title": "📙 3000黄金词进阶例句",
        "subtitle": f"精选 Oxford 3000 高级黄金进阶词库例句",
        "sentences": sentences_3000
    }

    # Add new category "vocab_examples" to scenarios_data
    scenarios_data["vocab_examples"] = [
        topic_850,
        topic_2000,
        topic_3000
    ]

    with open("data/scenarios.json", "w", encoding="utf-8") as f:
        json.dump(scenarios_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully extracted vocab examples: 850: {len(sentences_850)}, 2000: {len(sentences_2000)}, 3000: {len(sentences_3000)}")

if __name__ == "__main__":
    extract_examples()
