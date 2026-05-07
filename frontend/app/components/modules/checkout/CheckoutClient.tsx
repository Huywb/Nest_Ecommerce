"use client";
import React, { useEffect, useState } from "react";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutSteps from "./CheckoutSteps";
import PaymentMethodCard from "./PaymentMethodCard";
import { Check, CreditCard } from "lucide-react";
import { usePayment } from "@/app/hooks/usePayment";
import StripePaymentProvider, {
  StripePaymentForm,
} from "./StripePaymentProvider";
import { useCart } from "@/app/hooks/useCart";
import { useRouter } from "next/navigation";
import { OrderItem } from "@/app/types/order.type";
import { useOrder } from "@/app/hooks/useOrder";

type Step = 1 | 2 | 3;

const CheckoutClient = () => {
  const [currentSteps, setCurrentSteps] = useState<Step | number>(1);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const router = useRouter();

  console.log(currentSteps)

  const { totalPrice, items, clearCart,cart } = useCart();
  const { createOrder } = useOrder();
  const { clientSecret, confirmPayment, createPaymentIntent } = usePayment();


  const handlePaymentSuccess = async (paymentIntentId: string,step:number) => {
    try {
      setCurrentSteps(step);

      const confirmed = await confirmPayment({ orderId, paymentIntentId });

      if (!confirmed) {
        throw new Error("Failed to confirm Payment");
      }
      await clearCart();
    } catch (error) {
      const message = "Error confirm payment" + error;
      setStripeError(message);
    }
  };

  useEffect(() => {
    if (items.length == 0 && !orderId) {
      router.push("/cart");
    }
  }, [orderId, items, router]);

  useEffect(() => {
    const createOrderAutomationly = async () => {
      if (selectedPayment && !orderId && !isCreatingOrder && !clientSecret) {
        setIsCreatingOrder(true);
        setStripeError(null);

        try {
          const cartItem: OrderItem[] = items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          }));

          const order = await createOrder({
            items: cartItem,
            shippingAddress: "Test Street 1234",
          });

          if (!order) {
            throw new Error("Failed to create order");
          }
          setOrderId(order.id)

          if (selectedPayment === "stripe") {
            const paymentCreated = await createPaymentIntent({
              orderId: order.id,
              amount: totalPrice,
              description: "Order Payment testing",
              currency: "usd",
            });

            if (!paymentCreated) {
              throw new Error("Failed to create payment");
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : String(error) || "Failed to create payment intent";
          setStripeError(errorMessage);
        } finally {
          setIsCreatingOrder(false);
        }
      }
    };
    createOrderAutomationly();
  }, [
    selectedPayment,
    orderId,
    isCreatingOrder,
    clientSecret,
    items,
    createOrder,
    createPaymentIntent,
    totalPrice,
  ]);

  const handlePaymentError = (error: string) => {
    setStripeError(error);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPayment(method);
    setStripeError(null);
  };
  return (
    <section className="max-w-300 mx-auto ">
      <div className="w-full flex flex-col items-center justify-center h-full gap-10">
        <CheckoutHeader />
        <CheckoutSteps checkStep={currentSteps} />
        <div className="max-w-500 flex flex-col gap-4 ">
          {currentSteps === 1 && (
            <div className="flex flex-col gap-4 ">
              <h2 className="text-xl font-bold">Select Payment Method</h2>
              <div
                className={`${selectedPayment === "stripe" ? "border-2 border-black" : ""} cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-gray-200 flex w-full rounded-md`}
              >
                {/*tripe*/}
                <PaymentMethodCard
                  method="stripe"
                  selectMethod={selectedPayment}
                  onSelect={handlePaymentMethodSelect}
                  icon={<CreditCard />}
                  title="Credit / Debit Card"
                  description="Pay securely with stripe"
                >
                  {stripeError && <div className="">{stripeError}</div>}

                  {isCreatingOrder && !clientSecret && (
                    <div className="flex items-center justify-center flex-col">
                      <div className="animate-spin duration-300 transition-all h-10 w-10"></div>
                      <div className="">Creating your order</div>
                    </div>
                  )}

                  {clientSecret && (
                    <div className="min-h-[300px] transition-all duration-300">
                    <StripePaymentProvider
                      clientSecret={clientSecret}
                      amount={totalPrice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    >
                      <StripePaymentForm
                        amount={totalPrice}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </StripePaymentProvider>
                    </div>
                  )}
                </PaymentMethodCard>
                
              </div>
            </div>
          )}

          {currentSteps === 3 && (
            <div className=" w-full">
              <div className="flex items-center justify-center flex-col">
                <Check size={80} strokeWidth={2} className="text-green-500 border rounded-full p-2 border-4" />
                <h2 className="text-green-400">Order placed successfully</h2>
                <div className="flex flex-col items-start">

                <p>Your order #{orderId} has been confirmed</p>
                <p className="">
                 
                  <strong>  Shipping to :</strong> Testing Address shipping payment method
                </p>
                </div>

                <button className="p-4 bg-gray-950 hover:text-white hover:bg-black transition-all duration-300 w-full mt-4 text-gray-100 cursor-pointer" onClick={() => router.push("/user/orders")}>
                  Go to my orders
                </button>
              </div>
            </div>
          )}

          <div className=" bg-gray-200 p-4 w-full flex flex-col gap-4 border-gray-600 rounded-md">
          <h1 className="font-bold text-xl">Order Sumary</h1>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <p className="text-gray-800 font-medium">${cart.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <p className="text-gray-800 font-medium">Free</p>
            </div>
          </div>
          <span className="bg-gray-300 h-[0.5]" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <p>${cart.totalPrice.toFixed(2)}</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutClient;
