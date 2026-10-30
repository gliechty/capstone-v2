"use client";
import { createContext } from 'react';
import type { RecommendationView } from '../../application/recommendations/controller';
// Share the existing Results view; this does not fetch or generate recommendations.
export const RecommendationViewContext = createContext<RecommendationView | null>(null);
