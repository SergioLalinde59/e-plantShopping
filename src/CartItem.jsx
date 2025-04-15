import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import PropTypes from 'prop-types';
import './CartItem.css';
import { useEffect, useState } from 'react';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [updateMessage, setUpdateMessage] = useState({ visible: false, itemName: '', action: '' });

  // Reset update message after a delay
  useEffect(() => {
    if (updateMessage.visible) {
      const timer = setTimeout(() => {
        setUpdateMessage({ visible: false, itemName: '', action: '' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
    let total = 0;
    cart.forEach(item => {
      // Convert cost string (e.g. "$15") to number by removing $ and parsing
      const costValue = parseFloat(item.cost.replace('$', ''));
      total += costValue * item.quantity;
    });
    return total.toFixed(2); // Format to 2 decimal places
  };

  const handleContinueShopping = (e) => {
    onContinueShopping(e);
  };

  const handleCheckoutShopping = () => {
    alert('Functionality to be added for future reference');
  };

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
    setUpdateMessage({ visible: true, itemName: item.name, action: 'increased' });
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
      setUpdateMessage({ visible: true, itemName: item.name, action: 'decreased' });
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = (item) => {
    dispatch(removeItem(item.name));
    setUpdateMessage({ visible: true, itemName: item.name, action: 'removed' });
  };

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {
    const costValue = parseFloat(item.cost.replace('$', ''));
    return (costValue * item.quantity).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Shopping Cart</h2>
      {updateMessage.visible && (
        <div className="update-message">
          {`${updateMessage.itemName} was ${updateMessage.action} from your cart`}
        </div>
      )}
      {cart.length === 0 ? (
        <div className="empty-cart-message">Your cart is empty</div>
      ) : (
        <>
          {/* Total Cart Amount moved to top */}
          <div className="cart-summary" style={{ marginBottom: '20px' }}>
            <div className="total-cart-amount">
              <h3>Total Cart Amount: ${calculateTotalAmount()}</h3>
              <p>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
            </div>
          </div>
          <div>
            {cart.map(item => (
              <div className="cart-item" key={item.name}>
                <img className="cart-item-image" src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-cost">{item.cost}</div>
                  <div className="cart-item-quantity">
                    <button className="cart-item-button cart-item-button-dec" onClick={() => handleDecrement(item)}>-</button>
                    <span className="cart-item-quantity-value">{item.quantity}</span>
                    <button className="cart-item-button cart-item-button-inc" onClick={() => handleIncrement(item)}>+</button>
                  </div>
                  <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
                  <div className="cart-item-actions">
                    <button className="cart-item-delete" onClick={() => handleRemove(item)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="continue_shopping_btn">
            <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>Continue Shopping</button>
            <br />
            <button className="get-started-button1" onClick={handleCheckoutShopping}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

CartItem.propTypes = {
  onContinueShopping: PropTypes.func.isRequired
};

export default CartItem;
