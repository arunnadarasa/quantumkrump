export interface KrumpMove {
  bitstring: string;
  name: string;
  description: string;
  energy: number;
  emoji: string;
  components: {
    jabStomp: boolean;
    armSwing: boolean;
    chestPop: boolean;
  };
}

export const KRUMP_MOVES: Record<string, KrumpMove> = {
  '000': {
    bitstring: '000',
    name: 'The Stillness',
    description: 'Neutral stance, ready to move',
    energy: 0,
    emoji: '🕴️',
    components: { jabStomp: false, armSwing: false, chestPop: false }
  },
  '001': {
    bitstring: '001',
    name: 'Chest Pop',
    description: 'Sharp chest isolation, controlled power',
    energy: 1,
    emoji: '💢',
    components: { jabStomp: false, armSwing: false, chestPop: true }
  },
  '010': {
    bitstring: '010',
    name: 'Arm Swing',
    description: 'Dynamic arm motion, expressing emotion',
    energy: 1,
    emoji: '🙌',
    components: { jabStomp: false, armSwing: true, chestPop: false }
  },
  '011': {
    bitstring: '011',
    name: 'Upper Body Flow',
    description: 'Swing and pop combined, fluid movement',
    energy: 2,
    emoji: '🤸',
    components: { jabStomp: false, armSwing: true, chestPop: true }
  },
  '100': {
    bitstring: '100',
    name: 'Stomp',
    description: 'Ground connection, powerful foundation',
    energy: 1,
    emoji: '👟',
    components: { jabStomp: true, armSwing: false, chestPop: false }
  },
  '101': {
    bitstring: '101',
    name: 'Stomp & Pop',
    description: 'Ground to chest, explosive vertical energy',
    energy: 2,
    emoji: '💥',
    components: { jabStomp: true, armSwing: false, chestPop: true }
  },
  '110': {
    bitstring: '110',
    name: 'Stomp & Swing',
    description: 'Grounded power with reaching motion',
    energy: 2,
    emoji: '⚡',
    components: { jabStomp: true, armSwing: true, chestPop: false }
  },
  '111': {
    bitstring: '111',
    name: 'Full Krump',
    description: 'Maximum intensity, all elements unleashed',
    energy: 3,
    emoji: '🔥',
    components: { jabStomp: true, armSwing: true, chestPop: true }
  }
};

export interface DecodedMove extends KrumpMove {
  count: number;
  probability: number;
}

export function decodeKrumpResults(
  measurements: Record<string, number>,
  probabilities: Record<string, number>
): DecodedMove[] {
  return Object.entries(measurements).map(([bitstring, count]) => ({
    ...KRUMP_MOVES[bitstring],
    count,
    probability: probabilities[bitstring] || 0
  })).sort((a, b) => b.probability - a.probability);
}

export function getEnergyLevel(energy: number): string {
  switch (energy) {
    case 0: return '⚡';
    case 1: return '⚡⚡';
    case 2: return '⚡⚡⚡';
    case 3: return '⚡⚡⚡⚡';
    default: return '⚡';
  }
}

export function getSuggestedRoutine(decodedMoves: DecodedMove[], topN: number = 5): DecodedMove[] {
  return decodedMoves.slice(0, topN);
}
