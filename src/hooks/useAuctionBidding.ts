import { useState, useCallback } from "react";

export interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
}

export interface AuctionState {
  currentBid: number;
  bidCount: number;
  bids: Bid[];
  isEnded: boolean;
  winner: Bid | null;
}

// Mock bidder names for simulated bids
const mockBidders = [
  "GamerX99", "ProPlayer22", "EliteSniper", "DragonSlayer", 
  "NinjaWarrior", "ShadowHunter", "CryptoKing", "MasterChief"
];

function generateMockBidHistory(currentBid: number): Bid[] {
  const bids: Bid[] = [];
  let bidAmount = currentBid;
  
  for (let i = 0; i < 5; i++) {
    bidAmount -= Math.floor(Math.random() * 500) + 200;
    if (bidAmount < 1000) break;
    
    bids.push({
      id: `bid-${i}`,
      bidder: mockBidders[Math.floor(Math.random() * mockBidders.length)],
      amount: bidAmount,
      timestamp: new Date(Date.now() - (i + 1) * 60000 * Math.random() * 10),
      isWinning: false,
    });
  }
  
  return bids;
}

export function useAuctionBidding(initialBid: number, listingId: string) {
  const [state, setState] = useState<AuctionState>(() => ({
    currentBid: initialBid,
    bidCount: Math.floor(Math.random() * 15) + 5,
    bids: [
      {
        id: "current",
        bidder: mockBidders[Math.floor(Math.random() * mockBidders.length)],
        amount: initialBid,
        timestamp: new Date(Date.now() - 120000),
        isWinning: true,
      },
      ...generateMockBidHistory(initialBid),
    ],
    isEnded: false,
    winner: null,
  }));

  const placeBid = useCallback((amount: number, bidderName: string = "You") => {
    if (amount <= state.currentBid) {
      return { success: false, message: "Bid must be higher than current bid" };
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      bidder: bidderName,
      amount,
      timestamp: new Date(),
      isWinning: true,
    };

    setState(prev => ({
      ...prev,
      currentBid: amount,
      bidCount: prev.bidCount + 1,
      bids: [
        newBid,
        ...prev.bids.map(b => ({ ...b, isWinning: false })),
      ],
    }));

    return { success: true, message: "Bid placed successfully!" };
  }, [state.currentBid]);

  const endAuction = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEnded: true,
      winner: prev.bids[0] || null,
    }));
  }, []);

  // Simulate random competing bids occasionally
  const simulateCompetingBid = useCallback(() => {
    if (state.isEnded) return;
    
    const newAmount = state.currentBid + Math.floor(Math.random() * 300) + 100;
    const randomBidder = mockBidders[Math.floor(Math.random() * mockBidders.length)];
    
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      bidder: randomBidder,
      amount: newAmount,
      timestamp: new Date(),
      isWinning: true,
    };

    setState(prev => ({
      ...prev,
      currentBid: newAmount,
      bidCount: prev.bidCount + 1,
      bids: [
        newBid,
        ...prev.bids.map(b => ({ ...b, isWinning: false })),
      ],
    }));
  }, [state.currentBid, state.isEnded]);

  return {
    ...state,
    placeBid,
    endAuction,
    simulateCompetingBid,
  };
}
