import '../extraCSS/OrdersPage.css'
import ordersPageBackground from '../images/ordersPageBackground.webp'
import { Link } from 'react-router-dom';
import api from '../api/dataAxios';

const OrdersPage = ({ orders, setOrders}) => {

    const calculateTotal = (orderItem) => {
        return orderItem.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    const deleteOrder = async (orderId) => {
        const orderToDelete = orders.find(order => order.orderId === orderId); // Locate using `orderId`
        if (!orderToDelete) return;

        try{
            await api.delete(`/orders/${orderToDelete.id}`);
        }catch(err){
            console.error(err.message);
            alert("Failed to delete order");
            return;
        }
        setOrders(prevOrders => prevOrders.filter(order => order.orderId!== orderId));
    };
    
    

    return (
        <div className='ordersPageContainer'>
            <img 
                className='ordersPageBackground' 
                src={ordersPageBackground} 
                alt="Background" 
            />
            <div className='underlay'></div>

            <div className='header'>
                <Link to='/'><p className='cafeNameText'>Cafe Name</p></Link>
                <Link to='/cart'><p className='cartText'>Cart</p></Link>
            </div>

            <div className='ordersPageDisplay'>
                {orders.length > 0 ? (
                    orders.map((orderItem) => (
                        <div className='orderItem' key={orderItem.orderId}>
                            <div className='orderIdBox'>
                                <p className='orderIdNumber'>Order Id: {orderItem.orderId}</p>
                            </div>

                            <div className='orderItemsBox'>
                                {orderItem.items.map((item) => (
                                    <div className='orderedItem' key={item.id}>
                                        <div className='orderedItemImageBox'>
                                            <img
                                                className='orderedItemImage'
                                                src={item.image
                                                    ? `${process.env.PUBLIC_URL}${item.image}`
                                                    : "/fallback-image.png"}
                                                alt={item.name || "Item"}
                                            />
                                        </div>

                                        <div className='orderedItemDescription'>
                                            <div className='orderedItemNameBox'>
                                                <p className='orderedItemName'>{item.name}</p>
                                            </div>

                                            <div className='orderedItemQuantityBox'>
                                                <p className='orderedItemQuantity'>Quantity: {item.quantity}</p>
                                            </div>

                                            <div className='orderedItemPriceBox'>
                                                <p className='orderedItemPrice'>Price: ${item.price}</p>
                                            </div>

                                            <div className='orderedItemTotalBox'>
                                                <p className='orderedItemTotalText'>Item Total: </p>
                                                <p className='orderedItemTotalAmount'>
                                                    $ {(item.quantity * item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='orderTotalBox'>
                                <div className='orderTotalText'>Order Total:</div>
                                <div className='orderTotalAmount'>$ {calculateTotal(orderItem)}</div>
                                <button
                                    className='cancelOrderButton'
                                    onClick={() => deleteOrder(orderItem.orderId)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='defaultText'>No orders found.</p>
                )}
            </div>
        </div>
    )
}

export default OrdersPage;
