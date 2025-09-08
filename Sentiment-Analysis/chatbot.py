import os
os.environ['TRANSFORMERS_NO_TF'] = '1'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import re
import json
import pickle
import joblib
import torch
import numpy as np
from pathlib import Path
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification
)
from torch_geometric.nn import GCNConv
import torch.nn as nn
import torch.nn.functional as F

# === GNN Refiner Model Class ===
class GNNRefiner(nn.Module):
    def __init__(self, edge_index, edge_weight=None, hidden=64):
        super().__init__()
        self.edge_index = edge_index
        self.edge_weight = edge_weight
        self.gcn1 = GCNConv(1, hidden)
        self.gcn2 = GCNConv(hidden, 1)
        self.dropout = nn.Dropout(0.2)

    def forward(self, x):
        # x: (batch, num_emotions) logits
        outs = []
        for i in range(x.size(0)):
            xi = x[i].unsqueeze(1)  # (num_emotions, 1)
            h = F.relu(self.gcn1(xi, self.edge_index, self.edge_weight))
            h = self.dropout(h)
            delta = self.gcn2(h, self.edge_index, self.edge_weight).squeeze(1)  # (num_emotions,)
            outs.append(x[i] + 0.5 * delta)  # residual with small step
        return torch.stack(outs, dim=0)

# === Load DistilBERT model ===
model_dir = Path(__file__).parent / "distilbert"
distilbert_model = DistilBertForSequenceClassification.from_pretrained(str(model_dir / "distilbert_model"))
distilbert_tokenizer = DistilBertTokenizerFast.from_pretrained(str(model_dir / "distilbert_tokenizer"))
mlb = joblib.load(str(model_dir / "label_binarizer.pkl"))
emotion_columns = mlb.classes_

with open(model_dir / "metadata.pkl", "rb") as f:
    metadata = pickle.load(f)
max_len = metadata["max_len"]

# === Load GNN refiner ===
gnn_path = Path(__file__).parent / "gnn"

try:
    # Load GNN components
    gnn_metadata = joblib.load(gnn_path / "metadata.pkl")
    gnn_label_binarizer = joblib.load(gnn_path / "label_binarizer.pkl")
    
    # Load edge index and weights
    edge_index = torch.load(gnn_path / "edge_index.pt", map_location='cpu')
    edge_weight = torch.load(gnn_path / "edge_weight.pt", map_location='cpu')
    
    # Initialize and load GNN model
    gnn_refiner = GNNRefiner(edge_index, edge_weight)
    gnn_refiner.load_state_dict(torch.load(gnn_path / "gnn_state_dict.pth", map_location='cpu'))
    gnn_refiner.eval()
    
    # Get optimal thresholds
    #optimal_thresholds = gnn_metadata['optimal_thresholds']['per_label_thresholds']
    global_threshold = gnn_metadata['optimal_thresholds']['global_threshold']
    optimal_thresholds = [
        0.91,  # admiration (1.00/1.00/1.00 → very strong)
        0.85,  # amusement (0.75 recall)
        0.65,  # anger (0.44 recall, weaker)
        0.94,  # annoyance (0.88 recall, strong)
        0.99,  # approval (perfect)
        0.84,  # caring (0.75 recall)
        0.70,  # confusion (0.44 recall)
        0.92,  # curiosity (0.88 recall)
        0.75,  # desire (0.50 recall)
        0.80,  # disappointment (0.71 recall)
        0.95,  # disapproval (perfect)
        0.95,  # disgust (perfect)
        0.70,  # embarrassment (0.50 recall)
        0.92,  # excitement (0.88 recall)
        0.85,  # fear (0.75 recall)
        0.85,  # gratitude (0.75 recall)
        0.05,  # grief (0.00 recall → allow low threshold)
        0.88,  # joy (0.88 recall)
        0.75,  # love (0.71 recall)
        0.10,  # nervousness (0.14 recall → very low)
        0.40,  # optimism (0.25 recall)
        0.90,  # pride (0.86 recall)
        0.30,  # realization (0.12 recall → very weak)
        0.30,  # relief (0.25 recall)
        0.85,  # remorse (0.75 recall)
        0.65,  # sadness (0.56 recall)
        0.05,  # surprise (0.22 recall → weak)
        0.98 # neutral
    ]
    
    GNN_AVAILABLE = True
    
except Exception as e:
    print(f"⚠️ GNN refiner not available: {e}")
    print("   Falling back to DistilBERT only")
    gnn_refiner = None
    optimal_thresholds = None
    global_threshold = 0.9
    GNN_AVAILABLE = False

# === Emotion Prediction ===
def predict_emotions(text, threshold=0.8, use_gnn=True):
    """
    Predict emotions from preprocessed text using DistilBERT + GNN refiner.
    Text is already translated and preprocessed.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    distilbert_model.to(device)
    distilbert_model.eval()

    inputs = distilbert_tokenizer(
        text,
        padding=True,
        truncation=True,
        max_length=max_len,
        return_tensors="pt"
    ).to(device)

    with torch.no_grad():
        outputs = distilbert_model(**inputs)
        logits = outputs.logits
        
        # Apply GNN refinement if available
        if use_gnn and GNN_AVAILABLE and gnn_refiner is not None:
            gnn_refiner.to(device)
            gnn_refiner.eval()
            refined_logits = gnn_refiner(logits)
            probs = torch.sigmoid(refined_logits).cpu().numpy()[0]
            
            # Use optimal thresholds from GNN training
            if optimal_thresholds is not None:
                predictions = (probs >= optimal_thresholds).astype(int)
                # Get emotions where prediction is 1 AND confidence >= threshold
                predicted_emotions = []
                for i, pred in enumerate(predictions):
                    if pred == 1 and probs[i] >= threshold:  # Add threshold check here
                        predicted_emotions.append((emotion_columns[i], float(probs[i])))
                predicted_emotions.sort(key=lambda x: x[1], reverse=True)
                return predicted_emotions
            else:
                # Fallback to global threshold
                probs = torch.sigmoid(refined_logits).cpu().numpy()[0]
        else:
            # Use original DistilBERT only
            probs = torch.sigmoid(logits).cpu().numpy()[0]

    emotion_confidences = [
        (emotion_columns[i], float(prob))
        for i, prob in enumerate(probs)
        if prob >= threshold
    ]

    emotion_confidences.sort(key=lambda x: x[1], reverse=True)
    return emotion_confidences
