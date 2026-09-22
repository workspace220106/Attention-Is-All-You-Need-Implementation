# Attention Is All You Need — Transformer Attention Lab & Implementation

An interactive implementation, training framework, extraction engine, and visualization laboratory based on the foundational research paper [**"Attention Is All You Need"** (Vaswani et al., NeurIPS 2017)](https://arxiv.org/abs/1706.03762).

This repository implements all core transformer mechanisms from scratch in pure Python/NumPy (without relying on autograd) alongside pre-trained model extraction via Hugging Face Transformers and an interactive browser-based visual laboratory.

---

## 🌟 Key Features & Components

### 1. 🎛️ Interactive Visual Laboratory (`multi-head-attention.html`)
A standalone, zero-dependency browser application featuring:
- **Multi-Head Attention Comparator**: Real-time scaled dot-product attention $\text{softmax}(QK^T / \sqrt{d_k})V$ computation, dynamic parameter count calculation, and Table 3 Row (A) ablation exploration.
- **Transformer Translator & Attention Inspector**: Interactive token alignment heatmaps for Encoder Self-Attention, Masked Decoder Self-Attention, and Cross-Attention.
- **Sinusoidal Positional Encoding Explorer**: Visual heatmaps and dimension frequencies across positions.
- **Attention Training Sandbox**: Live gradient descent optimization learning $W_Q$ and $W_K$ projections in the browser.
- **Neural Network Playground**: Multi-layer perceptron training on 2D datasets (XOR, circle, spiral, moons) with live decision boundary rendering.

---

### 2. 🐍 Pure NumPy / From-Scratch Python Implementations

#### 🔹 `multi_head_attention.py` — Multi-Head Attention Engine
- Implements $\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$.
- Computes per-head attention weights, Shannon entropy, and focus statistics.
- Includes automated ablation runner replicating Table 3 Row (A) findings.

#### 🔹 `positional_encoding.py` — Sinusoidal Positional Encodings (Section 3.5)
- Computes $PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{\text{model}}})$ and $PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{\text{model}}})$.
- Computes position cosine similarity matrices.
- Mathematically demonstrates the linear transformation property $PE_{pos+k} = M \cdot PE_{pos}$.

#### 🔹 `attention_training.py` — Attention Weight Learning via Hand-Derived Backprop
- Trains $W_Q$ and $W_K$ projection matrices via gradient descent without autograd libraries.
- Implements analytical derivatives through softmax, scaled dot-product, and linear projections.
- Learns diagonal and structured target attention matrices.

#### 🔹 `neural_network.py` — Feedforward Neural Network from Scratch
- Fully vectorized multi-layer perceptron with ReLU and Sigmoid activations.
- Exact backpropagation via the chain rule using pure NumPy.
- Evaluates classification on XOR, Circle, Spiral, and Two-Moons datasets.

---

### 3. 🤖 Pre-Trained Model Attention Extractor (`transformer_attention.py`)
- Loads Hugging Face's `Helsinki-NLP/opus-mt-en-de` model for real English $\rightarrow$ German translation.
- Extracts and visualizes all three attention mechanisms (Section 3.2.3):
  1. **Encoder Self-Attention**: Full bidirectional representation.
  2. **Decoder Masked Self-Attention**: Causal lower-triangular mask.
  3. **Encoder-Decoder Cross-Attention**: Target queries attending to source representations.
- Interactive CLI translation mode and JSON data export.

---

## 🧠 Mathematical Foundations

### Scaled Dot-Product Attention
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
Where $Q, K \in \mathbb{R}^{n \times d_k}$ and $V \in \mathbb{R}^{n \times d_v}$. The scaling factor $\frac{1}{\sqrt{d_k}}$ stabilizes gradients for large dimensions.

### Multi-Head Projection
$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$$
$$\text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

### Sinusoidal Positional Encoding
$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

---

## 📁 Repository Structure

```
├── multi-head-attention.html   # Interactive visual lab (Comparator, Translator, PE, Training, NN)
├── multi_head_attention.py     # Multi-head attention from scratch & ablation runner
├── positional_encoding.py      # Sinusoidal positional encoding & linear property tests
├── attention_training.py       # Hand-derived backprop training of W_Q and W_K
├── neural_network.py           # Multi-layer perceptron & backprop from scratch in NumPy
├── transformer_attention.py    # MarianMT Hugging Face extraction backend & CLI
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # Comprehensive project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.9+
- Modern Web Browser

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/workspace220106/Attention-Is-All-You-Need-Implementation.git
cd Attention-Is-All-You-Need-Implementation

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## 💻 CLI Usage Guide

### 1. Multi-Head Attention from Scratch
```bash
# Run default sentence with 8 heads
python multi_head_attention.py

# Custom parameters
python multi_head_attention.py --sentence "The cat sat on the mat" --heads 4 --d_model 256 --dk 64

# Run Table 3 Row (A) ablation study
python multi_head_attention.py --ablation
```

### 2. Positional Encodings
```bash
# Analyze positional encodings (20 positions, d_model=64)
python positional_encoding.py

# Custom dimension and export JSON
python positional_encoding.py --positions 50 --d_model 128 --export pe_data.json
```

### 3. Attention Weight Training
```bash
# Train W_Q and W_K projection matrices
python attention_training.py

# Custom training configuration
python attention_training.py --tokens 8 --dk 16 --lr 0.1 --steps 500 --export attention_weights.json
```

### 4. Feedforward Neural Network
```bash
# Train on default dataset (circle)
python neural_network.py

# Train on spiral dataset with custom architecture
python neural_network.py --dataset spiral --hidden 12 --lr 0.5 --epochs 5000
```

### 5. Hugging Face Translation & Attention Extractor
```bash
# Run default translation & matrix display
python transformer_attention.py

# Translate custom sentence
python transformer_attention.py --sentence "Artificial intelligence transforms modern technology"

# Interactive CLI translation loop
python transformer_attention.py --interactive

# Export attention data to JSON
python transformer_attention.py --output attention_data.json
```

---

## 🌐 Interactive Web Application

Launch `multi-head-attention.html` directly in your browser:
- **Windows**: Double-click `multi-head-attention.html` or run `start multi-head-attention.html`
- **macOS**: `open multi-head-attention.html`
- **Linux**: `xdg-open multi-head-attention.html`

No build steps or local servers required.

---

## 📜 Citation

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

MIT License.
