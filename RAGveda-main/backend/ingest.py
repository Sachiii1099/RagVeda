import os
import json
from typing import List, Dict, Any
from backend.models import LegalChunk

class LegalCorpusIngestor:
    def __init__(self, data_dir: str = None):
        if not data_dir:
            base_path = os.path.dirname(os.path.abspath(__file__))
            self.data_dir = os.path.join(base_path, "data", "statutes")
        else:
            self.data_dir = data_dir
        self.chunks: List[LegalChunk] = []
        self._load_corpus()

    def _load_corpus(self):
        if not os.path.exists(self.data_dir):
            return
        
        statute_files = [f for f in os.listdir(self.data_dir) if f.endswith(".json")]
        for file_name in statute_files:
            file_path = os.path.join(self.data_dir, file_name)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for item in data:
                            self.chunks.append(LegalChunk(**item))
                    elif isinstance(data, dict) and "chunks" in data:
                        for item in data["chunks"]:
                            self.chunks.append(LegalChunk(**item))
            except Exception as e:
                print(f"Error loading {file_name}: {e}")

    def get_all_chunks(self) -> List[LegalChunk]:
        return self.chunks

    def filter_by_jurisdiction(self, jurisdiction: str) -> List[LegalChunk]:
        j_lower = jurisdiction.lower()
        if j_lower == "all":
            return self.chunks
        if j_lower == "india":
            return [c for c in self.chunks if "india" in c.jurisdiction.lower()]
        if j_lower == "international":
            return [c for c in self.chunks if "international" in c.jurisdiction.lower()]
        return self.chunks

    def get_chunk_by_id(self, chunk_id: str) -> LegalChunk:
        for c in self.chunks:
            if c.chunk_id == chunk_id:
                return c
        return None
