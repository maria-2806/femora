from fastapi import FastAPI, UploadFile, File
from model.model import HierarchicalGCN
from model.utils import image_to_graph
import torch
import io
import cv2
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = HierarchicalGCN(nfeat=64, nhid=64, nclass=2, dropout=0.5)
model.load_state_dict(torch.load("model/hierarchical_gcn_model.pth", map_location="cpu"))
model.eval()

@app.post("/scan")
async def predict(file: UploadFile = File(...)):
    # Read file as image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    # Save temp file
    cv2.imwrite("temp.jpg", img)  # Only because image_to_graph expects path

    # Convert image to graph
    node_features, edge_index, adj_matrix = image_to_graph("temp.jpg")

    # Convert edge_index to adjacency matrix
    adj = torch.zeros((node_features.size(0), node_features.size(0)))
    for j in range(edge_index.size(1)):
        adj[edge_index[0, j], edge_index[1, j]] = 1
    adj = adj + torch.eye(adj.size(0))  # Add self-loops

    # Normalize
    rowsum = adj.sum(1)
    d_inv_sqrt = torch.pow(rowsum, -0.5)
    d_inv_sqrt[torch.isinf(d_inv_sqrt)] = 0.
    d_mat_inv_sqrt = torch.diag(d_inv_sqrt)
    adj = torch.mm(torch.mm(d_mat_inv_sqrt, adj), d_mat_inv_sqrt)

    # Run prediction
    with torch.no_grad():
        output = model(node_features, adj)
        probs = torch.exp(output).numpy().flatten()
        pred = int(probs.argmax())

    return {
        "prediction": pred,
        "probability_pcos": round(float(probs[1]), 4),
        "probability_normal": round(float(probs[0]), 4)
    }
