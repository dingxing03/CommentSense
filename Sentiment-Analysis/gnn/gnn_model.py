import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv

class GNNRefiner(nn.Module):
    def __init__(self, num_emotions, edge_index):
        super(GNNRefiner, self).__init__()
        self.edge_index = edge_index
        # Change input dimension to 1 since each node has a single feature (the initial logit)
        self.gcn1 = GCNConv(in_channels=1, out_channels=64)
        self.gcn2 = GCNConv(in_channels=64, out_channels=1)  # Output should be 1 per node
        self.dropout = nn.Dropout(0.2)

    def forward(self, x):
        # x has shape (batch_size, num_emotions)
        refined_logits_list = []
        for i in range(x.size(0)):
            sample_logits = x[i] 
            # Reshape to (num_emotions, 1) - each node has 1 feature
            x_gcn = sample_logits.unsqueeze(1)  # (num_emotions, 1)

            x_gcn = F.relu(self.gcn1(x_gcn, self.edge_index)) 
            x_gcn = self.dropout(x_gcn)
            x_gcn = self.gcn2(x_gcn, self.edge_index) 

            # Remove the extra dimension
            refined_logits = x_gcn.squeeze(1)  # (num_emotions,)
            refined_logits_list.append(refined_logits)

        refined_logits = torch.stack(refined_logits_list, dim=0)  # (batch_size, num_emotions)
        return refined_logits
