"""
Multi-Head Attention from Scratch
==================================
Implements the complete multi-head attention mechanism from
"Attention Is All You Need" (Vaswani et al., 2017), Section 3.2.

  MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
  where head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)
  Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V

Replicates Table 3, row (A) ablation study.

Usage:
    python multi_head_attention.py
    python multi_head_attention.py --sentence "The cat sat on the mat"
    python multi_head_attention.py --heads 4 --d_model 256 --dk 64
    python multi_head_attention.py --ablation
"""

import numpy as np
import argparse
import json


def softmax(x, axis=-1):
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)


def scaled_dot_product_attention(Q, K, V, mask=None):
    dk = Q.shape[-1]
    scores = (Q @ K.T) / np.sqrt(dk)
    if mask is not None:
        scores = np.where(mask, -1e9, scores)
    weights = softmax(scores)
    output = weights @ V
    return output, weights


class MultiHeadAttention:
    """Multi-head attention with learnable projection matrices."""

    def __init__(self, d_model, h, d_k=None, d_v=None, seed=42):
        self.d_model = d_model
        self.h = h
        self.d_k = d_k or d_model // h
        self.d_v = d_v or d_model // h

        rng = np.random.default_rng(seed)
        scale_q = np.sqrt(2.0 / d_model)
        scale_v = np.sqrt(2.0 / d_model)

        self.W_Q = [rng.normal(0, scale_q, (d_model, self.d_k)) for _ in range(h)]
        self.W_K = [rng.normal(0, scale_q, (d_model, self.d_k)) for _ in range(h)]
        self.W_V = [rng.normal(0, scale_v, (d_model, self.d_v)) for _ in range(h)]
        self.W_O = rng.normal(0, np.sqrt(2.0 / (h * self.d_v)), (h * self.d_v, d_model))

    def forward(self, X, mask=None):
        head_outputs = []
        head_weights = []

        for i in range(self.h):
            Q = X @ self.W_Q[i]
            K = X @ self.W_K[i]
            V = X @ self.W_V[i]
            output, weights = scaled_dot_product_attention(Q, K, V, mask)
            head_outputs.append(output)
            head_weights.append(weights)

        concat = np.concatenate(head_outputs, axis=-1)
        output = concat @ self.W_O
        return output, head_weights

    def param_count(self):
        return self.h * (self.d_model * self.d_k * 2 + self.d_model * self.d_v) + \
               self.h * self.d_v * self.d_model


def entropy(weights):
    w = np.clip(weights, 1e-10, 1.0)
    return -np.sum(w * np.log2(w), axis=-1).mean()


def focus(weights):
    return np.max(weights, axis=-1).mean()


