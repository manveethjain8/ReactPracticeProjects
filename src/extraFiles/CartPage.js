import React, { useEffect, useState } from 'react';
import '../extraCSS/CartPage.css';
import cartPageBackground from '../images/cartPageBackground.webp'
import apiRequest from '../apiRequest';

const CartPage = ({ cart, setCart, totalNumberOfItems, setTotalNumberOfItems, setFetchError, API_cartURL,loggedInUser, API_ordersURL, orders, setOrders }) => {
  const [searchItem, setSearchItem] = useState('');
  const [filteredItems, setFilteredItems] = useState(cart);

  useEffect(() => {
    if (!loggedInUser) return;
    
    const userCartItems = cart
      .filter(item => item.userId === loggedInUser.id)  // Filter for logged-in user
      .filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase())); // Apply search filter
  
    setFilteredItems(userCartItems);
  }, [cart, searchItem, loggedInUser]);
  


  const increaseQuantity = async (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId && item.userId===loggedInUser.id);
    if (!itemInCart) return console.error('Item not found in cart');

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCart(updatedCart);
    setTotalNumberOfItems(updatedCart.reduce((total, item) => total + item.quantity, 0));

    const updateOption = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: itemInCart.quantity + 1 }),
    };

    const result = await apiRequest(`${API_cartURL}/${itemId}`, updateOption);
    if (result) setFetchError(result);
  };

  const decreaseQuantity = async (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId && item.userId===loggedInUser.id);
    if (!itemInCart) return console.error('Item not found in cart');

    if (itemInCart.quantity === 1) {
      removeItem(itemId);
    } else {
      const updatedCart = cart.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      );

      setCart(updatedCart);
      setTotalNumberOfItems(updatedCart.reduce((total, item) => total + item.quantity, 0));

      const updateOption = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: itemInCart.quantity - 1 }),
      };

      const result = await apiRequest(`${API_cartURL}/${itemId}`, updateOption);
      if (result) setFetchError(result);
    }
  };

  const removeItem = async (itemId) => {
    const updatedCart = cart.filter(item => !(item.id === itemId && item.userId === loggedInUser.id));
    setCart(updatedCart);
    setTotalNumberOfItems(updatedCart.reduce((total, item) => total + item.quantity, 0));
    const deleteOption = { method: 'DELETE' };
    const result = await apiRequest(`${API_cartURL}/${itemId}`, deleteOption);
    if (result) setFetchError(result);
  };

  let userCartItems = cart.filter(item => item.userId === loggedInUser.id);
  let TBT = userCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  let S = TBT < 5 ? 3 : 0;
  let TAT = TBT + S + 5; 

  const placeOrder = async (userCartItems) => {
    try {
      // Generate orderId
      const orderId = orders.length > 0 ? Number(orders[orders.length - 1].orderId) + 1 : 1;
      
      // Create order data
      const orderData = { orderId,user_name:loggedInUser.lName, user_pNumber:loggedInUser.pNumber, user_email:loggedInUser.email, userId: loggedInUser.id, items: userCartItems, cost:TAT };
      const orderOption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      };
  
      // Save order
      setOrders([...orders, orderData]);
      const result = await apiRequest(API_ordersURL, orderOption);
      if (result) {
        setFetchError(result);
        return; // Stop execution if there's an error
      }
  
      
      // ✅ Delete each item in the cart for the user
      for (const item of userCartItems) {
        await apiRequest(`${API_cartURL}/${item.id}`, { method: "DELETE" });
      }

      // Clear cart in state
      setCart([]);
      setTotalNumberOfItems(0);
  
      alert('Order placed successfully');
      setFetchError(null);
  
    } catch (error) {
      console.error("Error placing order:", error);
      setFetchError("Failed to place order.");
    }
  };
  

  return (
    <div className='cartItemsPageContainer'>
      <img className='itemsPageBackground' src={cartPageBackground} alt="Background" />
      <div className='underlay'></div>
        <div className='header'>
          <p className='cafeNameText'>Cafe Name</p>
          <input
            className='searchBox'
            type='text'
            placeholder='Search for items'
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <div className='cartIconBox'>
            <div className='cartImage'>Cart</div>
            <p className='cartQuantity'>{totalNumberOfItems}</p>
          </div>
        </div>
        <div className='cartItemsDisplay'>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="cartItemCard" key={item.id}>
                <div className="cartItemImageBox">
                  <img className="cartItemImage"                 
                  src={item.image ? `${process.env.PUBLIC_URL}${item.image}` : "/fallback-image.png"} 
                  alt={item.name || "Item"}/>
                </div>
                <div className="cartItemInfoBox">
                  <h3 className="cartItemName">{item.name}</h3>
                  <p className="cartItemPrice">$ {item.price}</p>
                  <div className="cartItemQuantityBox">
                    <p className="cartItemQuantityText">Quantity:</p>
                    <button className="cartItemDecreaseButton" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <p className="cartItemQuantityNumber">{item.quantity}</p>
                    <button className="cartItemIncreaseButton" onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <button className="cartItemRemoveButton" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))
          ) : (
            <p className='noItemsText'>No items yet. Add some to the cart</p>
          )}
        </div>

        {cart.length > 0 ? (
          <div className='paymentBox'>
            <div className='paymentText'>
              <p>Payment Details</p>
            </div>
            <div className='totalBeforeTaxAmountBox'>
              <p>Total Before Tax:</p>
              <p>$ {TBT.toFixed(2)}</p>
            </div>
            <div className='shippingAmountBox'>
              <p>Shipping:</p>
              <p>$ {S.toFixed(2)}</p>
            </div>
            <div className='totalAfterTaxAmountBox'>
              <p>Total After Tax:</p>
              <p>$ {TAT.toFixed(2)}</p>
            </div>
            <button className='checkoutButton' onClick={()=>{placeOrder(userCartItems)}}>Checkout</button>
          </div>
          ) : (
            <p>Add Items to see cart total</p>
          )}
    </div>
  );
};

export default CartPage;
