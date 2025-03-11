import React, { useState, useEffect } from 'react';
import '../extraCSS/ItemsPage.css';
import itemsPageImage from '../images/itemsPageImage.webp';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/dataAxios';
import { useContext} from 'react';
import DataContext from '../context/DataContext';


const ItemsPage = () => {
  const { menuItems, cart, setCart, totalNumberOfItems,setTotalNumberOfItems,loggedInUser }=useContext(DataContext);
  
  const [searchItem, setSearchItem] = useState('');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [itemId, setItemId] = useState(''); // Will hold the item ID when adding to cart
  const navigate=useNavigate();
  


  // Filter items as the user types
  useEffect(() => {
    const filtered = menuItems.filter(item =>
      ((item.name).toLowerCase()).includes(searchItem.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchItem, menuItems]); // Run when searchItem or menuItems change

  /*useEffect(()=>{
    if(itemId==='') return; //

    const addToCart=async() =>{
      const matchingItem=menuItems.find(item =>item.id===itemId);
      if(!matchingItem) return;

      let itemInCart=cart.find(item => item.id===itemId);
      if(itemInCart){
        itemInCart.quantity+=1;
        const updateOption={
          method:'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({quantity:itemInCart.quantity})
        }
        const result = await apiRequest(`${API_cartURL}/${itemId}`, updateOption);
        if(result) setFetchError(result);
      }else{
        let newItem={id:matchingItem.id,name:matchingItem.name, image:matchingItem.image, price:matchingItem.price, quantity:1};
        const postOptions={
          method:'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newItem)
        }
        const result=await apiRequest(API_cartURL,postOptions);
        if(result) setFetchError(result); 
        setCart([...cart, newItem]);
      }
      setItemId('');
      setTotalNumberOfItems(cart.reduce((total, item) => total + item.quantity, 0));
    }
    addToCart(); // Run the function when itemId changes
  },[itemId]);*/ //Because starting item doesn't change the total number of items

  useEffect(() => {
    if (itemId === '') return;
  
    const addToCart = async () => {
      if (!loggedInUser) {
          alert("Please log in to add items to the cart.");
          navigate('/login');
          return;
      }
  
      const matchingItem = menuItems.find(item => item.id === itemId);
      if (!matchingItem) return;
  
      let updatedCart = [...cart]; // Copy current cart
      let itemInCart = updatedCart.find(item => item.id === itemId && item.userId === loggedInUser.id);
  
      if (itemInCart) {
          // If item already exists for this user, increase quantity
        itemInCart.quantity += 1;

        try{
          await api.patch(`/cart/${itemInCart.id}`,{quantity:itemInCart.quantity});
        }catch(err){
          console.error('Error updating cart item:', err);
          alert('Error updating cart item');
          return;
        }
      } else {
          // If item is new, add userId and save it
          let newItem = {
              id: matchingItem.id,
              userId: loggedInUser.id,  // 🔥 Add user ID here
              name: matchingItem.name,
              image: matchingItem.image,
              price: matchingItem.price,
              quantity: 1,
          };
  
  
          try{
            const response=await api.post('/cart',newItem);
            updatedCart = [...updatedCart, response.data];
          }catch(err){
            console.error('Error adding new cart item:', err);
            alert('Error adding new cart item');
            return;
          }
      }
  
      setCart(updatedCart); // Update cart state
      setTotalNumberOfItems(updatedCart.reduce((total, item) => total + item.quantity, 0)); // Update total count
      setItemId('');
  };
  
  
    addToCart();
  }, [itemId]);

  return (

    <div className='itemsPageContainer'>
      <img className='itemsPageBackground' src={itemsPageImage} alt="Background" />
      <div className='underlay'>
        <div className='header'>
          <Link to='/'><p className='cafeNameText'>Cafe Name</p></Link>
          <Link to='/orders'><p className='ordersTextI'>Orders</p></Link>
          <Link to='/cart'><p className='cartText'>Cart</p></Link>
          <input
            className='searchBox'
            type='text'
            placeholder='Search for items'
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <Link to="/cart"><div className='cartIconBox'>
            <div className='cartImage'>Cart</div>
            <p className='cartQuantity'>{totalNumberOfItems}</p>
          </div></Link>
        </div>
        <div className='itemsDisplay'>
          {filteredItems.length>0?(
            filteredItems.map((item) => (
              <div className='itemCard' key={item.id}>
                <div className='itemImageBox'>
                <img className="itemImage" src={item.image ? `${process.env.PUBLIC_URL}${item.image}` : "/fallback-image.png"} 
                  alt={item.name || "Item"}/>

                </div>
                <div className='itemNameBox'>
                  <p className='itemName'>{item.name}</p>
                </div>
                <div className='itemDescriptionBox'>
                  <p className='itemDescription'>{item.description}</p>
                </div>
                <div className='itemPriceBox'>
                  <p className='itemPrice'>${item.price}</p>
                </div>
                <button className='addButton' onClick={()=>setItemId(item.id)}>Add to Cart</button>
              </div>
            ))
          ):(
            <p className='noItemsText'>No items found. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
