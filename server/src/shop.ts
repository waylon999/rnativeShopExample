import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import express, { Request, Response } from 'express';
import { products, orders, order_items, SelectOrderItem } from './db/schema';
import { eq } from "drizzle-orm";


const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const db = drizzle(pool);

const handleQueryError = (err: any, res: Response) => {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while executing the query:' + err });
};

router.get('/products', async (req: Request, res: Response) => {
    try {
        const items = await db.select().from(products);
        res.json(items);
    } catch (err) {
        handleQueryError(err, res);
    }
});

router.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await db.select().from(products).where(eq(products.id, +id));
        if (item.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(item[0]);
    } catch (err) {
        handleQueryError(err, res);
    }
});

router.post('/orders', async (req: Request, res: Response) => {
    try {
        const { customer_email, products: orderBody } = req.body;

        const order = await db.transaction(async (tx) => {
            const [newOrder] = await tx.insert(orders).values({customer_email: customer_email}).returning();
            // feels kind of stupid, why not just get all the id's and fetch in a single query?
            const productPrices = await Promise.all(
                orderBody.map(async (item: any) => {
                    const [res] = await db.select().from(products).where(eq(products.id, +item.product_id));
                    return res.product_price;
                })
            );
            const orderProducts = await Promise.all(
                orderBody.map(async (item: any, index: number) => {
                    const total = (+productPrices[index] * +item.quantity).toFixed(2);
                    const [orderProduct] = await tx.insert(order_items).values({
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        total: +total
                    }).returning();
                    return orderProduct;
                })
            );
            // total up the price
            const total = orderProducts.reduce((a: number, b: SelectOrderItem) => a + b.total, 0);

            const [updatedOrder] = await tx.update(orders).set({ 
                total: total.toFixed(2) 
            }).where(
                eq(orders.id, newOrder.id)
            ).returning();
            return {...updatedOrder, products: orderProducts};
        });
        // send the new order back to the client
        res.json(order);
    } catch (err) {
        handleQueryError(err, res);
    }
})

export default router;