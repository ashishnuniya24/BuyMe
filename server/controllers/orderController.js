const db = require("../db");

exports.createOrder = async (req, res) => {
    try {
        const { user_id, items } = req.body;

        let total = 0;

        items.forEach(item => {
            total += item.price * item.quantity;
        });

        const orderResult = await db.query(
            "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
            [user_id, total]
        );

        const orderId = orderResult.rows[0].id;

        for (let item of items) {
            await db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
                [orderId, item.id, item.quantity, item.price]
            );
        }

        res.json({
            message: "Order placed successfully",
            orderId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};