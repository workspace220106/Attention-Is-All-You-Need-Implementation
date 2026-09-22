"""
Attention Weight Training via Gradient Descent
===============================================
Learns W_Q and W_K projection matrices so the attention pattern
converges to a target (identity matrix = each token attends to itself).

Implements backpropagation through:
  softmax → scaled dot-product → linear projections

All gradients computed by hand using NumPy — no autograd.

Usage:
    python attention_training.py
    python attention_training.py --tokens 8 --dk 16 --lr 0.1 --steps 500
    python attention_training.py --target diagonal --export attention_weights.json
"""

import numpy as np
import argparse
import json
import time


def softmax(x):
    e = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)


def scaled_dot_product_attention(Q, K, dk):
    scores = (Q @ K.T) / np.sqrt(dk)
    weights = softmax(scores)
    return weights, scores


def cross_entropy_loss(attn, target):
    return -np.mean(np.sum(target * np.log(np.clip(attn, 1e-10, 1.0)), axis=-1))


class AttentionTrainer:
    """Trains W_Q and W_K to produce a target attention pattern."""

    def __init__(self, n_tokens, d_model, d_k, learning_rate=0.05, seed=42):
        self.n = n_tokens
        self.dm = d_model
        self.dk = d_k
        self.lr = learning_rate

        rng = np.random.default_rng(seed)
        self.X = rng.normal(0, 1, (n_tokens, d_model))
        pos_enc = np.zeros_like(self.X)
        for pos in range(n_tokens):
            for i in range(d_model):
                angle = pos / (10000 ** (2 * (i // 2) / d_model))
                pos_enc[pos, i] = np.sin(angle) if i % 2 == 0 else np.cos(angle)
        self.X += pos_enc

        self.Wq = rng.normal(0, 0.5 / np.sqrt(d_model), (d_model, d_k))
        self.Wk = rng.normal(0, 0.5 / np.sqrt(d_model), (d_model, d_k))

        self.loss_history = []
        self.accuracy_history = []

    def forward(self):
        self.Q = self.X @ self.Wq
        self.K = self.X @ self.Wk
        self.attn, self.scores = scaled_dot_product_attention(self.Q, self.K, self.dk)
        return self.attn

    def train_step(self, target):
        attn = self.forward()
        loss = cross_entropy_loss(attn, target)

        dS = (attn - target) / self.n
        scale = 1.0 / np.sqrt(self.dk)

        dQ = (dS @ self.K) * scale
        dK = (dS.T @ self.Q) * scale

        dWq = (self.X.T @ dQ) / self.n
        dWk = (self.X.T @ dK) / self.n

        self.Wq -= self.lr * dWq
        self.Wk -= self.lr * dWk

        acc = np.mean(np.argmax(attn, axis=-1) == np.argmax(target, axis=-1))
        self.loss_history.append(float(loss))
        self.accuracy_history.append(float(acc))
        return loss, acc

    def train(self, target, steps=500, print_every=50):
        print(f"Training W_Q ({self.dm}x{self.dk}) and W_K ({self.dm}x{self.dk})")
        print(f"Tokens: {self.n} | d_model: {self.dm} | d_k: {self.dk} | lr: {self.lr}")
        total_params = self.Wq.size + self.Wk.size
        print(f"Trainable parameters: {total_params}")
        print("-" * 60)

        for step in range(1, steps + 1):
            loss, acc = self.train_step(target)
            if step % print_every == 0 or step == 1:
                print(f"  Step {step:5d}  |  Loss: {loss:.6f}  |  Accuracy: {acc * 100:.1f}%")

        print("-" * 60)
        print(f"  Final       |  Loss: {self.loss_history[-1]:.6f}  |  Accuracy: {self.accuracy_history[-1] * 100:.1f}%")

    def get_attention_matrix(self):
        return self.forward()

    def export(self):
        return {
            'Wq': self.Wq.tolist(),
            'Wk': self.Wk.tolist(),
            'attention': self.attn.tolist(),
            'loss_history': self.loss_history,
            'accuracy_history': self.accuracy_history,
            'config': {
                'n_tokens': self.n,
                'd_model': self.dm,
                'd_k': self.dk,
                'lr': self.lr
            }
        }


def make_target(name, n):
    if name == 'identity':
        return np.eye(n)
    elif name == 'next':
        t = np.zeros((n, n))
        for i in range(n - 1):
            t[i, i + 1] = 1.0
        t[n - 1, 0] = 1.0
        return t
    elif name == 'previous':
        t = np.zeros((n, n))
        for i in range(1, n):
            t[i, i - 1] = 1.0
        t[0, n - 1] = 1.0
        return t
    elif name == 'uniform':
        return np.ones((n, n)) / n
    else:
        raise ValueError(f"Unknown target: {name}")


def print_matrix(m, label, tokens=None):
    print(f"\n{label}:")
    n = m.shape[0]
    if tokens:
        print("       " + "  ".join(f"{t:>6}" for t in tokens))
    for i in range(n):
        row_label = f"  {tokens[i]:>5}" if tokens else f"  [{i}]"
        vals = "  ".join(f"{v:6.3f}" for v in m[i])
        print(f"{row_label}  {vals}")


def main():
    parser = argparse.ArgumentParser(description='Train attention weights via gradient descent')
    parser.add_argument('--tokens', type=int, default=6, help='Number of tokens')
    parser.add_argument('--dm', type=int, default=32, help='d_model dimension')
    parser.add_argument('--dk', type=int, default=8, help='d_k dimension')
    parser.add_argument('--lr', type=float, default=0.05, help='Learning rate')
    parser.add_argument('--steps', type=int, default=500, help='Training steps')
    parser.add_argument('--target', choices=['identity', 'next', 'previous', 'uniform'], default='identity')
    parser.add_argument('--export', type=str, help='Export results to JSON')
    args = parser.parse_args()

    token_names = ['The', 'cat', 'sat', 'on', 'the', 'mat'][:args.tokens]
    if args.tokens > len(token_names):
        token_names += [f'tok{i}' for i in range(len(token_names), args.tokens)]

    print(f"\n{'='*60}")
    print(f"  Attention Weight Training (Gradient Descent)")
    print(f"  Target: {args.target} | Tokens: {token_names}")
    print(f"{'='*60}\n")

    target = make_target(args.target, args.tokens)
    trainer = AttentionTrainer(args.tokens, args.dm, args.dk, args.lr)

    print_matrix(trainer.forward(), "Initial attention (before training)", token_names)

    start = time.time()
    trainer.train(target, steps=args.steps)
    elapsed = time.time() - start

    print_matrix(trainer.get_attention_matrix(), "Final attention (after training)", token_names)
    print_matrix(target, "Target attention", token_names)
    print(f"\n  Training time: {elapsed:.2f}s")

    if args.export:
        data = trainer.export()
        data['tokens'] = token_names
        data['target'] = target.tolist()
        with open(args.export, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"  Results exported to {args.export}")

    print()


if __name__ == '__main__':
    main()