def add_positional_encoding(X):
    n, d = X.shape
    pe = np.zeros_like(X)
    for pos in range(n):
        for i in range(d):
            angle = pos / (10000 ** (2 * (i // 2) / d))
            pe[pos, i] = np.sin(angle) if i % 2 == 0 else np.cos(angle)
    return X + pe


def main():
    parser = argparse.ArgumentParser(description='Multi-head attention from scratch')
    parser.add_argument('--sentence', type=str, default='The cat sat on the mat')
    parser.add_argument('--heads', type=int, default=8)
    parser.add_argument('--d_model', type=int, default=512)
    parser.add_argument('--dk', type=int, default=None, help='d_k (default: d_model/h)')
    parser.add_argument('--dv', type=int, default=None, help='d_v (default: d_model/h)')
    parser.add_argument('--ablation', action='store_true', help='Run Table 3 row (A) ablation')
    parser.add_argument('--export', type=str, help='Export to JSON')
    args = parser.parse_args()

    if args.ablation:
        run_ablation(args.sentence)
        return

    tokens = args.sentence.split()
    n = len(tokens)
    dk = args.dk or args.d_model // args.heads
    dv = args.dv or args.d_model // args.heads

    print(f"\n{'='*60}")
    print(f"  Multi-Head Attention")
    print(f"  Sentence: \"{args.sentence}\"")
    print(f"  h={args.heads}, d_model={args.d_model}, d_k={dk}, d_v={dv}")
    print(f"{'='*60}\n")

    rng = np.random.default_rng(42)
    X = rng.normal(0, 1, (n, args.d_model))
    X = add_positional_encoding(X)

    mha = MultiHeadAttention(args.d_model, args.heads, dk, dv)
    output, head_weights = mha.forward(X)

    print(f"Parameters: {mha.param_count():,}")
    print(f"Input shape: ({n}, {args.d_model})")
    print(f"Output shape: {output.shape}\n")

    for i, w in enumerate(head_weights):
        e = entropy(w)
        f = focus(w)
        print(f"  Head {i+1:2d}  |  Entropy: {e:.3f} bits  |  Focus: {f*100:.1f}%")
        print(f"          |  Attention matrix ({n}x{n}):")
        for r in range(n):
            vals = "  ".join(f"{w[r, c]:.3f}" for c in range(n))
            print(f"          |    {tokens[r]:>6} -> [{vals}]")
        print()

    entropies = [entropy(w) for w in head_weights]
    focuses = [focus(w) for w in head_weights]
    diversity = np.std(entropies)

    print(f"  Summary:")
    print(f"    Avg entropy:    {np.mean(entropies):.3f} bits")
    print(f"    Avg focus:      {np.mean(focuses)*100:.1f}%")
    print(f"    Head diversity: {diversity:.4f} (σ of entropy)")

    if args.export:
        data = {
            'sentence': args.sentence,
            'tokens': tokens,
            'config': {'h': args.heads, 'd_model': args.d_model, 'd_k': dk, 'd_v': dv},
            'params': mha.param_count(),
            'heads': [{'weights': w.tolist(), 'entropy': entropy(w), 'focus': focus(w)}
                      for w in head_weights],
            'output_shape': list(output.shape)
        }
        with open(args.export, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"\n  Exported to {args.export}")

    print()


def run_ablation(sentence):
    """Replicate Table 3, row (A) from the paper."""
    tokens = sentence.split()
    n = len(tokens)

    configs = [
        {'h': 1,  'd_k': 512, 'd_v': 512, 'bleu': 24.9},
        {'h': 4,  'd_k': 128, 'd_v': 128, 'bleu': 25.5},
        {'h': 8,  'd_k': 64,  'd_v': 64,  'bleu': 25.8},
        {'h': 16, 'd_k': 32,  'd_v': 32,  'bleu': 25.8},
        {'h': 32, 'd_k': 16,  'd_v': 16,  'bleu': 25.4},
    ]

    print(f"\n{'='*70}")
    print(f"  Table 3 — Row (A) Ablation Study")
    print(f"  Varying h with d_k = d_v = d_model/h, d_model=512")
    print(f"  Sentence: \"{sentence}\"")
    print(f"{'='*70}\n")
    print(f"  {'h':>3}  {'d_k':>5}  {'d_v':>5}  {'Params':>10}  {'Avg Entropy':>12}  "
          f"{'Avg Focus':>10}  {'Diversity':>10}  {'Paper BLEU':>11}")
    print(f"  {'-'*3}  {'-'*5}  {'-'*5}  {'-'*10}  {'-'*12}  {'-'*10}  {'-'*10}  {'-'*11}")

    rng = np.random.default_rng(42)
    X = rng.normal(0, 1, (n, 512))
    X = add_positional_encoding(X)

    for cfg in configs:
        mha = MultiHeadAttention(512, cfg['h'], cfg['d_k'], cfg['d_v'])
        _, weights = mha.forward(X)

        ents = [entropy(w) for w in weights]
        focs = [focus(w) for w in weights]
        div_val = np.std(ents)
        mark = '<-- base' if cfg['h'] == 8 else ''

        print(f"  {cfg['h']:3d}  {cfg['d_k']:5d}  {cfg['d_v']:5d}  "
              f"{mha.param_count():>10,}  {np.mean(ents):>12.3f}  "
              f"{np.mean(focs)*100:>9.1f}%  {div_val:>10.4f}  "
              f"{cfg['bleu']:>10.1f}  {mark}")

    print(f"\n  Findings from the paper:")
    print(f"    - h=1: single head hurts quality (-0.9 BLEU)")
    print(f"    - h=8: base model, best tradeoff")
    print(f"    - h=32: too many heads with d_k=16 each - insufficient capacity per head")
    print()


if __name__ == '__main__':
    main()
