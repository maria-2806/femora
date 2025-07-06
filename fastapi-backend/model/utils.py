# model/utils.py

import cv2
import numpy as np
import torch
from skimage.segmentation import slic
from skimage.measure import regionprops

NUM_NODES = 100
NUM_FEATURES = 64

def image_to_graph(image_path, num_nodes=NUM_NODES, num_features=NUM_FEATURES):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Could not load image at {image_path}")

    img = cv2.resize(img, (224, 224))
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    img = clahe.apply(img)
    img = img / 255.0

    segments = slic(img, n_segments=num_nodes, compactness=10, channel_axis=None)
    node_features = []
    node_centroids = []

    for region in regionprops(segments + 1):
        y, x = region.centroid
        node_centroids.append((y, x))
        region_mask = (segments == region.label - 1)
        region_img = img[region_mask]

        features = [
            np.mean(region_img),
            np.std(region_img),
            np.min(region_img),
            np.max(region_img),
        ]

        if len(region_img) > 5:
            hist, _ = np.histogram(region_img, bins=10, range=(0, 1))
            hist = hist / hist.sum() if hist.sum() > 0 else hist
            features.extend(hist)
            features.append(np.median(region_img))
            features.append(np.percentile(region_img, 25))
            features.append(np.percentile(region_img, 75))
            features.append(np.var(region_img))
            features.append(np.ptp(region_img))

        if len(features) > num_features:
            features = features[:num_features]
        else:
            features += [0] * (num_features - len(features))

        node_features.append(features)

    if len(node_features) < num_nodes:
        indices = np.random.choice(len(node_features), num_nodes - len(node_features))
        for idx in indices:
            node_features.append(node_features[idx])
            node_centroids.append(node_centroids[idx])
    elif len(node_features) > num_nodes:
        indices = np.random.choice(len(node_features), num_nodes, replace=False)
        node_features = [node_features[i] for i in indices]
        node_centroids = [node_centroids[i] for i in indices]

    edges = []
    for i in range(num_nodes):
        for j in range(i + 1, num_nodes):
            y1, x1 = node_centroids[i]
            y2, x2 = node_centroids[j]
            dist = np.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2)
            if dist < 50:
                edges.append((i, j))
                edges.append((j, i))

    adj_matrix = np.zeros((num_nodes, num_nodes))
    for edge in edges:
        adj_matrix[edge[0], edge[1]] = 1

    node_features = torch.tensor(node_features, dtype=torch.float)

    if edges:
        edge_index = torch.tensor(list(zip(*edges)), dtype=torch.long)
    else:
        edge_index = torch.tensor([[0, 1], [1, 0]], dtype=torch.long).t()

    return node_features, edge_index, adj_matrix
