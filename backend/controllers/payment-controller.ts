import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { sql } from "../config/connect-to-tb";
import { Coupon, OrderItems } from "../types/types";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { products, couponCode } = req.body;
    const { id } = req.user;
    console.log("id", products);

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Invalid or empty products array");
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.images[0]],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon: Coupon | null = null;
    if (couponCode) {
      const [couponRows] = await sql`
        SELECT * FROM coupons WHERE user_id = ${id} AND isActive = true AND code = ${couponCode}
      `;
      coupon = couponRows.length > 0 ? couponRows[0] : null;

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discount_percentage) / 100
        );
      }
    }
    console.log("line items", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discount_percentage),
            },
          ]
        : [],
      metadata: {
        userId: id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p.productId,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    console.log("total amount", totalAmount);

    if (totalAmount >= 20000) {
      await createNewCoupon(id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ message: "Error processing checkout", error });
  }
};

export const checkoutSuccess = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" && session.metadata) {
      if (session.metadata.couponCode) {
        await sql`UPDATE coupons SET isActive=${false} WHERE user_id=${
          session.metadata?.userId
        } AND code=${session.metadata?.couponCode} `;
      }

      const products = JSON.parse(session.metadata.products);

      const [orderDeliveryStatus] = await sql`
      INSERT INTO order_statuses (status) 
      VALUES ('pending') 
      RETURNING id
    `;

      const [newOrder] = await sql`
      INSERT INTO orders (user_id, status_id, total_amount) 
      VALUES (${session.metadata.userId}, ${orderDeliveryStatus.id}, ${
        session.amount_total! / 100
      })
      RETURNING id
    `;

      const newItems = products.map((product: OrderItems) => ({
        order_id: newOrder.id,
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
      }));

      // Now insert all the items into the order_items table
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES
        ${sql(
          newItems.map((item: OrderItems) => [
            item.order_id,
            item.product_id,
            item.quantity,
            item.price,
          ])
        )}
        RETURNING *;
      `;

      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder.id,
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({
      message: "Error processing successful checkout",
      error,
    });
  }
};

const createStripeCoupon = async (discountPercentage: number) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
};

const createNewCoupon = async (userId: string) => {
  await sql`DELETE FROM coupons WHERE user_id=${userId} `;

  const newCoupon = await sql`
  INSERT INTO coupons (code, discount_percentage, valid_until, user_id)
  VALUES (
    ${"GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase()},
    10,
    ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()},
    ${userId} 
  )`;

  return newCoupon;
};
