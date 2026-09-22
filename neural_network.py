"""
Feedforward Neural Network from Scratch
========================================
Implements a multi-layer perceptron with backpropagation and SGD
using only NumPy. No frameworks — every gradient is computed manually
via the chain rule.

Trains on 2D classification tasks (XOR, circle, spiral, moons).

Usage:
    python neural_network.py
    python neural_network.py --dataset spiral --hidden 12 --lr 0.5 --epochs 5000
    python neural_network.py --dataset moons --layers 2 --hidden 8
"""

import numpy as np
import argparse
import json
import time


class Layer:
    """Single fully-connected layer with weights, biases, and activation."""

    def __init__(self, n_in, n_out, activation='relu', rng=None):
        if rng is None:
            rng = np.random.default_rng(42)
        self.W = rng.normal(0, np.sqrt(2.0 / n_in), (n_in, n_out))
        self.b = np.zeros((1, n_out))
        self.activation = activation
        self.z = None
        self.a_in = None
        self.dW = None
        self.db = None

    def forward(self, x):
        self.a_in = x
        self.z = x @ self.W + self.b
        if self.activation == 'relu':
            return np.maximum(0, self.z)
        elif self.activation == 'sigmoid':
            return 1 / (1 + np.exp(-np.clip(self.z, -500, 500)))
        return self.z

    def backward(self, da):
        if self.activation == 'relu':
            dz = da * (self.z > 0).astype(float)
        elif self.activation == 'sigmoid':
            s = 1 / (1 + np.exp(-np.clip(self.z, -500, 500)))
            dz = da * s * (1 - s)
        else:
            dz = da

        m = self.a_in.shape[0]
        self.dW = (self.a_in.T @ dz) / m
        self.db = np.sum(dz, axis=0, keepdims=True) / m
        return dz @ self.W.T

    def update(self, lr):
        self.W -= lr * self.dW
        self.b -= lr * self.db


class NeuralNetwork:
    """Multi-layer feedforward neural network trained with SGD."""

    def __init__(self, layer_sizes, learning_rate=0.5, seed=42):
        self.lr = learning_rate
        self.layers = []
        rng = np.random.default_rng(seed)
        for i in range(len(layer_sizes) - 1):
            act = 'sigmoid' if i == len(layer_sizes) - 2 else 'relu'
            self.layers.append(Layer(layer_sizes[i], layer_sizes[i + 1], act, rng))
        self.loss_history = []

    def forward(self, x):
        a = x
        for layer in self.layers:
            a = layer.forward(a)
        return a

    def compute_loss(self, y_pred, y_true):
        p = np.clip(y_pred, 1e-7, 1 - 1e-7)
        return -np.mean(y_true * np.log(p) + (1 - y_true) * np.log(1 - p))

    def backward(self, y_pred, y_true):
        p = np.clip(y_pred, 1e-7, 1 - 1e-7)
        da = -(y_true / p - (1 - y_true) / (1 - p))
        for layer in reversed(self.layers):
            da = layer.backward(da)

    def train_step(self, x, y):
        y_pred = self.forward(x)
        loss = self.compute_loss(y_pred, y)
        self.backward(y_pred, y)
        for layer in self.layers:
            layer.update(self.lr)
        return loss

    def train(self, x, y, epochs=2000, print_every=200):
        print(f"Training {self.param_count()} parameters for {epochs} epochs (lr={self.lr})")
        print("-" * 60)
        for epoch in range(1, epochs + 1):
            loss = self.train_step(x, y)
            self.loss_history.append(loss)
            if epoch % print_every == 0 or epoch == 1:
                acc = self.accuracy(x, y)
                print(f"  Epoch {epoch:5d}  |  Loss: {loss:.6f}  |  Accuracy: {acc:.1f}%")
        acc = self.accuracy(x, y)
        print("-" * 60)
        print(f"  Final       |  Loss: {self.loss_history[-1]:.6f}  |  Accuracy: {acc:.1f}%")
        return self.loss_history

    def predict(self, x):
        return (self.forward(x) > 0.5).astype(int)

    def accuracy(self, x, y):
        preds = self.predict(x)
        return np.mean(preds == y) * 100

    def param_count(self):
        return sum(l.W.size + l.b.size for l in self.layers)

    def export_weights(self):
        return [{'W': l.W.tolist(), 'b': l.b.tolist(), 'activation': l.activation}
                for l in self.layers]


