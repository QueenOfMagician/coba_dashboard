from fastapi import FastAPI
import json
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Atau spesifik: ["http://localhost:5174"]
    allow_methods=["*"],
    allow_headers=["*"],
)
# ========================
# FLATTEN LOGIC
# ========================

def is_date(value: str):
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except:
        return False


def detect_type(value):
    if isinstance(value, bool):
        return "boolean"
    elif isinstance(value, int):
        return "integer"
    elif isinstance(value, float):
        return "float"
    elif isinstance(value, str):
        if value.isdigit():
            return "integer"
        elif is_date(value):
            return "date"
        else:
            return "string"
    return "string"


def clean_duplicate_path(path_parts):
    cleaned = []
    for part in path_parts:
        if len(cleaned) >= 2 and cleaned[-1] == part and cleaned[-2] == part:
            continue
        cleaned.append(part)
    return cleaned


def flatten_json(data, parent_keys=None):
    if parent_keys is None:
        parent_keys = []

    items = []

    if isinstance(data, dict):
        for k, v in data.items():
            new_keys = parent_keys + [k]
            items.extend(flatten_json(v, new_keys))

    elif isinstance(data, list):
        for i, v in enumerate(data):
            new_keys = parent_keys + [f"[{i}]"]
            items.extend(flatten_json(v, new_keys))

    else:
        cleaned_keys = clean_duplicate_path(parent_keys)
        key = ".".join(cleaned_keys)

        items.append({
            "key": key,
            "value": data,
            "type": detect_type(data)
        })

    return items

def process(data_list):
    result = []

    for row in data_list:
        merged = []

        for k, v in row.items():
            if k == "sjson":
                merged.extend(flatten_json(v, []))
            else:
                merged.extend(flatten_json(v, [k]))

        result.append(merged)

    return result


def load_and_flatten():
    with open("response.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return process(data)


# ========================
# ROUTES
# ========================

@app.get("/")
def root():
    return load_and_flatten()


@app.get("/api/v1/kuesioner/681")
def kuesioner_681():
    return load_and_flatten()


@app.get("/api/v1/kuesioner/pertanyaan/897")
def pertanyaan_897():
    return load_and_flatten()


@app.get("/survey/1/kuesioner/1")
def survey_kuesioner():
    return load_and_flatten()