# model/model.py

import torch
import torch.nn as nn
import torch.nn.functional as F

class GraphConvolution(nn.Module):
    def __init__(self, in_features, out_features, bias=True):
        super(GraphConvolution, self).__init__()
        self.weight = nn.Parameter(torch.FloatTensor(in_features, out_features))
        self.bias = nn.Parameter(torch.FloatTensor(out_features)) if bias else None
        self.reset_parameters()

    def reset_parameters(self):
        nn.init.xavier_uniform_(self.weight.data)
        if self.bias is not None:
            nn.init.zeros_(self.bias.data)

    def forward(self, x, adj):
        support = torch.mm(x, self.weight)
        output = torch.mm(adj, support)
        return output + self.bias if self.bias is not None else output


class HierarchicalGCN(nn.Module):
    def __init__(self, nfeat, nhid, nclass, dropout=0.5):
        super(HierarchicalGCN, self).__init__()
        self.gc1 = GraphConvolution(nfeat, nhid)
        self.gc2 = GraphConvolution(nhid, nhid)
        self.gc3 = GraphConvolution(nhid, nhid)
        self.gc4 = GraphConvolution(nhid, nhid)
        self.fc = nn.Linear(nhid, nclass)
        self.dropout = dropout
        self.pool_ratio = 0.5
        self.pool_layer = nn.Linear(nhid, 1)

    def pool_nodes(self, x, adj):
        scores = torch.sigmoid(self.pool_layer(x).squeeze())
        num_to_keep = int(x.size(0) * self.pool_ratio)
        _, indices = torch.topk(scores, k=num_to_keep)
        x_pooled = x[indices]
        adj_pooled = adj[indices][:, indices]
        return x_pooled, adj_pooled

    def forward(self, x, adj):
        x = F.relu(self.gc1(x, adj))
        x = F.dropout(x, self.dropout, training=self.training)
        x = F.relu(self.gc2(x, adj))
        x, adj = self.pool_nodes(x, adj)
        x = F.relu(self.gc3(x, adj))
        x = F.dropout(x, self.dropout, training=self.training)
        x = F.relu(self.gc4(x, adj))
        x = torch.mean(x, dim=0, keepdim=True)
        x = self.fc(x)
        return F.log_softmax(x, dim=1)
