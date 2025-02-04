export const PriceWithDiscount = ({
  price,
  discount,
}: {
  price: number;
  discount: number;
}) => {
  const discountedPrice = getDiscountedPrice(price, discount);
  return (
    <div className="flex items-center gap-4 mt-1">
      <p className="font-bold">
        {formattedPrice(discount > 0 ? discountedPrice : price)}₮
      </p>
      {discount > 0 && (
        <>
          <span className="text-muted-foreground text-xs line-through">
            {`${formattedPrice(price)}₮`}
          </span>
          <span className="font-bold text-destructive">{discount}%</span>
        </>
      )}
    </div>
  );
};

const getDiscountedPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};
const formattedPrice = (price: number) => {
  return price.toLocaleString("en-US").replace(/,/g, "'");
};
