"""
Positional Encoding — Section 3.5
==================================
Computes and analyzes sinusoidal positional encodings from
"Attention Is All You Need" (Vaswani et al., 2017).

Demonstrates:
  - PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
  - PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
  - Position similarity via dot products
  - Relative position encoding property

Usage:
    python positional_encoding.py
    python positional_encoding.py --positions 50 --d_model 128
    python positional_encoding.py --export pe_data.json
"""

import numpy as np
import argparse
import json


def sinusoidal_positional_encoding(max_pos, d_model):
    pe = np.zeros((max_pos, d_model))
    position = np.arange(max_pos).reshape(-1, 1)
    div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))

    pe[:, 0::2] = np.sin(position * div_term)
    pe[:, 1::2] = np.cos(position * div_term[:d_model // 2])
    return pe


def position_similarity_matrix(pe):
    norms = np.linalg.norm(pe, axis=1, keepdims=True)
    normalized = pe / (norms + 1e-10)
    return normalized @ normalized.T


def analyze_relative_positions(pe, max_offset=5):
    """Show that PE(pos+k) can be expressed as a linear function of PE(pos)."""
    n, d = pe.shape
    results = []
    for k in range(1, min(max_offset + 1, n)):
        errors = []
        for pos in range(n - k):
            M = np.zeros((d, d))
            for i in range(0, d, 2):
                freq = 1.0 / (10000 ** (i / d))
                cos_k = np.cos(k * freq)
                sin_k = np.sin(k * freq)
                if i + 1 < d:
                    M[i, i] = cos_k
                    M[i, i + 1] = sin_k
                    M[i + 1, i] = -sin_k
                    M[i + 1, i + 1] = cos_k
            predicted = M @ pe[pos]
            actual = pe[pos + k]
            error = np.mean((predicted - actual) ** 2)
            errors.append(error)
        results.append({'offset': k, 'mean_error': float(np.mean(errors))})
    return results


def print_encoding_sample(pe, positions, dimensions):
    print("\nPositional Encoding Sample:")
    header = "  pos  " + "  ".join(f"  d={d:3d}" for d in dimensions)
    print(header)
    print("  " + "-" * len(header))
    for pos in positions:
        vals = "  ".join(f"{pe[pos, d]:7.4f}" for d in dimensions)
        print(f"  {pos:3d}  {vals}")


def main():
    parser = argparse.ArgumentParser(description='Analyze sinusoidal positional encodings')
    parser.add_argument('--positions', type=int, default=20, help='Number of positions')
    parser.add_argument('--d_model', type=int, default=64, help='Embedding dimension')
    parser.add_argument('--export', type=str, help='Export to JSON')
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"  Sinusoidal Positional Encoding (Section 3.5)")
    print(f"  Positions: {args.positions} | d_model: {args.d_model}")
    print(f"{'='*60}")

    pe = sinusoidal_positional_encoding(args.positions, args.d_model)

    sample_dims = [0, 1, 2, 3, args.d_model // 4, args.d_model // 2, args.d_model - 2, args.d_model - 1]
    sample_dims = [d for d in sample_dims if d < args.d_model]
    sample_pos = list(range(min(10, args.positions)))
    print_encoding_sample(pe, sample_pos, sample_dims)

    sim = position_similarity_matrix(pe)
    print(f"\nPosition Similarity Matrix (cosine similarity):")
    n_show = min(10, args.positions)
    print("       " + "  ".join(f"{j:6d}" for j in range(n_show)))
    for i in range(n_show):
        vals = "  ".join(f"{sim[i, j]:6.3f}" for j in range(n_show))
        print(f"  {i:3d}  {vals}")

    print(f"\nKey observations:")
    print(f"  - Self-similarity (diagonal): {sim[0, 0]:.4f} (always 1.0)")
    if args.positions > 1:
        print(f"  - Adjacent similarity (pos 0,1): {sim[0, 1]:.4f}")
    if args.positions > 5:
        print(f"  - Distant similarity (pos 0,5): {sim[0, 5]:.4f}")

    print(f"\nRelative Position Property:")
    print(f"  PE(pos+k) = M_k · PE(pos) where M_k depends only on k, not pos")
    rel = analyze_relative_positions(pe)
    for r in rel:
        print(f"  offset={r['offset']}: reconstruction MSE = {r['mean_error']:.2e}"
              f" {'[exact]' if r['mean_error'] < 1e-10 else ''}")

    norms = np.linalg.norm(pe, axis=1)
    print(f"\n  PE vector norms: min={norms.min():.4f}, max={norms.max():.4f}, "
          f"mean={norms.mean():.4f}")
    print(f"  Wavelengths range: 2*pi ({2*np.pi:.2f}) to 10000*2*pi ({10000*2*np.pi:.0f})")

    if args.export:
        data = {
            'encoding': pe.tolist(),
            'similarity_matrix': sim.tolist(),
            'relative_position_analysis': rel,
            'config': {'positions': args.positions, 'd_model': args.d_model}
        }
        with open(args.export, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"\n  Exported to {args.export}")

    print()


if __name__ == '__main__':
    main()
