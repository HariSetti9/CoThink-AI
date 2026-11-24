"""Illustrative power sensitivity for a two-arm, individually randomized study."""

import argparse
import math
from statistics import NormalDist


def enrollment_per_arm(effect, correlation, alpha, power, attrition):
    """Return analyzable and recruitment counts under a normal approximation."""
    normal = NormalDist()
    z_alpha = normal.inv_cdf(1 - alpha / 2)
    z_power = normal.inv_cdf(power)
    residual_variance = 1 - correlation**2
    analyzable = math.ceil(2 * residual_variance * (z_alpha + z_power)**2 / effect**2)
    return analyzable, math.ceil(analyzable / (1 - attrition))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--effects", nargs="+", type=float, default=[0.3, 0.4, 0.5])
    parser.add_argument("--correlations", nargs="+", type=float, default=[0.0, 0.4, 0.6])
    parser.add_argument("--alpha", type=float, default=0.05)
    parser.add_argument("--power", type=float, default=0.8)
    parser.add_argument("--attrition", type=float, default=0.15)
    args = parser.parse_args()

    if not all(math.isfinite(d) and d > 0 for d in args.effects):
        parser.error("effects must be finite standardized differences greater than zero")
    if not all(0 <= r < 1 for r in args.correlations):
        parser.error("correlations must be within [0, 1)")
    if not (0 < args.alpha < 1 and 0.5 < args.power < 1 and 0 <= args.attrition < 1):
        parser.error("require 0 < alpha < 1, 0.5 < power < 1, and 0 <= attrition < 1")

    print("effect_d,baseline_correlation,alpha,power,attrition,analyzable_per_arm,recruit_per_arm")
    for effect in args.effects:
        for correlation in args.correlations:
            analyzable, recruit = enrollment_per_arm(effect, correlation, args.alpha, args.power, args.attrition)
            print(f"{effect:g},{correlation:g},{args.alpha:g},{args.power:g},{args.attrition:g},{analyzable},{recruit}")


if __name__ == "__main__":
    main()
