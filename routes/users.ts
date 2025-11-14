import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { serializeBet, serializeMarket } from '../utils/serialize';

const router = Router();

/**
 * GET /api/users/:address/bets
 * Get all bets by user address
 */
router.get('/:address/bets', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const bets = await prisma.bet.findMany({
      where: { bettor: address },
      include: {
        market: {
          include: { protocol: true },
        },
        winningsClaimed: true,
      },
      orderBy: { placedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.bet.count({
      where: { bettor: address },
    });

    const serializedBets = bets.map((bet) => ({
      ...serializeBet(bet),
      market: serializeMarket(bet.market),
      winningsClaimed: bet.winningsClaimed
        ? {
            ...bet.winningsClaimed,
            winningAmount: bet.winningsClaimed.winningAmount?.toString() || '0',
            yieldShare: bet.winningsClaimed.yieldShare?.toString() || '0',
          }
        : null,
    }));

    res.json({
      success: true,
      data: serializedBets,
      meta: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Error fetching user bets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user bets',
    });
  }
});

export default router;