def generate_dataset(name, n=300, seed=42):
    rng = np.random.default_rng(seed)
    if name == 'xor':
        x = rng.uniform(-1, 1, (n, 2))
        y = ((x[:, 0] * x[:, 1]) > 0).astype(float).reshape(-1, 1)
    elif name == 'circle':
        x = rng.uniform(-1, 1, (n, 2))
        y = ((x[:, 0] ** 2 + x[:, 1] ** 2) < 0.5).astype(float).reshape(-1, 1)
    elif name == 'spiral':
        t = np.linspace(0, 3, n // 2)
        noise = rng.normal(0, 0.15, n // 2)
        x0 = np.column_stack([t * np.cos(t) + noise, t * np.sin(t) + noise]) / 3
        x1 = np.column_stack([t * np.cos(t + np.pi) + noise, t * np.sin(t + np.pi) + noise]) / 3
        x = np.vstack([x0, x1])
        y = np.array([0] * (n // 2) + [1] * (n // 2), dtype=float).reshape(-1, 1)
    elif name == 'moons':
        t0 = np.linspace(0, np.pi, n // 2)
        t1 = np.linspace(0, np.pi, n // 2)
        noise = rng.normal(0, 0.1, (n // 2, 2))
        x0 = np.column_stack([np.cos(t0), np.sin(t0)]) + noise - [0.5, -0.1]
        x1 = np.column_stack([np.cos(t1), -np.sin(t1)]) + noise + [0.0, 0.1]
        x = np.vstack([x0, x1])
        y = np.array([0] * (n // 2) + [1] * (n // 2), dtype=float).reshape(-1, 1)
    else:
        raise ValueError(f"Unknown dataset: {name}")
    return x, y


def main():
    parser = argparse.ArgumentParser(description='Train a neural network from scratch')
    parser.add_argument('--dataset', choices=['xor', 'circle', 'spiral', 'moons'], default='xor')
    parser.add_argument('--hidden', type=int, default=8, help='Neurons per hidden layer')
    parser.add_argument('--layers', type=int, default=1, choices=[1, 2], help='Number of hidden layers')
    parser.add_argument('--lr', type=float, default=0.5, help='Learning rate')
    parser.add_argument('--epochs', type=int, default=3000, help='Training epochs')
    parser.add_argument('--export', type=str, help='Export trained weights to JSON file')
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"  Neural Network from Scratch")
    print(f"  Dataset: {args.dataset} | Hidden: {args.hidden} x {args.layers} layers")
    print(f"{'='*60}\n")

    x, y = generate_dataset(args.dataset)
    print(f"Generated {len(x)} samples ({int(y.sum())} positive, {int(len(y) - y.sum())} negative)\n")

    sizes = [2] + [args.hidden] * args.layers + [1]
    nn = NeuralNetwork(sizes, learning_rate=args.lr)

    start = time.time()
    nn.train(x, y, epochs=args.epochs)
    elapsed = time.time() - start

    print(f"\n  Time: {elapsed:.2f}s | Architecture: {' -> '.join(map(str, sizes))}")

    if args.export:
        data = {
            'architecture': sizes,
            'dataset': args.dataset,
            'final_loss': nn.loss_history[-1],
            'final_accuracy': nn.accuracy(x, y),
            'loss_history': nn.loss_history,
            'weights': nn.export_weights(),
            'training_config': {'lr': args.lr, 'epochs': args.epochs}
        }
        with open(args.export, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"  Weights exported to {args.export}")

    print()


if __name__ == '__main__':
    main()
