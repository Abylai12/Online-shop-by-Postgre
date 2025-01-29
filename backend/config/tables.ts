// // CREATE TABLE users (
// //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
// //     name VARCHAR(255) NOT NULL,
// //     email VARCHAR(255) UNIQUE NOT NULL,
// //     password VARCHAR(255) NOT NULL,
// //     role VARCHAR(20) CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
// // otp VARCHAR(6),
// // password_reset_token VARCHAR(255),
// // password_reset_token_expire TIMESTAMP,
// // verify
// //     created_at TIMESTAMP DEFAULT current_timestamp,
// //     updated_at TIMESTAMP DEFAULT current_timestamp
// // );

// // -- 2. Product Categories Table
// CREATE TABLE product_categories (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     name VARCHAR(255) UNIQUE NOT NULL,
//     parent_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,  -- Self-referencing for subcategories
//     description TEXT,
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );

// // -- 3. Products Table
// CREATE TABLE products (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     name VARCHAR(255) NOT NULL,
//     description TEXT,
//     stock_buy_price DECIMAL(10, 2) NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     stock_quantity INTEGER NOT NULL,
//     category_id UUID REFERENCES product_categories(id),
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );

// // -- 4. Order Statuses Table
// CREATE TABLE order_statuses (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     name VARCHAR(255) UNIQUE NOT NULL,
//     description TEXT
// );

// // // -- 5. Orders Table
// CREATE TABLE orders (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id),
//     status_id UUID REFERENCES order_statuses(id),  -- Linking to the Order Status
//     total_amount DECIMAL(10, 2) NOT NULL,
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );

// // -- 6. Order Items Table
// CREATE TABLE order_items (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     order_id UUID REFERENCES orders(id),
//     product_id UUID REFERENCES products(id),
//     quantity INTEGER NOT NULL,
//     price DECIMAL(10, 2) NOT NULL
// );

// // -- 7. Coupons Table
// CREATE TABLE coupons (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     code VARCHAR(50) UNIQUE NOT NULL,
//     discount_percentage DECIMAL(5, 2) NOT NULL,
//     isActive boolean
//      user_id UUID REFERENCE users(id)
//     valid_from TIMESTAMP,
//     valid_until TIMESTAMP
// );

// // -- 8. Discounts Table
// CREATE TABLE product_discounts (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     product_id UUID REFERENCES products(id), -- Linking product
//     discount_percentage DECIMAL(5, 2) NOT NULL, -- Percentage of discount
//     valid_from TIMESTAMP,                      -- When the discount starts
//     valid_until TIMESTAMP,                     -- When the discount ends
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );

// CREATE TABLE category_discounts (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     category_id UUID REFERENCES product_categories(id),
//     discount_percentage DECIMAL(5, 2) NOT NULL,
//     valid_from TIMESTAMP,
//     valid_until TIMESTAMP,
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );
// CREATE TABLE quantity_discounts (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     product_id UUID REFERENCES products(id),  -- Optional: Discount applied to specific product
//     category_id UUID REFERENCES categories(id),  -- Optional: Or a specific category
//     min_quantity INT NOT NULL,  -- Minimum quantity required to trigger the discount
//     discount_percentage DECIMAL(5, 2) NOT NULL,  -- Discount percentage
//     valid_from TIMESTAMP,
//     valid_until TIMESTAMP,
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );

// // -- 9. Notifications Table
// CREATE TABLE notifications (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id),
//     message TEXT NOT NULL,
//     read BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT current_timestamp
// );

// // -- 10. User Addresses Table
// CREATE TABLE user_addresses (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id),
//     address_line_1 VARCHAR(255) NOT NULL,
//     address_line_2 VARCHAR(255),
//     city VARCHAR(100) NOT NULL,
//     state VARCHAR(100),
//     postal_code VARCHAR(20) NOT NULL,
//     country VARCHAR(100) NOT NULL,
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );

// CREATE TABLE payments (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     order_id UUID REFERENCES orders(id),        -- Link to the order
//     transaction_id VARCHAR(255) NOT NULL,        -- Payment transaction ID
//     amount DECIMAL(10, 2) NOT NULL,              -- Amount paid
//     payment_method VARCHAR(50),                  -- e.g., Credit Card, PayPal, etc.
//     payment_status payment_status_enum,          -- Status of the payment (e.g., PAID, FAILED)
//     payment_date TIMESTAMP DEFAULT current_timestamp
// );

// CREATE TABLE user_wishlist (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id),
//     product_id UUID REFERENCES products(id),
//     added_at TIMESTAMP DEFAULT current_timestamp
// );

// CREATE TABLE user_comments (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id),
//     product_id UUID REFERENCES products(id),
//     comment TEXT NOT NULL,
//     images TEXT[] DEFAULT NULL, -- Makes the images array optional
//     added_at TIMESTAMP DEFAULT current_timestamp
// );
// CREATE TABLE stock_transactions (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     product_id UUID REFERENCES products(id),            -- The product being added or adjusted
//     added_quantity INTEGER NOT NULL,                     -- The quantity being added (can be negative for adjustments)
//     user_id UUID REFERENCES users(id),                  -- The user (stockman/accountant) making the change
//     transaction_type VARCHAR(50) CHECK (transaction_type IN ('addition', 'adjustment')),  -- 'addition' or 'adjustment'
//     created_at TIMESTAMP DEFAULT current_timestamp       -- Timestamp of the transaction
// );
// CREATE TABLE delivery_tracking (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     delivery_man_id UUID REFERENCES users(id),  -- Assuming 'users' table stores delivery person info
//     order_id UUID REFERENCES orders(id),  -- If you're tracking deliveries per order
//     latitude DECIMAL(9, 6),  -- Latitude with sufficient precision
//     longitude DECIMAL(9, 6), -- Longitude with sufficient precision
//     last_updated TIMESTAMP DEFAULT current_timestamp,  -- Track when the data was last updated
//     status VARCHAR(50) DEFAULT 'on_the_way',  -- Can be 'on_the_way', 'delivered', etc.
//     accuracy DECIMAL(5, 2)  -- Optionally, track GPS accuracy if needed
// );

// CREATE TABLE loyalty_points (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id),
//     points_balance INTEGER DEFAULT 0, -- The number of points the user has
//     total_earned INTEGER DEFAULT 0,    -- Total points earned
//     total_spent INTEGER DEFAULT 0,     -- Total points spent
//     created_at TIMESTAMP DEFAULT current_timestamp,
//     updated_at TIMESTAMP DEFAULT current_timestamp
// );
