const db = require("../db");

exports.createOrder = async (req, res) => {
    const client = await db.connect();

    try {
        const { user_id, items, payment_method } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Login is required to place an order" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Your cart is empty" });
        }

        if (!payment_method) {
            return res.status(400).json({ error: "Please select a payment method" });
        }

        await client.query("BEGIN");
        await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)");

        const resolvedItems = [];

        let total = 0;

        items.forEach(item => {
            total += item.price * item.quantity;
        });

        for (let item of items) {
            let productId = item.id;

            if (!productId && item.name) {
                const productResult = await client.query(
                    "SELECT id FROM products WHERE name = $1 LIMIT 1",
                    [item.name]
                );

                productId = productResult.rows[0] ? productResult.rows[0].id : null;
            }

            if (!productId) {
                await client.query("ROLLBACK");
                return res.status(400).json({ error: `Product not found for ${item.name || "cart item"}` });
            }

            resolvedItems.push({
                ...item,
                productId
            });
        }

        const orderResult = await client.query(
            "INSERT INTO orders (user_id, total, payment_method) VALUES ($1, $2, $3) RETURNING *",
            [user_id, total, payment_method]
        );

        const orderId = orderResult.rows[0].id;

        for (let item of resolvedItems) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
                [orderId, item.productId, item.quantity, item.price]
            );
        }

        await client.query("COMMIT");

        res.json({
            message: "Order placed successfully",
            orderId,
            paymentMethod: payment_method
        });

    } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};