# Attention Is All You Need — Transformer Attention Lab & Implementation

An interactive implementation, extraction engine, and visualization laboratory based on the foundational research paper [**"Attention Is All You Need"** (Vaswani et al., NeurIPS 2017)](https://arxiv.org/abs/1706.03762).

This repository provides both a Python-based attention extraction engine running real translation models (`Helsinki-NLP/opus-mt-en-de`) and a browser-based interactive laboratory for exploring multi-head attention mechanisms, matrix projections, causal masking, and ablation studies.

---

## 🌟 Key Features

- **Interactive Multi-Head Attention Comparator (`multi-head-attention.html`)**:
  - Live computation of Scaled Dot-Product Attention: $\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$.
  - Real-time parameter controls for head count ($h$), model dimensionality ($d_{\text{model}}$), key/query dimensionality ($d_k$), and value dimensionality ($d_v$).
  - Dynamic parameter count estimation and compute complexity breakdown.
  - Head entropy analysis and focus metrics replicating Table 3 Row (A) ablation experiments.
  - Interactive token alignment explorer with attention weight highlights.

- **Real Transformer Attention Extractor (`transformer_attention.py`)**:
  - Leverages Hugging Face's pre-trained `MarianMT` encoder-decoder architecture (`Helsinki-NLP/opus-mt-en-de`) for English $\rightarrow$ German translation.
  - Extracts and visualizes all three attention mechanisms defined in Section 3.2.3:
    1. **Encoder Self-Attention**: Bidirectional contextual representations across all source tokens.
    2. **Decoder Masked Self-Attention**: Autoregressive causal lower-triangular mask preventing attention to future positions.
    3. **Encoder-Decoder Cross-Attention**: Alignment queries from decoder target tokens attending over encoder keys and values.
  - Terminal-based visualization of attention matrices and ASCII causal mask heatmaps.
  - Computes per-head Shannon entropy and representation diversity metrics.
  - Exports attention tensors and token mappings to JSON for visual analytics.

---

## 🧠 Core Architecture & Mathematical Foundations

### 1. Scaled Dot-Product Attention
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
Where $Q \in \mathbb{R}^{n \times d_k}$, $K \in \mathbb{R}^{m \times d_k}$, and $V \in \mathbb{R}^{m \times d_v}$. The scaling factor $\frac{1}{\sqrt{d_k}}$ prevents vanishing gradients in the softmax function for large dimensions.

### 2. Multi-Head Attention
$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$$
$$\text{where} \quad \text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$
Allows the model to jointly attend to information from different representation subspaces at different positions.

### 3. The Three Attention Applications (Section 3.2.3)
| Mechanism | Query Source ($Q$) | Key/Value Source ($K, V$) | Masking |
| :--- | :--- | :--- | :--- |
| **Encoder Self-Attention** | Encoder Layer $l-1$ | Encoder Layer $l-1$ | None (All positions attend to all) |
| **Decoder Self-Attention** | Decoder Layer $l-1$ | Decoder Layer $l-1$ | Causal Mask ($-\infty$ where $j > i$) |
| **Cross-Attention** | Decoder Layer $l-1$ | Final Encoder Output | None (Target queries source context) |

---

## 📁 Repository Structure

```
├── multi-head-attention.html   # Interactive visualizer & ablation lab (Single-file HTML/CSS/JS)
├── transformer_attention.py    # PyTorch/Transformers extraction backend & CLI lab
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 1. Installation

Clone the repository and install the Python dependencies:

```bash
git clone https://github.com/workspace220106/Attention-Is-All-You-Need-Implementation.git
cd Attention-Is-All-You-Need-Implementation

# (Optional) Create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

---

## 💻 Usage

### 1. Running the Python Attention Lab

#### Run Standard Demo Sentences
Runs full translations on preset demo sentences and outputs formatted attention matrices:
```bash
python transformer_attention.py
```

#### Translate a Custom Sentence
```bash
python transformer_attention.py --sentence "Artificial intelligence transforms modern technology"
```

#### Interactive Mode
Launch an interactive CLI prompt to translate sentences and inspect attention distributions on the fly:
```bash
python transformer_attention.py --interactive
```

#### Export Attention Weights for Frontend
Save extracted weights to `attention_data.json` to load into visualization tools:
```bash
python transformer_attention.py --output attention_data.json
```

### 2. Using the Interactive Visual Lab (`multi-head-attention.html`)

Simply open `multi-head-attention.html` directly in your web browser:
- **Windows**: Double click `multi-head-attention.html` or run `start multi-head-attention.html`
- **macOS**: `open multi-head-attention.html`
- **Linux**: `xdg-open multi-head-attention.html`

#### Interactive Features:
1. **Multi-Head Comparator Tab**:
   - Tweak head counts ($h$) from 1 to 32 and model dimension ($d_{\text{model}}$) up to 1024.
   - Observe real-time changes in matrix sizes, projection parameter counts, and attention heatmaps.
   - Inspect individual head entropy and focus distributions.
2. **Translator & Attention Inspector Tab**:
   - Hover and click source / target tokens to visualize token-to-token cross-attention weights.
   - Switch between Encoder Self-Attention, Masked Decoder Self-Attention, and Cross-Attention views.

---

## 📊 Key Insights & Ablation Findings

This project highlights key findings from Table 3 (Row A) of Vaswani et al. (2017):
- **Too few heads ($h=1$)**: Subspace representation collapses, degrading translation BLEU score by ~0.9.
- **Optimal heads ($h=8, 16$)**: Balances subspace separation and representation capacity per head ($d_k = d_v = d_{\text{model}} / h = 64$).
- **Too many heads ($h=32, d_k=16$)**: The dimension per head becomes too small to capture rich key-query relationships, causing performance drops.

---

## 📜 Citation & References

```bibtex
@inproceedings{vaswani2017attention,
  title     = {Attention is All You Need},
  author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\L}ukasz and Polosukhin, Illia},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  volume    = {30},
  year      = {2017},
  url       = {https://arxiv.org/abs/1706.03762}
}
```

---

## 📄 License

MIT License. See individual files for additional details.
