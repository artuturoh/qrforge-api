import { performance } from 'node:perf_hooks';
import { generateQrCode } from '../services/qrGenerator.js';
import { ValidationError } from '../services/payloadBuilder.js';
import { CONFIG } from '../config/constants.js';

export async function generate(req, res, next) {
  const start = performance.now();
  try {
    const { type = 'url', data, options = {} } = req.body || {};

    const qrResult = await generateQrCode({ type, data, options });
    const execution_time_ms = Number((performance.now() - start).toFixed(2));

    return res.status(200).json({
      success: true,
      data: qrResult,
      meta: {
        execution_time_ms,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    return next(err);
  }
}

export async function batch(req, res, next) {
  const start = performance.now();
  try {
    const { items } = req.body || {};

    if (!Array.isArray(items)) {
      throw new ValidationError('"items" field must be an array of QR code requests');
    }

    if (items.length === 0) {
      throw new ValidationError('Batch "items" array must contain between 1 and 25 items');
    }

    if (items.length > CONFIG.LIMITS.MAX_BATCH_SIZE) {
      throw new ValidationError(`Batch size (${items.length}) exceeds the maximum allowed limit of ${CONFIG.LIMITS.MAX_BATCH_SIZE} items`);
    }

    // Process all items concurrently in-memory
    const results = await Promise.all(
      items.map(async (item, index) => {
        if (!item || typeof item !== 'object') {
          throw new ValidationError(`Item at index ${index} must be an object`);
        }
        const itemResult = await generateQrCode({
          type: item.type || 'url',
          data: item.data,
          options: item.options || {}
        });

        return {
          id: item.id !== undefined ? item.id : `item_${index + 1}`,
          ...itemResult
        };
      })
    );

    const execution_time_ms = Number((performance.now() - start).toFixed(2));

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      meta: {
        execution_time_ms,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    return next(err);
  }
}
