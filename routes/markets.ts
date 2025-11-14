import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { serializeMarket } from '../utils/serialize';

const router = Router();

/**
 * GET /api/markets
 * List all markets with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status = 'active',
      protocolId,
      limit = '20',
      offset = '0',
    } = req.query;

    const markets = await prisma.market.findMany({
      where: {
        ...(status && { status: status as string }),
        ...(protocolId && { protocolId: protocolId as string }),
      },
      include: {
        protocol: true,
        _count: {
          select: {
            bets: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.market.count({
      where: {
        ...(status && { status: status as string }),
        ...(protocolId && { protocolId: protocolId as string }),
      },
    });

    const serializedMarkets = markets.map(serializeMarket);

    res.json({
      success: true,
      data: serializedMarkets,
      meta: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch markets',
    });
  }
});

/**
 * GET /api/markets/:marketId
 * Get market by ID with full details
 */
router.get('/:marketId', async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;

    const market = await prisma.market.findUnique({
      where: { id: marketId },
      include: {
        protocol: true,
        bets: {
          orderBy: { placedAt: 'desc' },
          take: 10,
        },
        marketResolvedEvent: true,
        yieldDeposits: {
          orderBy: { depositedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!market) {
      return res.status(404).json({
        success: false,
        error: 'Market not found',
      });
    }

    const serializedMarket = serializeMarket(market);

    res.json({
      success: true,
      data: serializedMarket,
    });
  } catch (error) {
    console.error('Error fetching market:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market',
    });
  }
});

export default router;
